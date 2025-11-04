import React, { useState, useEffect } from 'react';

const MESSAGES = [
  "Warming up the AI model...",
  "Analyzing image composition...",
  "Applying creative filters...",
  "Polishing the pixels...",
  "Almost there...",
];

export function Loader() {
  const [message, setMessage] = useState(MESSAGES[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessage(prevMessage => {
        const currentIndex = MESSAGES.indexOf(prevMessage);
        const nextIndex = (currentIndex + 1) % MESSAGES.length;
        return MESSAGES[nextIndex];
      });
    }, 2000); // Change message every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-brand-primary"></div>
      <p className="mt-4 text-lg font-semibold text-content transition-opacity duration-500">{message}</p>
      <p className="text-sm text-gray-400">This may take a moment.</p>
    </div>
  );
}