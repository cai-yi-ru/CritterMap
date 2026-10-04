import type { Metadata } from 'next';
import { getReviewDrafts } from '@/lib/threads-review';
import ReviewWorkspace from './review-workspace';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: { absolute: 'Threads 文案覆核｜小獸所' },
  description: '查看各縣市 Threads 草稿、來源備查與獨立文案查核結果。',
  alternates: { canonical: '/review/threads' },
  robots: {
    index: false, follow: false, nosnippet: true,
    googleBot: { index: false, follow: false, noimageindex: true, nosnippet: true },
  },
  openGraph: {
    title: 'Threads 文案覆核｜小獸所',
    description: '縣市文案與來源備查工作頁。', url: '/review/threads',
  },
  twitter: { title: 'Threads 文案覆核｜小獸所', description: '縣市文案與來源備查工作頁。' },
};

export default function ThreadsReviewPage() {
  return <ReviewWorkspace drafts={getReviewDrafts()} />;
}
