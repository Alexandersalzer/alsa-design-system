"use client";
import lazyLoad from "next/dynamic";

const DocumentationLayout = lazyLoad(
  () => import("../../views/DocumentationLayout"),
  { ssr: false }
);

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return <DocumentationLayout>{children}</DocumentationLayout>;
}
