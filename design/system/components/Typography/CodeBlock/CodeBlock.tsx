"use client";

// Syntax-highlighted code block (Shiki, lazy-loaded on client).
// Runs in client because the docs pages where it's used are "use client".
// Highlighter is loaded once and cached across all CodeBlock instances.

import React, { useEffect, useState } from 'react';
import { CodeBlockCopyButton } from './CodeBlockCopyButton';
import './CodeBlock.css';

export type CodeBlockLanguage =
  | 'tsx'
  | 'ts'
  | 'jsx'
  | 'js'
  | 'json'
  | 'css'
  | 'bash'
  | 'html';

export interface CodeBlockProps {
  children: string;
  language?: CodeBlockLanguage;
  showCopy?: boolean;
  border?: boolean;
}

let highlighterPromise: Promise<any> | null = null;

async function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = import('shiki/bundle/web').then((mod) =>
      mod.createHighlighter({
        themes: ['github-light', 'github-dark'],
        langs: ['tsx', 'ts', 'jsx', 'js', 'json', 'css', 'bash', 'html'],
      })
    );
  }
  return highlighterPromise;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function fallbackPre(code: string) {
  // Plain pre/code wrapped to mimic Shiki structure for layout consistency
  return `<pre><code>${escapeHtml(code)}</code></pre>`;
}

export function CodeBlock({
  children,
  language = 'tsx',
  showCopy = true,
  border = true,
}: CodeBlockProps) {
  const [lightHtml, setLightHtml] = useState<string>(() => fallbackPre(children));
  const [darkHtml, setDarkHtml] = useState<string>(() => fallbackPre(children));

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const highlighter = await getHighlighter();
        if (cancelled) return;
        const light = highlighter.codeToHtml(children, {
          lang: language,
          theme: 'github-light',
        });
        const dark = highlighter.codeToHtml(children, {
          lang: language,
          theme: 'github-dark',
        });
        if (!cancelled) {
          setLightHtml(light);
          setDarkHtml(dark);
        }
      } catch {
        // keep fallback
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [children, language]);

  return (
    <div className={`codeblock ${border ? 'codeblock--bordered' : ''}`}>
      {showCopy && (
        <div className="codeblock__copy">
          <CodeBlockCopyButton text={children} />
        </div>
      )}
      <div
        className="codeblock__pre codeblock__pre--light"
        dangerouslySetInnerHTML={{ __html: lightHtml }}
      />
      <div
        className="codeblock__pre codeblock__pre--dark"
        dangerouslySetInnerHTML={{ __html: darkHtml }}
      />
    </div>
  );
}

CodeBlock.displayName = 'CodeBlock';
