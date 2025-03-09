import { NextResponse } from "next/server";
import Replicate from "replicate";

export async function POST(request: Request) {
  try {
    // Check if the REPLICATE_API_TOKEN is set
    const replicateApiToken = process.env.REPLICATE_API_TOKEN;
    if (!replicateApiToken) {
      console.error("REPLICATE_API_TOKEN is not set");
      return NextResponse.json(
        { error: "The REPLICATE_API_TOKEN environment variable is not set." },
        { status: 500 }
      );
    }

    // Initialize Replicate client
    const replicate = new Replicate({
      auth: replicateApiToken,
    });

    // Get the prompt from the request
    const { prompt } = await request.json();
    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    console.log("Processing prompt with Replicate:", prompt);

    // Run the Stable Diffusion model
    const output = await replicate.run(
      "stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf",
      {
        input: {
          prompt: prompt,
          image_dimensions: "512x512",
          num_outputs: 1,
          num_inference_steps: 50,
          guidance_scale: 7.5,
          scheduler: "DPMSolverMultistep",
        },
      }
    );

    console.log("Replicate API response:", output);

    // Check if we got a valid output
    if (!output || (Array.isArray(output) && output.length === 0)) {
      console.error("No images returned from Replicate API");
      return NextResponse.json(
        { error: "No images were returned from the API" },
        { status: 500 }
      );
    }

    // Return the image URLs
    // The output from Replicate is typically an array of image URLs
    const imageUrls = Array.isArray(output) ? output : [output];
    return NextResponse.json({ imageUrls }, { status: 200 });
  } catch (error) {
    console.error("Error from Replicate API:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate image" },
      { status: 500 }
    );
  }
}
