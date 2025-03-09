'use client';

import { useState } from 'react';
import PromptInput from '@/components/PromptInput';
import ImageGrid from '@/components/ImageGrid';

type ApiMode = 'demo' | 'fal-sdk' | 'fal-direct';

export default function Home() {
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiMode, setApiMode] = useState<ApiMode>('demo'); // Default to demo mode

  const handleGenerateImage = async (prompt: string) => {
    setIsLoading(true);
    setHasSubmitted(true);
    setError(null);
    setImages([]);
    
    console.log('Submitting prompt:', prompt);
    
    try {
      // Use the appropriate API based on the mode
      let apiEndpoint = '/api/local/generate-image';
      
      if (apiMode === 'fal-sdk') {
        apiEndpoint = '/api/fal/generate-image';
      } else if (apiMode === 'fal-direct') {
        apiEndpoint = '/api/fal-direct/generate-image';
      }
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      
      console.log('Response status:', response.status);
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate images');
      }
      
      console.log('Response data:', data);
      
      if (data.imageUrls && data.imageUrls.length > 0) {
        setImages(data.imageUrls);
      } else {
        setError('No images were returned from the API. Please try a different prompt or try again later.');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen">
      <h1 className="text-3xl font-bold mt-8 mb-4">AI Image Generator</h1>
      <p className="text-gray-600 mb-8 text-center max-w-2xl">
        Enter a detailed description of the image you want to generate, and our AI will create it for you using Stable Diffusion XL.
      </p>
      
      <div className="mb-4 flex flex-col items-center">
        <div className="flex items-center space-x-4 mb-2">
          <button 
            onClick={() => setApiMode('demo')}
            className={`px-4 py-2 rounded-md ${apiMode === 'demo' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Demo Mode
          </button>
          <button 
            onClick={() => setApiMode('fal-sdk')}
            className={`px-4 py-2 rounded-md ${apiMode === 'fal-sdk' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            FAL SDK
          </button>
          <button 
            onClick={() => setApiMode('fal-direct')}
            className={`px-4 py-2 rounded-md ${apiMode === 'fal-direct' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            FAL Direct
          </button>
        </div>
        <p className="text-sm text-gray-600">
          {apiMode === 'demo' 
            ? 'Using placeholder images (no API key needed)' 
            : apiMode === 'fal-sdk' 
              ? 'Using FAL AI SDK with multiple model fallbacks' 
              : 'Using direct API call to FAL AI flux model'}
        </p>
      </div>
      
      <PromptInput onSubmit={handleGenerateImage} isLoading={isLoading} />
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 max-w-2xl w-full">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}
      
      <ImageGrid images={images} isLoading={isLoading} hasSubmitted={hasSubmitted} />
      
      {apiMode === 'demo' && images.length > 0 && (
        <div className="mt-4 p-3 bg-yellow-100 text-yellow-800 rounded max-w-2xl">
          <p className="text-sm">
            <strong>Note:</strong> You are currently in demo mode. These are placeholder images, not actual AI-generated images.
            Select one of the API modes above to use the real AI image generation API (requires valid API keys).
          </p>
        </div>
      )}
    </div>
  );
}
