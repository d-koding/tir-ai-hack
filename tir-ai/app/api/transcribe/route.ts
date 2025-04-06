// app/api/transcribe/route.ts
import { createClient } from "@deepgram/sdk";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Step 1: Load and log the API key
    // const apiKey = process.env.DEEPGRAM_UPLOAD_API_KEY as string;
    // console.log("API Key from process.env:", apiKey);

    const apiKey = "4d70000c8b5a98771e9403afcd1cb1978db6741e";

    if (!apiKey) {
      return NextResponse.json(
        { error: "Server configuration error: Deepgram API key missing" },
        { status: 500 }
      );
    }

    // Step 2: Initialize Deepgram client
    const deepgram = createClient(apiKey);

    // Step 3: Parse form data
    const formData = await req.formData();
    const file = formData.get("audio");
    if (!file) {
      return NextResponse.json(
        { error: "No audio file uploaded" },
        { status: 400 }
      );
    }

    // Step 4: Convert file to buffer
    const fileBuffer = await (file as File).arrayBuffer();
    const buffer = Buffer.from(fileBuffer);

    // Step 5: Transcribe the file
    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
      buffer,
      {
        model: "nova-2",
        smart_format: true,
        punctuate: true,
        diarize: true,
      }
    );

    // Step 6: Handle response
    if (error) {
      console.error("Deepgram error:", error);
      return NextResponse.json(
        { error: error.message || "Transcription service error" },
        { status: 500 }
      );
    }

    if (!result || !result.results?.channels?.length) {
      return NextResponse.json(
        { error: "No transcription results returned" },
        { status: 500 }
      );
    }

    // Step 7: Extract and return results
    const transcript = result.results.channels[0].alternatives[0].transcript;
    const confidence = result.results.channels[0].alternatives[0].confidence;
    const words = result.results.channels[0].alternatives[0].words;

    return NextResponse.json({ transcript, confidence, words });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Failed to process audio", details: error },
      { status: 500 }
    );
  }
}
