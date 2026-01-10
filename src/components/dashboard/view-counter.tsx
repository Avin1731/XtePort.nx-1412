"use client";

import { incrementPostView } from "@/actions/blog";
import { useEffect } from "react";

export function ViewCounter({ slug }: { slug: string }) {
  useEffect(() => {
    // Panggil server action hanya sekali saat mount
    incrementPostView(slug);
  }, [slug]);

  return null; 
}