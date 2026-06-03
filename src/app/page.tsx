
import HomeClient from './HomeClient';

export const metadata = {
  title: '小獸所｜特寵醫院地圖查詢平台',
  description: '查詢全台支援特殊寵物的動物醫院地圖與資訊。',
};

type HomePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Home({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const embedValue = params?.embed;
  const embed = Array.isArray(embedValue)
    ? embedValue.includes('1') || embedValue.includes('true')
    : embedValue === '1' || embedValue === 'true';

  return (
    <HomeClient embed={embed} />
  );
}
