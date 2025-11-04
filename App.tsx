import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { SparklesIcon as LightningIcon } from './components/icons/SparklesIcon';
import { WandIcon as PromptIcon } from './components/icons/WandIcon';
import { LogoIcon as GalleryIcon } from './components/icons/LogoIcon';
import { editImage } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';

const DEFAULT_PROMPT = "A futuristic city powered by nano technology, golden hour lighting, ultra detailed...";

// SVG Icons for UI elements
const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 16v-2m8-6h2M4 12H2m15.364 6.364l1.414 1.414M4.222 4.222l1.414 1.414m12.728 0l-1.414 1.414M5.636 18.364l-1.414 1.414M12 16a4 4 0 110-8 4 4 0 010 8z" />
    </svg>
);

const ImageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-content-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
);

const LightbulbIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311a7.5 7.5 0 01-7.5 0c-1.421-.666-2.47-2.028-2.47-3.665A5.25 5.25 0 019.75 3h4.5a5.25 5.25 0 015.25 5.25c0 1.637-1.049 3-2.47 3.665z" />
    </svg>
);


export default function App() {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [originalImagePreview, setOriginalImagePreview] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>(DEFAULT_PROMPT);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (file: File) => {
    setOriginalImage(file);
    setEditedImage(null);
    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setOriginalImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const resetState = () => {
      setOriginalImage(null);
      setOriginalImagePreview(null);
      setEditedImage(null);
      setError(null);
      setPrompt(DEFAULT_PROMPT);
  }

  const handleGenerateClick = useCallback(async () => {
    if (!originalImage || !prompt) {
      setError('Please upload an image and provide a prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setEditedImage(null);

    try {
      const { base64, mimeType } = await fileToBase64(originalImage);
      const result = await editImage(base64, mimeType, prompt);
      if(result) {
        setEditedImage(`data:${result.mimeType};base64,${result.base64}`);
      } else {
        setError('Could not generate image. The model did not return an image.');
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, prompt]);
  
  return (
    <div className="min-h-screen bg-base-100 text-content font-sans">
      <div className="w-full h-1 bg-brand-accent" />
      <main className="p-4 md:p-8">
        <div className="container mx-auto max-w-screen-2xl">
          <header className="text-left mb-10">
            <h1 className="text-3xl font-bold text-white">Image Edit</h1>
            <p className="text-content-secondary mt-1">Transform existing images into new creations</p>
          </header>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Control Panel */}
            <div className="lg:col-span-2 bg-base-200 rounded-xl p-6 flex flex-col gap-6 border border-base-300">
              <div className="flex items-center gap-3">
                <PromptIcon />
                <h2 className="text-xl font-bold text-white">Prompt Input</h2>
              </div>
              
              <div className="space-y-4">
                  <label className="block text-sm font-semibold text-content-secondary">AI Model Selection</label>
                  <div className="relative">
                      <select disabled className="w-full appearance-none bg-base-300 border border-base-300 text-white py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-base-300 focus:border-gray-500 cursor-not-allowed">
                          <option>Nano Banana</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                  </div>
                  <p className="text-xs text-content-secondary">Different models offer unique characteristics and styles</p>
              </div>

              <div className="border-b border-base-300">
                  <nav className="-mb-px flex space-x-6">
                      <button className="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm text-brand-accent border-brand-accent">Image Edit</button>
                      <button className="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm text-content-secondary border-transparent hover:text-gray-300 hover:border-gray-400">Text to Image</button>
                  </nav>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-base font-semibold text-white flex items-center gap-2">
                        <ImageIcon /> Reference Image
                    </h3>
                    {originalImage && (
                        <button onClick={resetState} className="text-xs text-content-secondary hover:text-white transition">Clear</button>
                    )}
                </div>
                <ImageUploader onImageUpload={handleImageUpload} preview={originalImagePreview} />
              </div>
              
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your desired edit..."
                className="w-full h-32 p-3 bg-base-300 text-content rounded-lg border border-base-300 focus:border-brand-accent focus:ring-brand-accent transition duration-300 resize-none"
                disabled={isLoading}
              />
              
              <div className="flex items-center gap-2 mt-auto pt-4 border-t border-base-300">
                <button
                    onClick={handleGenerateClick}
                    disabled={!originalImage || isLoading}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-brand-accent text-gray-900 font-bold rounded-lg shadow-lg hover:shadow-xl hover:brightness-110 transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                >
                    {isLoading ? (
                    <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Generating...</span>
                    </>
                    ) : (
                    <>
                        <LightningIcon />
                        Generate Now (2 Credits)
                    </>
                    )}
                </button>
                <button className="p-3 bg-base-300 text-content-secondary rounded-lg hover:bg-base-300/80 transition" aria-label="Settings">
                    <SettingsIcon />
                </button>
              </div>
            </div>

            {/* Result Panel */}
            <div className="lg:col-span-3 flex flex-col gap-6">
                <div className="bg-base-200 rounded-xl p-6 flex flex-col flex-grow border border-base-300 min-h-[400px]">
                    <div className="flex items-center gap-3 mb-4">
                        <GalleryIcon />
                        <h2 className="text-xl font-bold text-white">Output Gallery</h2>
                    </div>
                    <ResultDisplay
                        originalImage={originalImagePreview}
                        editedImage={editedImage}
                        isLoading={isLoading}
                        error={error}
                        originalImageName={originalImage?.name}
                    />
                </div>
                <div className="bg-base-200 rounded-xl p-4 flex items-center gap-4 border border-base-300">
                    <LightbulbIcon />
                    <div>
                        <h3 className="font-bold text-white">Generation Tips</h3>
                        <p className="text-sm text-content-secondary">Use detailed descriptions for more accurate results</p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}