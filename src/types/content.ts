export type PostType = 'Video' | 'Image' | 'Text';

export type Platform = 'Twitter' | 'LinkedIn' | 'Instagram';

export interface Post {
  id: string;
  type: PostType;
  caption: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  platforms: Platform[];
  views: number;
  likes: number;
  shares: number;
  comments?: number;
}

export interface EngagementStats {
  totalViews: number;
  totalLikes: number;
  totalShares: number;
  comments: number;
}

export interface PlatformStats {
  platform: Platform;
  posts: number;
  views: number;
  likes: number;
}

export type CreatePostForm = {
  type: PostType;
  caption: string;
  date: string;
  time: string;
  platforms: Platform[];
};

export interface ContentPlanIdea {
  date: string;
  type: PostType;
  caption: string;
  platforms: string[];
}

export interface ContentPlanInputs {
  goal: string;
  duration: number;
  platforms: string[];
  niche: string;
  startDate: string;
}
