"use client";

import { createContext, useContext, useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type MeetingsNavigation = {
  pending: boolean;
  /** Optimistic URL: the one being navigated to, or the current one. */
  href: string;
  navigate: (href: string) => void;
};

const NavigationContext = createContext<MeetingsNavigation | null>(null);

export function useMeetingsNavigation() {
  const value = useContext(NavigationContext);
  if (!value) throw new Error("useMeetingsNavigation must be used inside MeetingsNavigationProvider");
  return value;
}

/**
 * Filter and search changes re-render the list on the server. This keeps the
 * UI responsive meanwhile: the clicked filter is highlighted at once and the
 * list shows a loading state until the new results arrive.
 */
export function MeetingsNavigationProvider({
  currentHref,
  children,
}: {
  currentHref: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [href, setOptimisticHref] = useOptimistic(currentHref);

  function navigate(next: string) {
    startTransition(() => {
      setOptimisticHref(next);
      router.push(next, { scroll: false });
    });
  }

  return (
    <NavigationContext.Provider value={{ pending, href, navigate }}>{children}</NavigationContext.Provider>
  );
}

/** Wraps the results: fades them and shows a progress bar while loading. */
export function PendingResults({ children }: { children: React.ReactNode }) {
  const { pending } = useMeetingsNavigation();

  return (
    <div className="relative" aria-busy={pending}>
      <div
        className={cn(
          "absolute -top-4 left-0 h-0.5 rounded-full bg-primary transition-all",
          pending ? "w-2/3 opacity-100 duration-[1500ms] ease-out" : "w-0 opacity-0 duration-0"
        )}
        aria-hidden
      />
      <div className={cn("space-y-8 transition-opacity", pending && "pointer-events-none opacity-50")}>
        {children}
      </div>
    </div>
  );
}
