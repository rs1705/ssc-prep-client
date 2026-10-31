import { Loader } from "@/components/custom/loader";

export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[60vh] w-full items-center justify-center"
    >
      <Loader size="lg" text="Loading" />
    </div>
  );
}
