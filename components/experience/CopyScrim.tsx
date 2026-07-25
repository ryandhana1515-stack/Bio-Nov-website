"use client";

import { useEffect, useState } from "react";
import { subscribeScroll } from "@/lib/scroll/state";

/**
 * Left-hand scrim that keeps the light headline legible over the imagery.
 * Retires once the story hands over to the paper-toned lower chapters.
 */
export default function CopyScrim() {
  const [visible, setVisible] = useState(true);

  useEffect(() => subscribeScroll((s) => setVisible(s.chapter <= 4)), []);

  return <div aria-hidden="true" className="copy-scrim" style={{ opacity: visible ? 1 : 0 }} />;
}
