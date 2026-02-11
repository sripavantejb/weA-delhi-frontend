import { useMemo, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from '../components/Calendar';
import { PostsList } from '../components/PostsList';
import { CreatePostModal } from '../components/CreatePostModal';
import { StatsOverview } from '../components/StatsOverview';
import { PlatformPerformance } from '../components/PlatformPerformance';
import { RecentPostsPerformance } from '../components/RecentPostsPerformance';
import { ContentPlanForm } from '../components/ContentPlanForm';
import { ContentPlanLoader } from '../components/ContentPlanLoader';
import { ContentPlanResults } from '../components/ContentPlanResults';
import { AddToCalendarPrompt } from '../components/AddToCalendarPrompt';
import { DateDetailDrawer } from '../components/DateDetailDrawer';
import { QuickTips } from '../components/QuickTips';
import { Card, CardTitle } from '../components/ui/Card';
import type { Post, CreatePostForm, EngagementStats, PlatformStats, ContentPlanIdea, ContentPlanInputs } from '../types/content';
import {
  MOCK_POSTS_BY_DATE,
  MOCK_RECENT_POSTS,
  getEngagementForPosts,
} from '../data/mockData';
import { generateContentPlan, insertContentPlan, getPosts, getToken, createPost, updatePost, deletePost } from '../api/client';

function toDateKey(d: Date): string {
  return (
    d.getFullYear() +
    '-' +
    String(d.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(d.getDate()).padStart(2, '0')
  );
}

function generateId(): string {
  return 'post-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9);
}

export function ContentPlanner() {
  const navigate = useNavigate();
  const hasToken = !!getToken();
  const [postsByDate, setPostsByDate] = useState<Record<string, Post[]>>(() =>
    hasToken ? {} : { ...MOCK_POSTS_BY_DATE }
  );
  const [recentPosts, setRecentPosts] = useState<Post[]>(MOCK_RECENT_POSTS);
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => new Date());
  const [detailDate, setDetailDate] = useState<Date | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitialDate, setModalInitialDate] = useState<string | undefined>();
  const [modalInitialPost, setModalInitialPost] = useState<Post | null>(null);

  const [contentPlanIdeas, setContentPlanIdeas] = useState<ContentPlanIdea[] | null>(null);
  const [contentPlanLoading, setContentPlanLoading] = useState(false);
  const [contentPlanError, setContentPlanError] = useState<string | null>(null);
  const [contentPlanInserting, setContentPlanInserting] = useState(false);
  const [contentPlanInserted, setContentPlanInserted] = useState(false);
  const [contentPlanInsertError, setContentPlanInsertError] = useState<string | null>(null);

  const [calendarView, setCalendarView] = useState(() => {
    const n = new Date();
    return { year: n.getFullYear(), month: n.getMonth() };
  });

  const monthStr = `${calendarView.year}-${String(calendarView.month + 1).padStart(2, '0')}`;
  const refetchPosts = useCallback(async () => {
    if (!getToken()) return;
    try {
      const { posts } = await getPosts({ month: monthStr });
      const byDate: Record<string, Post[]> = {};
      posts.forEach((p) => {
        const date = (p as Post).date;
        if (!date) return;
        if (!byDate[date]) byDate[date] = [];
        byDate[date].push(p as Post);
      });
      setPostsByDate((prev) => ({ ...prev, ...byDate }));
    } catch {
      if (!getToken()) navigate('/login');
    }
  }, [monthStr, navigate]);

  useEffect(() => {
    refetchPosts();
  }, [refetchPosts]);

  useEffect(() => {
    if (!getToken()) return;
    getPosts({ recent: true, limit: 4 })
      .then(({ posts }) => setRecentPosts(posts))
      .catch(() => {});
  }, [postsByDate]);

  const handlePrevMonth = useCallback(() => {
    setCalendarView((prev) => {
      if (prev.month === 0) return { year: prev.year - 1, month: 11 };
      return { year: prev.year, month: prev.month - 1 };
    });
  }, []);
  const handleNextMonth = useCallback(() => {
    setCalendarView((prev) => {
      if (prev.month === 11) return { year: prev.year + 1, month: 0 };
      return { year: prev.year, month: prev.month + 1 };
    });
  }, []);
  const handleToday = useCallback(() => {
    const n = new Date();
    setSelectedDate(n);
    setCalendarView({ year: n.getFullYear(), month: n.getMonth() });
  }, []);

  const datesWithPosts = useMemo(() => {
    const set = new Set<string>();
    Object.keys(postsByDate).forEach((key) => set.add(key));
    return set;
  }, [postsByDate]);

  const postsForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    const key = toDateKey(selectedDate);
    return postsByDate[key] ?? [];
  }, [selectedDate, postsByDate]);

  const engagementForSelectedDate: EngagementStats = useMemo(
    () => getEngagementForPosts(postsForSelectedDate),
    [postsForSelectedDate]
  );

  const platformStats: PlatformStats[] = useMemo(() => {
    const byPlatform: Record<string, { posts: number; views: number; likes: number }> = {
      Twitter: { posts: 0, views: 0, likes: 0 },
      LinkedIn: { posts: 0, views: 0, likes: 0 },
      Instagram: { posts: 0, views: 0, likes: 0 },
    };
    Object.values(postsByDate).flat().forEach((p) => {
      p.platforms.forEach((pl) => {
        if (byPlatform[pl]) {
          byPlatform[pl].posts += 1;
          byPlatform[pl].views += p.views;
          byPlatform[pl].likes += p.likes;
        }
      });
    });
    return (['Twitter', 'LinkedIn', 'Instagram'] as const).map((platform) => ({
      platform,
      posts: byPlatform[platform]?.posts ?? 0,
      views: byPlatform[platform]?.views ?? 0,
      likes: byPlatform[platform]?.likes ?? 0,
    }));
  }, [postsByDate]);

  const handleSavePost = useCallback(
    async (form: CreatePostForm) => {
      if (getToken()) {
        try {
          const { post } = await createPost(form);
          setPostsByDate((prev) => {
            const list = prev[form.date] ?? [];
            return { ...prev, [form.date]: [...list, post] };
          });
          await refetchPosts();
        } catch {
          if (!getToken()) navigate('/login');
        }
        return;
      }
      const post: Post = {
        id: generateId(),
        type: form.type,
        caption: form.caption,
        date: form.date,
        time: form.time,
        platforms: form.platforms.length > 0 ? form.platforms : ['Twitter'],
        views: 0,
        likes: 0,
        shares: 0,
        comments: 0,
      };
      setPostsByDate((prev) => {
        const list = prev[form.date] ?? [];
        return { ...prev, [form.date]: [...list, post] };
      });
    },
    [navigate, refetchPosts]
  );

  const openModalForDate = useCallback((date: Date) => {
    setModalInitialDate(toDateKey(date));
    setModalInitialPost(null);
    setModalOpen(true);
  }, []);

  const handleSelectDate = useCallback((date: Date) => {
    setSelectedDate(date);
    setDetailDate(date);
  }, []);

  const postsForDetailDate = useMemo(() => {
    if (!detailDate) return [];
    return postsByDate[toDateKey(detailDate)] ?? [];
  }, [detailDate, postsByDate]);

  const handleDrawerAddPost = useCallback(() => {
    if (detailDate) {
      setModalInitialDate(toDateKey(detailDate));
      setModalInitialPost(null);
      setModalOpen(true);
    }
  }, [detailDate]);

  const handleDrawerEditPost = useCallback((post: Post) => {
    setModalInitialPost(post);
    setModalInitialDate(post.date);
    setModalOpen(true);
  }, []);

  const handleDrawerDeletePost = useCallback(async (post: Post) => {
    try {
      await deletePost(post.id);
      await refetchPosts();
    } catch {
      if (!getToken()) navigate('/login');
    }
  }, [refetchPosts, navigate]);

  const handleGeneratePlan = useCallback(async (inputs: ContentPlanInputs) => {
    setContentPlanError(null);
    setContentPlanLoading(true);
    setContentPlanInserted(false);
    setContentPlanInsertError(null);
    try {
      const { ideas } = await generateContentPlan(inputs);
      setContentPlanIdeas(ideas);
    } catch (err) {
      setContentPlanIdeas(null);
      if (!getToken()) navigate('/login');
      setContentPlanError(err instanceof Error ? err.message : 'Could not generate plan. Try again.');
    } finally {
      setContentPlanLoading(false);
    }
  }, [navigate]);

  const handleInsertPlan = useCallback(async () => {
    if (!contentPlanIdeas?.length) return;
    setContentPlanInsertError(null);
    setContentPlanInserting(true);
    try {
      await insertContentPlan(contentPlanIdeas);
      setContentPlanInserted(true);
      await refetchPosts();
    } catch (err) {
      if (!getToken()) navigate('/login');
      setContentPlanInsertError(err instanceof Error ? err.message : 'Failed to add to calendar.');
    } finally {
      setContentPlanInserting(false);
    }
  }, [contentPlanIdeas, refetchPosts, navigate]);

  const handleCancelAdd = useCallback(() => {
    setContentPlanIdeas(null);
    setContentPlanInserted(false);
    setContentPlanInsertError(null);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-dark)]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold uppercase tracking-wide text-[var(--accent)]">Content Planner</h1>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Schedule your social media posts
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setModalInitialDate(selectedDate ? toDateKey(selectedDate) : undefined);
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-[var(--bg-black)] shadow-sm hover:bg-[var(--accent-hover)]"
          >
            <span className="text-lg leading-none">+</span>
            Create Post
          </button>
        </div>
        <div className="mb-6 border-b border-[var(--border)]" />

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left column: Calendar + Posts for date */}
          <div className="space-y-6 lg:col-span-2">
            <Calendar
              year={calendarView.year}
              month={calendarView.month}
              selectedDate={selectedDate}
              onSelectDate={handleSelectDate}
              onAddPost={openModalForDate}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onToday={handleToday}
              datesWithPosts={datesWithPosts}
            />
            <PostsList
              date={selectedDate}
              posts={postsForSelectedDate}
              onSchedulePost={selectedDate ? () => openModalForDate(selectedDate) : undefined}
            />
            <QuickTips />
          </div>

          {/* Right column: Stats + Platform + Recent */}
          <div className="space-y-6">
            <StatsOverview stats={engagementForSelectedDate} />
            <PlatformPerformance stats={platformStats} />
            <RecentPostsPerformance posts={recentPosts} />
          </div>
        </div>

        {/* 30-day content plan generator */}
        <section id="content-plan-generator" className="mt-10">
          <Card>
            <CardTitle className="mb-2">30-day content plan generator</CardTitle>
            <p className="mb-6 text-sm text-[var(--text-muted)]">
              Get AI-generated content ideas for the next 30 days, then add them to your calendar in one click.
            </p>
            {contentPlanLoading ? (
              <ContentPlanLoader />
            ) : !contentPlanIdeas ? (
              <ContentPlanForm
                onSubmit={handleGeneratePlan}
                loading={contentPlanLoading}
                error={contentPlanError}
              />
            ) : (
              <div className="space-y-6">
                <ContentPlanResults ideas={contentPlanIdeas} />
                <AddToCalendarPrompt
                  ideas={contentPlanIdeas}
                  onConfirm={handleInsertPlan}
                  onCancel={handleCancelAdd}
                  inserting={contentPlanInserting}
                  inserted={contentPlanInserted}
                  error={contentPlanInsertError}
                />
              </div>
            )}
          </Card>
        </section>
      </div>

      <DateDetailDrawer
        isOpen={detailDate !== null}
        date={detailDate}
        posts={postsForDetailDate}
        onClose={() => setDetailDate(null)}
        onAddPost={handleDrawerAddPost}
        onEditPost={handleDrawerEditPost}
        onDeletePost={handleDrawerDeletePost}
      />

      <CreatePostModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setModalInitialPost(null);
        }}
        initialDate={modalInitialDate}
        initialPost={modalInitialPost}
        onSave={handleSavePost}
        onUpdate={async (id, form) => {
          await updatePost(id, form);
          await refetchPosts();
        }}
      />
    </div>
  );
}
