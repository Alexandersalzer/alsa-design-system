"use client";

// ===============================================
// Documentation Layout Route
// Part of the unified Developer Portal
// ===============================================

import React from "react";
import DevPortalLayout from "@/components/layouts/DevPortalLayout";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DevPortalLayout>{children}</DevPortalLayout>;
}
