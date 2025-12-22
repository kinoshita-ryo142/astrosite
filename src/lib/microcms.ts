import dotenv from 'dotenv';
dotenv.config();

export interface Category {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  revisedAt?: string;
}

export interface NewsItem {
  id: string;
  title?: string;
  content?: string;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  revisedAt?: string;
  category?: Category | string | Array<Category | string>;
  link?: string;
}

export type MicroCMSResponse<T> = {
  contents: T[];
  totalCount?: number;
  offset?: number;
  limit?: number;
};

async function fetchFromMicroCMS<T>(path: string) {
  if (!process.env.MICROCMS_API_KEY) {
    // Try loading .env (useful in dev)
    dotenv.config();
  }
  const API_KEY = process.env.MICROCMS_API_KEY;
  if (!API_KEY) {
    // Don't throw during build — return an empty response so static generation can continue.
    // This makes deployments more resilient when the env var hasn't been set in the host (e.g. Vercel).
    console.warn('MICROCMS_API_KEY is not set in environment variables; returning empty contents');
    return { contents: [] } as MicroCMSResponse<T>;
  }

  const res = await fetch(`https://5d3pgy559j.microcms.io/api/v1/${path}`, {
    headers: {
      'X-API-KEY': API_KEY,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${path}: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as MicroCMSResponse<T>;
  return data;
}

export async function getNews(): Promise<NewsItem[]> {
  const data = await fetchFromMicroCMS<NewsItem>('news');
  return data?.contents ?? [];
}

export async function getCategories(): Promise<Category[]> {
  const data = await fetchFromMicroCMS<Category>('categories');
  return data?.contents ?? [];
}

export async function getNewsById(id: string): Promise<NewsItem | null> {
  if (!process.env.MICROCMS_API_KEY) dotenv.config();
  const API_KEY = process.env.MICROCMS_API_KEY;
  if (!API_KEY) {
    console.warn('MICROCMS_API_KEY is not set in environment variables; getNewsById will return null');
    return null;
  }

  const res = await fetch(`https://5d3pgy559j.microcms.io/api/v1/news/${id}`, {
    headers: {
      'X-API-KEY': API_KEY,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch news/${id}: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as NewsItem;
  return data;
}
