"use client";

import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { Box, Divider, Button, CodeBlock } from '../../design/index';
import './PreviewCodeCard.css';

interface PreviewCodeCardProps {
  preview: ReactNode;
  code: string;
  /** Number of code lines to show before the fade overlay appears. Default 6. */
  collapsedLines?: number;
  /** Approximate line-height of the code in px. Used to compute collapsed height. Default 22. */
  lineHeightPx?: number;
}

const COLLAPSE_THRESHOLD_DEFAULT = 6;
const LINE_HEIGHT_DEFAULT = 22;

export function PreviewCodeCard({
  preview,
  code,
  collapsedLines = COLLAPSE_THRESHOLD_DEFAULT,
  lineHeightPx = LINE_HEIGHT_DEFAULT,
}: PreviewCodeCardProps) {
  const codeRef = useRef<HTMLDivElement | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [fullHeight, setFullHeight] = useState<number | null>(null);

  // Runtime safety: unmigrated pages still pass arrays. Coerce to string.
  const codeString =
    typeof code === 'string'
      ? code
      : Array.isArray(code)
        ? (code as Array<{ code?: string; label?: string }>)
            .map((entry) =>
              entry?.label
                ? `// ${entry.label}\n${entry.code ?? ''}`
                : (entry?.code ?? '')
            )
            .join('\n\n')
        : String(code ?? '');

  const totalLines = codeString.split('\n').length;
  const needsCollapse = totalLines > collapsedLines;

  useEffect(() => {
    if (!codeRef.current) return;
    const ro = new ResizeObserver(() => {
      if (codeRef.current) setFullHeight(codeRef.current.scrollHeight);
    });
    ro.observe(codeRef.current);
    setFullHeight(codeRef.current.scrollHeight);
    return () => ro.disconnect();
  }, [codeString]);

  const collapsedHeight = collapsedLines * lineHeightPx + 28; // padding inside CodeBlock pre
  const showOverlay = needsCollapse && !expanded;
  const codeWindowMaxHeight = showOverlay ? collapsedHeight : fullHeight ?? undefined;

  return (
    <Box
      border="default"
      radius="lg"
      style={{ width: '100%', overflow: 'hidden', background: 'var(--surface-page)' }}
    >
      <Box
        display="flex"
        align="center"
        justify="center"
        padding="lg"
        style={{ minHeight: 350 }}
      >
        <Box display="flex" align="center" justify="center" width="full">
          {preview}
        </Box>
      </Box>

      <Divider weight="default" spacing="sm" />

      <Box style={{ position: 'relative' }}>
        <div
          className="pcc__code-window"
          style={{ maxHeight: codeWindowMaxHeight }}
        >
          <div ref={codeRef}>
            <CodeBlock border={false}>{codeString}</CodeBlock>
          </div>
          {showOverlay && <div className="pcc__fade" aria-hidden="true" />}
        </div>

        {needsCollapse && (
          <Box
            style={{
              position: 'absolute',
              left: '50%',
              bottom: 'var(--foundation-space-3)',
              transform: 'translateX(-50%)',
              zIndex: 2,
            }}
          >
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? 'Collapse code' : 'Expand code'}
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}
