"use client";

import React, { useState, useMemo, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Icon, IconButton, Input, Label, Body, Nav } from "../design/index";
import { MagnifyingGlassIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import "./DocumentationLayout.css";

interface DocComponent {
  id: string;
  label: string;
  path: string;
}

interface DocCategory {
  id: string;
  label: string;
  components: DocComponent[];
}

const DOC_CATEGORIES: DocCategory[] = [
  {
    id: "typography",
    label: "Typography",
    components: [
      { id: "headings", label: "Headings", path: "/docs/headings" },
      { id: "body-text", label: "Body Text", path: "/docs/body-text" },
      { id: "labels", label: "Labels", path: "/docs/labels" },
    ],
  },
  {
    id: "icons",
    label: "Icons",
    components: [
      { id: "icon", label: "Icon", path: "/docs/icon" },
    ],
  },
  {
    id: "actions",
    label: "Actions",
    components: [
      { id: "button", label: "Button", path: "/docs/button" },
      { id: "icon-button", label: "IconButton", path: "/docs/icon-button" },
      { id: "clickable", label: "Clickable", path: "/docs/clickable" },
      { id: "text-link", label: "TextLink", path: "/docs/text-link" },
      { id: "nav", label: "Nav", path: "/docs/nav" },
      { id: "tabs", label: "Tabs", path: "/docs/tabs" },
      { id: "segmented-control", label: "Segmented Control", path: "/docs/segmented-control" },
      { id: "selection-card", label: "SelectionCard", path: "/docs/selection-card" },
      { id: "kbd", label: "Kbd", path: "/docs/kbd" },
    ],
  },
  {
    id: "navigation",
    label: "Navigation",
    components: [
      { id: "breadcrumbs", label: "Breadcrumbs", path: "/docs/breadcrumbs" },
    ],
  },
  {
    id: "forms",
    label: "Forms",
    components: [
      { id: "input", label: "Input", path: "/docs/input" },
      { id: "textarea", label: "Textarea", path: "/docs/textarea" },
      { id: "picker", label: "Picker", path: "/docs/picker" },
      { id: "checkbox", label: "Checkbox", path: "/docs/checkbox" },
      { id: "radio", label: "Radio", path: "/docs/radio" },
      { id: "switch", label: "Switch", path: "/docs/switch" },
      { id: "file-uploader", label: "File Uploader", path: "/docs/file-uploader" },
      { id: "date-picker", label: "Date Picker", path: "/docs/date-picker" },
      { id: "date-range-picker", label: "Date Range Picker", path: "/docs/date-range-picker" },
      { id: "slider", label: "Slider", path: "/docs/slider" },
    ],
  },
  {
    id: "data-display",
    label: "Data Display",
    components: [
      { id: "table", label: "Table", path: "/docs/table" },
      { id: "list", label: "List", path: "/docs/list" },
    ],
  },
  {
    id: "charts",
    label: "Charts",
    components: [
      { id: "sparkline", label: "Sparkline", path: "/docs/sparkline" },
      { id: "linechart", label: "LineChart", path: "/docs/linechart" },
      { id: "barchart", label: "BarChart", path: "/docs/barchart" },
      { id: "areachart", label: "AreaChart", path: "/docs/areachart" },
      { id: "donutchart", label: "DonutChart", path: "/docs/donutchart" },
    ],
  },
  {
    id: "layout",
    label: "Layout",
    components: [
      { id: "container", label: "Container", path: "/docs/container" },
      { id: "vstack", label: "VStack", path: "/docs/vstack" },
      { id: "hstack", label: "HStack", path: "/docs/hstack" },
      { id: "grid", label: "Grid", path: "/docs/grid" },
      { id: "box", label: "Box", path: "/docs/box" },
      { id: "card", label: "Card", path: "/docs/card" },
      { id: "divider", label: "Divider", path: "/docs/divider" },
    ],
  },
  {
    id: "overlays",
    label: "Overlays",
    components: [
      { id: "modal", label: "Modal", path: "/docs/modal" },
      { id: "drawer", label: "Drawer", path: "/docs/drawer" },
      { id: "popover", label: "Popover", path: "/docs/popover" },
      { id: "menu", label: "Menu", path: "/docs/menu" },
      { id: "command-menu", label: "Command Menu", path: "/docs/command-menu" },
      { id: "tooltip", label: "Tooltip", path: "/docs/tooltip" },
    ],
  },
  {
    id: "feedback",
    label: "Feedback",
    components: [
      { id: "toast", label: "Toast", path: "/docs/toast" },
      { id: "tag", label: "Tag", path: "/docs/tag" },
      { id: "alert", label: "Alert", path: "/docs/alert" },
      { id: "banner", label: "Banner", path: "/docs/banner" },
      { id: "spinner", label: "Spinner", path: "/docs/spinner" },
      { id: "progress", label: "Progress", path: "/docs/progress" },
      { id: "loading-skeleton", label: "Loading Skeleton", path: "/docs/loading-skeleton" },
      { id: "badge", label: "Badge", path: "/docs/badge" },
    ],
  },
  {
    id: "animations",
    label: "Animations",
    components: [
      { id: "carousel-animation", label: "Carousel Animation", path: "/docs/carousel-animation" },
      { id: "count-up", label: "Count Up", path: "/docs/count-up" },
    ],
  },
  {
    id: "media",
    label: "Media",
    components: [
      { id: "image", label: "Image", path: "/docs/image" },
      { id: "avatar", label: "Avatar", path: "/docs/avatar" },
      { id: "logo", label: "Logo", path: "/docs/logo" },
    ],
  },
  {
    id: "ai",
    label: "AI",
    components: [
      { id: "ai-textarea", label: "AI Textarea", path: "/docs/ai-textarea" },
    ],
  },
];

export default function DocumentationLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    setIsDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isDrawerOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = original; };
  }, [isDrawerOpen]);

  const filteredCategories = useMemo(() => {
    return DOC_CATEGORIES.map((cat) => ({
      ...cat,
      components: cat.components.filter((c) =>
        c.label.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    })).filter((cat) => cat.components.length > 0);
  }, [searchQuery]);

  const hasNoResults = searchQuery.length > 0 && filteredCategories.length === 0;

  return (
    <div className={`docs-layout${isDrawerOpen ? " docs-layout--drawer-open" : ""}`}>
      <IconButton
        className="docs-mobile-toggle"
        variant="secondary"
        size="md"
        aria-label={isDrawerOpen ? "Close navigation" : "Open navigation"}
        onClick={() => setIsDrawerOpen((v) => !v)}
        icon={
          <Icon size="md">
            {isDrawerOpen ? <XMarkIcon /> : <Bars3Icon />}
          </Icon>
        }
      />

      <div
        className="docs-backdrop"
        onClick={() => setIsDrawerOpen(false)}
        aria-hidden="true"
      />

      <aside className="docs-sidebar">
        <div className="docs-sidebar__header">
          <span className="docs-sidebar__logo">Alsa DS</span>
        </div>

        <div className="docs-sidebar__search">
          <Input
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            leftIcon={
              <Icon size="sm">
                <MagnifyingGlassIcon />
              </Icon>
            }
          />
        </div>

        <div className="docs-sidebar__nav">
          {hasNoResults ? (
            <div className="docs-sidebar__empty">
              <Label size="md" color="secondary">No components found</Label>
              <Body size="sm" color="secondary">Try adjusting your search</Body>
            </div>
          ) : (
            <Nav.Root layout="sidebar" surface="page" currentPath={pathname ?? undefined} gap="lg">
              {filteredCategories.map((category) => (
                <Nav.Section key={category.id} label={category.label}>
                  <Nav.List>
                    {category.components.map((comp) => (
                      <Nav.Item
                        key={comp.id}
                        href={comp.path}
                        size="sm"
                        variant="default"
                        onClick={() => router.push(comp.path)}
                      >
                        {comp.label}
                      </Nav.Item>
                    ))}
                  </Nav.List>
                </Nav.Section>
              ))}
            </Nav.Root>
          )}
        </div>
      </aside>

      <main className="docs-main">
        <div className="docs-content">
          {children}
        </div>
      </main>
    </div>
  );
}
