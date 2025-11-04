import React from 'react';
import { LogoIcon } from './icons/LogoIcon';

export function Header() {
  return (
    <header className="bg-base-200/50 backdrop-blur-sm sticky top-0 z-10 shadow-lg border-b border-base-300">
      <div className="container mx-auto max-w-7xl px-4 py-4 md:px-8">
        <div className="flex items-center justify-center gap-4">
            <LogoIcon />
            <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 animate-glow">
                    Gemini Image Editor
                </h1>
                <p className="mt-1 text-md text-gray-400">
                    AI-powered image editing with Gemini 2.5 Flash Image
                </p>
            </div>
        </div>
      </div>
    </header>
  );
}