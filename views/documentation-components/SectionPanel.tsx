"use client";

import React, { ReactNode, useEffect, useRef, useState } from 'react';
import './SectionPanel.css';

interface SectionPanelProps {
  preview: ReactNode;
  code: ReactNode;
  active: 'preview' | 'code';
}

export function SectionPanel({ preview, code, active }: SectionPanelProps) {
  const previewRef = useRef<HTMLDivElement | null>(null);
  const codeRef = useRef<HTMLDivElement | null>(null);
  const [minHeight, setMinHeight] = useState<number>(0);

  useEffect(() => {
    const measure = () => {
      const ph = previewRef.current?.scrollHeight ?? 0;
      const ch = codeRef.current?.scrollHeight ?? 0;
      const next = Math.max(ph, ch);
      setMinHeight((prev) => (prev === next ? prev : next));
    };

    measure();

    const ro = new ResizeObserver(measure);
    if (previewRef.current) ro.observe(previewRef.current);
    if (codeRef.current) ro.observe(codeRef.current);
    return () => ro.disconnect();
  }, [preview, code]);

  return (
    <div className="section-panel" style={{ minHeight: minHeight || undefined }}>
      <div
        ref={previewRef}
        className={`section-panel__face ${active === 'preview' ? 'section-panel__face--active' : ''}`}
        aria-hidden={active !== 'preview'}
      >
        {preview}
      </div>
      <div
        ref={codeRef}
        className={`section-panel__face ${active === 'code' ? 'section-panel__face--active' : ''}`}
        aria-hidden={active !== 'code'}
      >
        {code}
      </div>
    </div>
  );
}
