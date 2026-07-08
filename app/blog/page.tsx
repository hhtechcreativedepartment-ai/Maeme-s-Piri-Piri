import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { blogs } from '@/data/blogs';

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#fff8ed] px-4 py-10 text-[#1a120f] sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-[1320px]">
        <header className="mb-9 max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#99041e]">Maeme&apos;s blog</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">Fresh guides for better ordering</h1>
          <p className="mt-3 text-base leading-7 text-[#6b5b55]">
            Flame-grill stories, flavour tips and takeaway-night ideas from Maeme&apos;s Piri Piri.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog, index) => (
            <Link
              key={blog.slug}
              href={`/blog/${blog.slug}`}
              className={`group overflow-hidden rounded-[24px] border border-[#f0d59d] bg-white shadow-[0_14px_38px_rgba(50,24,16,0.08)] transition hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(50,24,16,0.13)] ${index === 0 ? 'lg:col-span-2' : ''}`}
            >
              <div className={`overflow-hidden bg-[#fff8ed] ${index === 0 ? 'h-72' : 'h-56'}`}>
                <img src={blog.image} alt={blog.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div className="p-5 sm:p-6">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#99041e]">{blog.category}</p>
                <h2 className="mt-3 text-2xl font-black leading-tight">{blog.title}</h2>
                <p className="mt-3 text-sm leading-6 text-[#6b5b55]">{blog.excerpt}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#99041e]">
                  Read More
                  <ArrowRight size={17} />
                </span>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
