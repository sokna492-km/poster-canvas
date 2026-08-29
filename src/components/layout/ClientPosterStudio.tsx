import { useEffect, useState } from "react";
import { useUiStore } from "@/stores/uiStore";
import { PosterStudio } from "./PosterStudio";

/** Poster Studio requires browser APIs (Monaco, iframe, localStorage). */
export function ClientPosterStudio() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    useUiStore.getState().setTheme(useUiStore.getState().theme);
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Loading Poster Studio…
      </div>
    );
  }

  return <PosterStudio />;
}
