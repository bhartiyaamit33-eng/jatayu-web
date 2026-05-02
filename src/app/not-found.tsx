import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-24 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-magenta">
        404
      </p>
      <h1 className="mt-4 font-display text-3xl font-extrabold text-navy md:text-4xl">
        Page not found
      </h1>
      <p className="mt-4 max-w-md text-sm text-slate">
        The slug may have moved—CMS redirects should map legacy WordPress URLs to these routes.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-xl bg-grad-accent px-6 py-3 font-display text-sm font-semibold text-white"
      >
        Return home
      </Link>
    </div>
  );
}
