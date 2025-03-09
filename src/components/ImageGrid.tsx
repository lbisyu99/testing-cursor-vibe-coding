"use client";

import Image from 'next/image';

interface ImageGridProps {
  images: string[];
  isLoading: boolean;
  hasSubmitted: boolean;
}

export default function ImageGrid({ images, isLoading, hasSubmitted }: ImageGridProps) {
  // If user hasn't submitted anything yet, don't show the grid
  if (!hasSubmitted) {
    return null;
  }

  // If loading, show placeholder grid with blur effect
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto">
        {[...Array(4)].map((_, index) => (
          <div 
            key={index} 
            className="aspect-square bg-gray-300 border-2 border-gray-400 flex items-center justify-center blur-sm animate-pulse rounded-lg"
          >
            <span className="text-gray-500 font-bold">Generating...</span>
          </div>
        ))}
      </div>
    );
  }

  // If no images after loading, show placeholder grid
  if (images.length === 0 && hasSubmitted) {
    return (
      <div className="text-center my-8">
        <p className="text-gray-600">No images were generated. Try a different prompt.</p>
      </div>
    );
  }

  // Show generated images
  return (
    <div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto">
      {images.map((src, index) => (
        <div key={index} className="aspect-square relative border-2 border-gray-300 rounded-lg overflow-hidden group">
          <Image 
            src={src} 
            alt={`Generated image ${index + 1}`} 
            fill 
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <a 
              href={src} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm hover:underline"
              download={`generated-image-${index + 1}.jpg`}
            >
              Download Image
            </a>
          </div>
        </div>
      ))}
    </div>
  );
} 