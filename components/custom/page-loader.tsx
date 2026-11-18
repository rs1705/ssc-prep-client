import { Loader } from "@/components/custom/loader";
import { cn } from "@/lib/utils";

/**
 * The one loader for a whole page or section: centred in the content area (it
 * fills the space it is given), never `position: fixed`, so it can't be
 * thrown off by transformed ancestors such as the page's entrance animation.
 */
export function PageLoader({ text = "Loading", className = "" }: { text?: string; className?: string }) {
  return (
    <div className={cn("flex min-h-[40dvh] w-full flex-1 items-center justify-center py-8 sm:min-h-[50dvh] sm:py-10", className)}>
      <Loader text={text} />
    </div>
  );
}

export default PageLoader;
