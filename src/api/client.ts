// In dev, use same origin so Vite proxy can forward /api to the backend; otherwise use env or default
const API_BASE =
  (import.meta.env.VITE_API_URL && String(import.meta.env.VITE_API_URL).trim()) ||
  (import.meta.env.DEV ? '' : 'https://we-a-delhi-backend.vercel.app');

function getToken(): string | null {
  return localStorage.getItem('token');
}

function clearToken(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

async function request<T>(
  path: string,
  options: RequestInit & { parseJson?: boolean } = {}
): Promise<{ data?: T; ok: boolean; status: number }> {
  const { parseJson = true, ...fetchOptions } = options;
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...((fetchOptions.headers as Record<string, string>) || {}),
  };
  if (token) (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, { ...fetchOptions, headers });
  } catch (err) {
    const msg =
      err instanceof TypeError && err.message === 'Failed to fetch'
        ? `Could not reach the server at ${API_BASE}. Is the backend running?`
        : err instanceof Error
          ? err.message
          : 'Network error';
    throw new Error(msg);
  }
  if (res.status === 401) clearToken();

  if (!parseJson) return { ok: res.ok, status: res.status };
  let data: unknown;
  try {
    data = await res.json();
  } catch {
    return { ok: false, status: res.status };
  }
  const body = data as { success?: boolean; data?: T; error?: string };
  if (!res.ok) {
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return { data: body.data, ok: true, status: res.status };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: { id: string; name: string; email: string };
  token: string;
}

export function login(credentials: LoginCredentials): Promise<AuthResponse> {
  return request<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }).then((r) => {
    if (!r.ok || !r.data) throw new Error('Login failed');
    return r.data as unknown as AuthResponse;
  });
}

export function register(credentials: RegisterCredentials): Promise<AuthResponse> {
  return request<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }).then((r) => {
    if (!r.ok || !r.data) throw new Error('Registration failed');
    return r.data as unknown as AuthResponse;
  });
}

export interface GenerateContentPlanBody {
  goal: string;
  duration?: number;
  platforms: string[];
  niche: string;
  startDate: string;
}

export interface GenerateContentPlanResponse {
  ideas: import('../types/content').ContentPlanIdea[];
}

export function generateContentPlan(body: GenerateContentPlanBody): Promise<GenerateContentPlanResponse> {
  return request<GenerateContentPlanResponse>('/api/content-plan/generate', {
    method: 'POST',
    body: JSON.stringify(body),
  }).then((r) => {
    if (!r.data || !('ideas' in r.data)) throw new Error('No ideas returned');
    return r.data as GenerateContentPlanResponse;
  });
}

export function insertContentPlan(ideas: import('../types/content').ContentPlanIdea[]): Promise<{ inserted: number }> {
  return request<{ inserted: number }>('/api/content-plan/insert', {
    method: 'POST',
    body: JSON.stringify({ ideas }),
  }).then((r) => {
    if (!r.data || typeof (r.data as { inserted?: number }).inserted !== 'number') throw new Error('Insert failed');
    return r.data as { inserted: number };
  });
}

export function polishCaption(description: string): Promise<{ caption: string }> {
  return request<{ caption: string }>('/api/content-plan/polish-caption', {
    method: 'POST',
    body: JSON.stringify({ description }),
  }).then((r) => {
    if (!r.data || typeof (r.data as { caption?: string }).caption !== 'string') throw new Error('No caption returned');
    return r.data as { caption: string };
  });
}

export interface PostsResponse {
  posts: import('../types/content').Post[];
}

export function getPosts(params: { date?: string; month?: string; recent?: boolean; limit?: number }): Promise<PostsResponse> {
  const sp = new URLSearchParams();
  if (params.date) sp.set('date', params.date);
  if (params.month) sp.set('month', params.month);
  if (params.recent) sp.set('recent', '1');
  if (params.limit != null) sp.set('limit', String(params.limit));
  const q = sp.toString();
  return request<PostsResponse>(`/api/posts${q ? `?${q}` : ''}`).then((r) => {
    type Post = import('../types/content').Post;
    const posts = (r.data?.posts ?? []) as (Post & { _id?: string })[];
    return {
      posts: posts.map((p) => ({ ...p, id: p.id || p._id || '' } as Post)),
    };
  });
}

export type CreatePostBody = import('../types/content').CreatePostForm;

export function createPost(body: CreatePostBody): Promise<{ post: import('../types/content').Post }> {
  return request<{ post: import('../types/content').Post }>('/api/posts', {
    method: 'POST',
    body: JSON.stringify(body),
  }).then((r) => {
    if (!r.data || !('post' in r.data)) throw new Error('Create post failed');
    const p = r.data.post as import('../types/content').Post & { _id?: string };
    return { post: { ...p, id: p.id || p._id || '' } as import('../types/content').Post };
  });
}

export function updatePost(
  id: string,
  body: Partial<CreatePostBody>
): Promise<{ post: import('../types/content').Post }> {
  return request<{ post: import('../types/content').Post }>(`/api/posts/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  }).then((r) => {
    if (!r.data || !('post' in r.data)) throw new Error('Update post failed');
    const p = r.data.post as import('../types/content').Post & { _id?: string };
    return { post: { ...p, id: p.id || p._id || '' } as import('../types/content').Post };
  });
}

export function deletePost(id: string): Promise<{ deleted: boolean }> {
  return request<{ deleted: boolean }>(`/api/posts/${id}`, {
    method: 'DELETE',
  }).then((r) => {
    if (!r.data || (r.data as { deleted?: boolean }).deleted !== true) throw new Error('Delete post failed');
    return r.data as { deleted: boolean };
  });
}

export { getToken, clearToken };
