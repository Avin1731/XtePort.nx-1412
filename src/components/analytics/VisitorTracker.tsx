"use client";

import { useEffect, useRef } from "react";
import { trackVisitor } from "@/actions/tracking";

export default function VisitorTracker() {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      trackVisitor();
      initialized.current = true; // Mencegah double call di Strict Mode
    }
  }, []);

  return null;
}