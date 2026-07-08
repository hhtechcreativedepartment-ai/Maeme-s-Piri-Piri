import Link from 'next/link';
import { notFound } from 'next/navigation';
import { blogs } from '@/data/blogs';

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = blogs.find(item => item.slug === slug);
  if (!blog) notFound();

  return (
    <main className="min-h-screen bg-[#FFFCF7] px-4 py-12 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl">
        <Link href="/blog" className="text-sm font-black text-[#99041e]">Back to Blog</Link>
        <img src={blog.image} alt="" className="mt-6 h-80 w-full rounded-3xl object-cover shadow-sm" />
        <p className="mt-8 text-xs font-black uppercase text-[#99041e]">{blog.category}</p>
        <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">{blog.title}</h1>
        <p className="mt-5 text-lg leading-8 text-[#555]">{blog.excerpt}</p>
        <div className="mt-8 space-y-5 text-base leading-8 text-[#333]">
          <p>Every Maeme&apos;s order starts with fresh preparation, careful grilling and a sauce choice that suits the way you like to eat.</p>
          <p>For a balanced meal, pair flame-grilled chicken with rice, salad or fries, then finish with a cold drink or milkshake.</p>
          <p>When you are ready, browse as a guest, add your favourites, and sign in only when you place the order.</p>
        </div>
      </article>
    </main>
  );
}
