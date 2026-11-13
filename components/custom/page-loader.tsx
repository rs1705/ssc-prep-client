import { Loader } from "@/components/custom/loader";

/**
 * The one loader for a whole page or section: centred in the content area (it
 * fills the space it is given), never `position: fixed`, so it can't be
 * thrown off by transformed ancestors such as the page's entrance animation.
 */
export function PageLoader({ text = "Loading", className = "" }: { text?: string; className?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex min-h-[50dvh] w-full flex-1 items-center justify-center py-10 ${className}`}
    >
      <Loader text={text} />
    </div>
  );
}

export default PageLoader;
