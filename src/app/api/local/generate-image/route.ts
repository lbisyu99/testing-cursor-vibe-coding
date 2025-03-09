import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    console.log('Generating placeholder image for prompt:', prompt);
    
    // Generate a random color for the placeholder
    const colors = ['4287f5', 'f54242', '42f54e', 'f5d442', 'f542f2', '42f5f5'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Create placeholder image URLs with the prompt as text
    // Using placeholder.com service
    const imageUrls = [
      `https://placehold.co/600x400/${randomColor}/FFFFFF?text=${encodeURIComponent(prompt.substring(0, 30))}`,
    ];
    
    console.log('Generated placeholder image URLs:', imageUrls);
    
    return NextResponse.json({ imageUrls });
  } catch (error) {
    console.error('Error generating placeholder image:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate placeholder image' },
      { status: 500 }
    );
  }
} 