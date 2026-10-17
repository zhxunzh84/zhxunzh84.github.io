"use client";

import Link from "next/link";
import { ensureAudio, sounds } from "@/lib/audio";
import { usePreferences } from "@/lib/preferences";

/** Internal link that plays the "record retrieval" sound when SOUND is on. */
export function RetrieveLink(props: React.ComponentProps<typeof Link>) {
  const { sound } = usePreferences();
  return (
    <Link
      {...props}
      onClick={(e) => {
        if (sound && ensureAudio()) sounds.retrieve();
        props.onClick?.(e);
      }}
    />
  );
}
