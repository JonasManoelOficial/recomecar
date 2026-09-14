import { auth } from "@/auth";
import { SiteFooter } from "@/components/brand/SiteFooter";
import { SiteHeader } from "@/components/brand/SiteHeader";

export default async function InstitucionalLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="rc-light flex flex-1 flex-col">
      <SiteHeader signedIn={Boolean(session)} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-14">{children}</main>
      <SiteFooter />
    </div>
  );
}
