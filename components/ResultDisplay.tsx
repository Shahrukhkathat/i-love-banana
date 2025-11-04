import React from 'react';
import { Loader } from './Loader';
import { DownloadIcon } from './icons/DownloadIcon';
import { ImageComparator } from './ImageComparator';
import { LogoIcon as GalleryIcon } from './icons/LogoIcon';

interface ResultDisplayProps {
  editedImage: string | null;
  originalImage: string | null;
  isLoading: boolean;
  error: string | null;
  originalImageName?: string;
}

export function ResultDisplay({ editedImage, originalImage, isLoading, error, originalImageName }: ResultDisplayProps) {
  
  const getFileName = () => {
    if (!originalImageName) return 'edited-image.png';
    const parts = originalImageName.split('.');
    const extension = parts.pop() || 'png';
    return `${parts.join('.')}-edited.${extension}`;
  }
  
  const renderContent = () => {
    if (isLoading) {
      return <Loader />;
    }
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center text-center text-red-400 bg-red-900/20 p-6 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="font-semibold">An Error Occurred</p>
          <p className="text-sm">{error}</p>
        </div>
      );
    }
    if (editedImage && originalImage) {
      return <ImageComparator originalImage={originalImage} editedImage={editedImage} />;
    }
    return (
      <div className="flex flex-col items-center justify-center text-center text-content-secondary h-full">
        <GalleryIcon className="w-16 h-16 text-content-secondary/50" />
        <p className="font-semibold text-lg mt-4 text-content">Ready for instant generation</p>
        <p className="text-sm">Enter your prompt and unleash the power</p>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full flex-grow">
      <div className="flex-grow w-full min-h-[20rem] bg-base-100 rounded-lg flex items-center justify-center p-2 relative">
        {renderContent()}
      </div>
      {editedImage && !isLoading && (
        <a
          href={editedImage}
          download={getFileName()}
          className="mt-6 w-full flex items-center justify-center gap-3 py-3 px-6 bg-base-300 text-content font-bold text-lg rounded-lg shadow-md hover:bg-base-300/80 transition-colors duration-300"
        >
          <DownloadIcon />
          Download Image
        </a>
      )}
    </div>
  );
}
