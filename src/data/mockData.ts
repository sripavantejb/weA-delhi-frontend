import type { Post, PlatformStats } from '../types/content';

export const MOCK_POSTS_BY_DATE: Record<string, Post[]> = {
  '2026-02-10': [
    {
      id: '1',
      type: 'Video',
      caption:
        '🔥 Focus on progress, not perfection! Small steps lead to big changes. What will you tackle first today? 👊',
      date: '2026-02-10',
      time: '09:00',
      platforms: ['Twitter', 'LinkedIn', 'Instagram'],
      views: 0,
      likes: 0,
      shares: 0,
      comments: 0,
    },
  ],
  '2026-02-11': [
    {
      id: '2',
      type: 'Video',
      caption:
        '🔥 Focus on progress, not perfection! Small steps lead to big changes. What will you tackle first today? 👊',
      date: '2026-02-11',
      time: '09:00',
      platforms: ['Twitter', 'LinkedIn', 'Instagram'],
      views: 0,
      likes: 0,
      shares: 0,
      comments: 0,
    },
  ],
  '2026-02-15': [
    {
      id: '3',
      type: 'Image',
      caption:
        'Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful! Let\'s embrace our passions and make every day a step toward our dreams! #motivation #success #career',
      date: '2026-02-15',
      time: '12:00',
      platforms: ['LinkedIn', 'Instagram'],
      views: 0,
      likes: 0,
      shares: 0,
      comments: 0,
    },
  ],
  '2026-02-18': [
    {
      id: '4',
      type: 'Text',
      caption:
        'Believe in your potential and take that first step toward your goals! 🚀 #believeinyourself #motivation #motivationalquotes #positivity',
      date: '2026-02-18',
      time: '10:00',
      platforms: ['Twitter', 'Instagram'],
      views: 0,
      likes: 0,
      shares: 0,
      comments: 0,
    },
  ],
};

export const MOCK_PLATFORM_STATS: PlatformStats[] = [
  { platform: 'Twitter', posts: 3, views: 0, likes: 0 },
  { platform: 'LinkedIn', posts: 4, views: 0, likes: 0 },
  { platform: 'Instagram', posts: 3, views: 0, likes: 0 },
];

export const MOCK_RECENT_POSTS: Post[] = [
  {
    id: 'r1',
    type: 'Text',
    caption:
      'Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful! Let\'s embrace our passions and make every day a step toward our dreams! #motivation #success #career',
    date: '2026-02-09',
    time: '09:00',
    platforms: ['LinkedIn'],
    views: 0,
    likes: 0,
    shares: 0,
  },
  {
    id: 'r2',
    type: 'Image',
    caption:
      'Believe in your potential and take that first step toward your goals! 🚀 #believeinyourself #motivation #motivationalquotes #positivity',
    date: '2026-02-08',
    time: '10:00',
    platforms: ['Twitter', 'Instagram'],
    views: 0,
    likes: 0,
    shares: 0,
  },
  {
    id: 'r3',
    type: 'Video',
    caption:
      'Unlock your productivity potential! Every small step you take today builds the path to your success tomorrow. Stay focused, stay motivated, and remember: progress, not perfection, is the key!',
    date: '2026-02-07',
    time: '14:00',
    platforms: ['LinkedIn', 'Instagram'],
    views: 0,
    likes: 0,
    shares: 0,
  },
  {
    id: 'r4',
    type: 'Text',
    caption:
      'Small wins compound. Celebrate them. 🎯 #productivity #growth #mindset',
    date: '2026-02-06',
    time: '08:00',
    platforms: ['Twitter'],
    views: 0,
    likes: 0,
    shares: 0,
  },
];

function getDefaultEngagement() {
  return { totalViews: 0, totalLikes: 0, totalShares: 0, comments: 0 };
}

export function getEngagementForPosts(posts: Post[]) {
  return posts.reduce(
    (acc, p) => ({
      totalViews: acc.totalViews + (p.views ?? 0),
      totalLikes: acc.totalLikes + (p.likes ?? 0),
      totalShares: acc.totalShares + (p.shares ?? 0),
      comments: acc.comments + (p.comments ?? 0),
    }),
    getDefaultEngagement()
  );
}
