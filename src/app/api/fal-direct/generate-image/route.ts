import { NextResponse } from 'next/server';

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

    console.log('API key is configured:', apiKey.substring(0, 8) + '...');

    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    console.log('Processing prompt with direct API call:', prompt);

    // Make a direct API call to FAL AI
    try {
      const response = await fetch('https://api.fal.ai/v1/models/fal-ai/flux/dev', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Key ${apiKey}`,
        },
        body: JSON.stringify({
          input: {
            prompt: prompt,
            image_size: 'landscape_16_9',
            num_inference_steps: 28,
            guidance_scale: 3.5,
            num_images: 1,
            enable_safety_checker: true
          }
        }),
      });

      console.log('Direct API response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error from direct API call:', errorData);
        throw new Error(`API error: ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      console.log('Direct API response data:', JSON.stringify(data));

      // Extract image URLs from the response
      let imageUrls: string[] = [];
      
      if (data.images && Array.isArray(data.images) && data.images.length > 0) {
        imageUrls = data.images.map((image: any) => image.url);
      } else if (data.image && data.image.url) {
        imageUrls = [data.image.url];
      } else if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'string') {
        imageUrls = data;
      } else if (typeof data === 'string') {
        imageUrls = [data];
      }

      if (imageUrls.length > 0) {
        console.log(`Generated ${imageUrls.length} images with direct API call`);
        return NextResponse.json({ imageUrls });
      } else {
        console.error('No images found in direct API response');
        throw new Error('No images were returned from the API');
      }
    } catch (apiError) {
      console.error('Error with direct API call:', apiError);
      throw apiError;
    }
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate image' },
      { status: 500 }
    );
  }
} 