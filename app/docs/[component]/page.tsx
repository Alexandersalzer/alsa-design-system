"use client";
export const dynamic = "force-dynamic";
import React from "react";
import lazyLoad from "next/dynamic";

const pages: Record<string, ReturnType<typeof lazyLoad>> = {
  "headings":           lazyLoad(() => import("../../../views/documentation/headings/page"),           { ssr: false }),
  "body-text":          lazyLoad(() => import("../../../views/documentation/body-text/page"),          { ssr: false }),
  "labels":             lazyLoad(() => import("../../../views/documentation/labels/page"),             { ssr: false }),
  "icon":               lazyLoad(() => import("../../../views/documentation/icon/page"),               { ssr: false }),
  "button":             lazyLoad(() => import("../../../views/documentation/button/page"),             { ssr: false }),
  "icon-button":        lazyLoad(() => import("../../../views/documentation/icon-button/page"),        { ssr: false }),
  "clickable":          lazyLoad(() => import("../../../views/documentation/clickable/page"),          { ssr: false }),
  "text-link":          lazyLoad(() => import("../../../views/documentation/text-link/page"),          { ssr: false }),
  "nav":                lazyLoad(() => import("../../../views/documentation/nav/page"),                { ssr: false }),
  "tabs":               lazyLoad(() => import("../../../views/documentation/tabs/page"),               { ssr: false }),
  "segmented-control":  lazyLoad(() => import("../../../views/documentation/segmented-control/page"),  { ssr: false }),
  "selection-card":     lazyLoad(() => import("../../../views/documentation/selection-card/page"),     { ssr: false }),
  "kbd":                lazyLoad(() => import("../../../views/documentation/kbd/page"),                { ssr: false }),
  "breadcrumbs":        lazyLoad(() => import("../../../views/documentation/breadcrumbs/page"),        { ssr: false }),
  "input":              lazyLoad(() => import("../../../views/documentation/input/page"),              { ssr: false }),
  "textarea":           lazyLoad(() => import("../../../views/documentation/textarea/page"),           { ssr: false }),
  "picker":             lazyLoad(() => import("../../../views/documentation/picker/page"),             { ssr: false }),
  "checkbox":           lazyLoad(() => import("../../../views/documentation/checkbox/page"),           { ssr: false }),
  "radio":              lazyLoad(() => import("../../../views/documentation/radio/page"),              { ssr: false }),
  "switch":             lazyLoad(() => import("../../../views/documentation/switch/page"),             { ssr: false }),
  "file-uploader":      lazyLoad(() => import("../../../views/documentation/file-uploader/page"),      { ssr: false }),
  "date-picker":        lazyLoad(() => import("../../../views/documentation/date-picker/page"),        { ssr: false }),
  "date-range-picker":  lazyLoad(() => import("../../../views/documentation/date-range-picker/page"),  { ssr: false }),
  "slider":             lazyLoad(() => import("../../../views/documentation/slider/page"),             { ssr: false }),
  "table":              lazyLoad(() => import("../../../views/documentation/table/page"),              { ssr: false }),
  "list":               lazyLoad(() => import("../../../views/documentation/list/page"),               { ssr: false }),
  "sparkline":          lazyLoad(() => import("../../../views/documentation/sparkline/page"),          { ssr: false }),
  "linechart":          lazyLoad(() => import("../../../views/documentation/linechart/page"),          { ssr: false }),
  "barchart":           lazyLoad(() => import("../../../views/documentation/barchart/page"),           { ssr: false }),
  "areachart":          lazyLoad(() => import("../../../views/documentation/areachart/page"),          { ssr: false }),
  "donutchart":         lazyLoad(() => import("../../../views/documentation/donutchart/page"),         { ssr: false }),
  "container":          lazyLoad(() => import("../../../views/documentation/container/page"),          { ssr: false }),
  "vstack":             lazyLoad(() => import("../../../views/documentation/vstack/page"),             { ssr: false }),
  "hstack":             lazyLoad(() => import("../../../views/documentation/hstack/page"),             { ssr: false }),
  "grid":               lazyLoad(() => import("../../../views/documentation/grid/page"),               { ssr: false }),
  "box":                lazyLoad(() => import("../../../views/documentation/box/page"),                { ssr: false }),
  "card":               lazyLoad(() => import("../../../views/documentation/card/page"),               { ssr: false }),
  "divider":            lazyLoad(() => import("../../../views/documentation/divider/page"),            { ssr: false }),
  "modal":              lazyLoad(() => import("../../../views/documentation/modal/page"),              { ssr: false }),
  "drawer":             lazyLoad(() => import("../../../views/documentation/drawer/page"),             { ssr: false }),
  "popover":            lazyLoad(() => import("../../../views/documentation/popover/page"),            { ssr: false }),
  "menu":               lazyLoad(() => import("../../../views/documentation/menu/page"),               { ssr: false }),
  "command-menu":       lazyLoad(() => import("../../../views/documentation/command-menu/page"),       { ssr: false }),
  "tooltip":            lazyLoad(() => import("../../../views/documentation/tooltip/page"),            { ssr: false }),
  "toast":              lazyLoad(() => import("../../../views/documentation/toast/page"),              { ssr: false }),
  "tag":                lazyLoad(() => import("../../../views/documentation/tag/page"),                { ssr: false }),
  "alert":              lazyLoad(() => import("../../../views/documentation/alert/page"),              { ssr: false }),
  "banner":             lazyLoad(() => import("../../../views/documentation/banner/page"),             { ssr: false }),
  "spinner":            lazyLoad(() => import("../../../views/documentation/spinner/page"),            { ssr: false }),
  "progress":           lazyLoad(() => import("../../../views/documentation/progress/page"),           { ssr: false }),
  "loading-skeleton":   lazyLoad(() => import("../../../views/documentation/loading-skeleton/page"),   { ssr: false }),
  "badge":              lazyLoad(() => import("../../../views/documentation/badge/page"),              { ssr: false }),
  "carousel-animation": lazyLoad(() => import("../../../views/documentation/carousel-animation/page"), { ssr: false }),
  "count-up":           lazyLoad(() => import("../../../views/documentation/count-up/page"),           { ssr: false }),
  "image":              lazyLoad(() => import("../../../views/documentation/image/page"),              { ssr: false }),
  "avatar":             lazyLoad(() => import("../../../views/documentation/avatar/page"),             { ssr: false }),
  "logo":               lazyLoad(() => import("../../../views/documentation/logo/page"),               { ssr: false }),
  "ai-textarea":        lazyLoad(() => import("../../../views/documentation/ai-textarea/page"),        { ssr: false }),
};

export default function ComponentPage({ params }: { params: Promise<{ component: string }> }) {
  const { component } = React.use(params);
  const Page = pages[component];
  if (!Page) {
    return <div style={{ padding: "2rem" }}>Component &quot;{component}&quot; not found.</div>;
  }
  return <Page />;
}
