'use client';

import Image from 'next/image';
import React, { useState } from 'react';

// Countdown started May 20 2026 — shuts down June 19 2026
const SHUTDOWN_DATE = new Date('2026-06-19T00:00:00.000Z');

const getDaysRemaining = () => {
  const diff = SHUTDOWN_DATE.getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

const ShutdownBanner = () => {
  const [dismissed, setDismissed] = useState(false);
  const daysRemaining = getDaysRemaining();

  if (dismissed || daysRemaining === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] border-b border-red-900/40"
      style={{
        background: 'linear-gradient(90deg, #1a0505 0%, #220707 50%, #1a0505 100%)',
        boxShadow: '0 2px 24px rgba(185, 28, 28, 0.18)',
      }}
      role="alert"
      aria-live="polite"
    >
      <div className="w-full max-w-[1512px] mx-auto flex items-center justify-between px-6 h-11 gap-6">

        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-50" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
          </span>

          <p className="m-0 text-sm leading-none flex items-center gap-2.5 flex-wrap">
            <span className="font-semibold text-red-300 tracking-wide">
              Resolute is shutting down in{' '}
              <span className="text-red-200">
                {daysRemaining}&nbsp;{daysRemaining === 1 ? 'day' : 'days'}
              </span>
            </span>

            <span className="text-[#ffffff18] select-none">|</span>

            <span className="text-[#ffffff60] font-light">
              Still using it? Reach out —
            </span>

            <span className="flex items-center gap-3">
              <a
                href="https://twitter.com/vitwit_"
                target="_blank"
                rel="noopener noreferrer"
                title="Reach us on X (Twitter)"
                className="opacity-60 hover:opacity-100 transition-opacity duration-150"
              >
                <Image src="/twitter-icon.png" width={15} height={15} alt="X (Twitter)" />
              </a>
              <a
                href="https://t.me/+3bXmS6GE4HRjYmU1"
                target="_blank"
                rel="noopener noreferrer"
                title="Reach us on Telegram"
                className="opacity-60 hover:opacity-100 transition-opacity duration-150"
              >
                <Image src="/telegram-icon.png" width={15} height={15} alt="Telegram" />
              </a>
            </span>
          </p>
        </div>

        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full border border-red-800/60 text-red-400/70 hover:border-red-600 hover:text-red-300 hover:bg-red-900/30 transition-all duration-150 cursor-pointer"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

      </div>
    </div>
  );
};

export default ShutdownBanner;
