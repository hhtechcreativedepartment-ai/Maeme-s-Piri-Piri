interface LegalSection {
  title: string;
  body: string;
}

interface LegalPageContentProps {
  title: string;
  introduction: string;
  sections: LegalSection[];
  backHref?: string;
}

export default function LegalPageContent({ title, introduction, sections, backHref }: LegalPageContentProps) {
  return (
    <main className="min-h-screen bg-[#fff8ed] px-4 py-10 text-[#1a120f] sm:px-6 lg:px-8 lg:py-14">
      <article className="mx-auto max-w-4xl rounded-[28px] border border-[#f0d59d] bg-white p-6 shadow-[0_18px_50px_rgba(50,24,16,0.08)] sm:p-10">
        {backHref && (
          <a
            href={backHref}
            className="mb-6 inline-flex min-h-11 items-center rounded-full border border-[#99041e]/20 px-5 text-sm font-black text-[#99041e] transition hover:bg-[#fff8ed] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffc257]/60"
          >
            Back to ordering
          </a>
        )}
        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#99041e]">Legal</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-4 text-base leading-7 text-[#6b5b55]">{introduction}</p>
        <div className="mt-9 space-y-7">
          {sections.map((section) => (
            <section key={section.title} className="rounded-2xl bg-[#fff8ed] p-5">
              <h2 className="text-2xl font-black">{section.title}</h2>
              <p className="mt-3 leading-7 text-[#6b5b55]">{section.body}</p>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
