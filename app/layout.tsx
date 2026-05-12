import type { Metadata } from "next";
import { designSnippet } from "../design/system/core/design/snippet";
import { CustomizerTrigger } from "../views/customizer";
import "../design/index.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alsa Design System",
  description: "Component documentation and preview",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { css, themeTone, themeMode } = await designSnippet();

  return (
    <html
      lang="en"
      data-theme-tone={themeTone}
      data-theme-mode={themeMode}
      data-theme={themeMode === 'dark' ? 'dark' : 'light'}
      suppressHydrationWarning
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: css }} />
        {/*
          Pre-hydration theme resolver:
          - Reads data-theme-mode set by SSR.
          - If 'system', resolves to the OS preference and listens for OS changes.
          - If 'light' or 'dark', applies that explicitly and does NOT listen.
          The customizer's applyCustomizerToRoot owns runtime overrides; this
          script runs once on first paint to prevent FOUC and to honor 'system' mode.
        */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            var html = document.documentElement;
            var mode = html.getAttribute('data-theme-mode') || 'light';
            function applyEffective(effective){
              html.style.setProperty('--is-dark', effective === 'dark' ? '1' : '0');
              html.setAttribute('data-theme', effective);
              if (effective === 'dark') html.classList.add('dark');
              else html.classList.remove('dark');
            }
            if (mode === 'system' && window.matchMedia){
              var mq = window.matchMedia('(prefers-color-scheme: dark)');
              applyEffective(mq.matches ? 'dark' : 'light');
              mq.addEventListener('change', function(e){
                if (html.getAttribute('data-theme-mode') === 'system') {
                  applyEffective(e.matches ? 'dark' : 'light');
                }
              });
            } else {
              applyEffective(mode === 'dark' ? 'dark' : 'light');
            }
          })();
        ` }} />
      </head>
      <body>
        {children}
        <CustomizerTrigger />
      </body>
    </html>
  );
}
