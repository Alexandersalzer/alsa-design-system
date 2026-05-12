"use client";

// ===============================================
// Documentation Index Page
// Redirects to Typography page by default
// ===============================================

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DocumentationPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to first component page (Headings) on mount
    router.replace("/dashboard/admin/documentation/headings");
  }, [router]);

  return null;
}