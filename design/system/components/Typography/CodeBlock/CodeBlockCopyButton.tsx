"use client";

import React, { useState } from 'react';
import { ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline';

export function CodeBlockCopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore clipboard errors
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="codeblock__copy-button"
      aria-label={copied ? 'Copied' : 'Copy code'}
    >
      {copied ? (
        <CheckIcon width={16} height={16} />
      ) : (
        <ClipboardIcon width={16} height={16} />
      )}
    </button>
  );
}
