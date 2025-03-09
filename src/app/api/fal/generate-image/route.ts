import { NextResponse } from 'next/server';
import { fal } from '@fal-ai/client';

// Define flexible types for different FAL AI model responses
interface FalImage {
  url: string;
  width?: number;
  height?: number;
  content_type?: string;
}

interface FalResponse {
  images?: FalImage[];
  image?: FalImage;
  timings?: {
    inference: number;
  };
  seed?: number;
  has_nsfw_concepts?: boolean[];
  prompt?: string;
}

export async function POST(request: Request) {
  try {
    // Get API key from environment variable
    const apiKey = process.env.FAL_API_KEY;
    
    if (!apiKey) {
      console.error('API key is not configured');
      return NextResponse.json(
        { error: 'API key is not configured' },
        { status: 500 }
      );
    }

    // Initialize the Fal client with the API key
    fal.config({
      credentials: apiKey
    });

    console.log('API key is configured:', apiKey.substring(0, 8) + '...');

    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    console.log('Processing prompt:', prompt);

    // Try multiple models in sequence until one works
    const models = [
      {
        name: 'fal-ai/flux/dev',
        params: {
          prompt: prompt,
          image_size: 'landscape_16_9',
          num_inference_steps: 28,
          guidance_scale: 3.5,
          num_images: 1,
          enable_safety_checker: true
        }
      },
      {
        name: 'fal-ai/fast-sdxl',
        params: {
          prompt: prompt,
          negative_prompt: "low quality, blurry, distorted",
          height: 512,
          width: 512,
        }
      },
      {
        name: 'fal-ai/stable-diffusion',
        params: {
          prompt: prompt,
          num_inference_steps: 30,
          guidance_scale: 7.5,
        }
      },
      {
        name: 'fal-ai/text-to-image',
        params: {
          prompt: prompt,
        }
      }
    ];

    let lastError = null;

    // Try each model in sequence
    for (const model of models) {
      try {
        console.log(`Trying model: ${model.name}`);
        
        // Use the Fal client to run the model with any parameters
        const result = await fal.run(model.name, {
          input: model.params as any
        });
        
        console.log(`${model.name} response received:`, JSON.stringify(result));
        
        // Cast the result to our flexible type
        const typedResult = result as unknown as FalResponse;
        
        // Extract image URLs from the result - handle different response formats
        if (typedResult.images && typedResult.images.length > 0) {
          const imageUrls = typedResult.images.map(image => image.url);
          console.log(`Generated ${imageUrls.length} images with ${model.name}`);
          return NextResponse.json({ imageUrls });
        } else if (typedResult.image && typedResult.image.url) {
          console.log(`Generated 1 image with ${model.name}`);
          return NextResponse.json({ imageUrls: [typedResult.image.url] });
        } else if (Array.isArray(result) && result.length > 0 && typeof result[0] === 'string') {
          // Some models might return an array of URLs directly
          console.log(`Generated ${result.length} images with ${model.name} (direct URL array)`);
          return NextResponse.json({ imageUrls: result });
        } else if (typeof result === 'string') {
          // Some models might return a single URL directly
          console.log(`Generated 1 image with ${model.name} (direct URL string)`);
          return NextResponse.json({ imageUrls: [result] });
        } else {
          console.log(`No images found in ${model.name} response:`, JSON.stringify(result));
          // Continue to the next model
        }
      } catch (error) {
        console.error(`Error with ${model.name} model:`, error);
        lastError = error;
        // Continue to the next model
      }
    }

    // If we get here, all models failed
    console.error('All models failed to generate images');
    return NextResponse.json(
      { error: 'Failed to generate images with all available models. Please try a different prompt.' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate image' },
      { status: 500 }
    );
  }
} 