"use client";

import { useState } from "react";

export default function Transcribe() {
  const [file, setFile] = useState<File | null>(null);
  const [transcript, setTranscript] = useState("");
  const [confidence, setConfidence] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTranscribe = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    setLoading(true);
    setError(null);
    setTranscript("");
    setConfidence("");

    const formData = new FormData();
    formData.append("audio", file);

    try {
      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setTranscript(data.transcript);
        setConfidence(data.confidence);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Audio Transcription with Deepgram
      </h1>

      {/* Custom File Input Container */}
      <div className="flex items-center justify-center mb-4">
        <input
          type="file"
          accept="audio/*"
          className="hidden"
          id="fileInput"
          onChange={(e) => {
            const files = e.target.files;
            if (files && files.length > 0) {
              setFile(files[0]);
            } else {
              setFile(null);
            }
          }}
        />
        <label
          htmlFor="fileInput"
          className="cursor-pointer bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
        >
          Choose File
        </label>
      </div>

      {/* Transcribe Button */}
      <div className="text-center mb-4">
        <button
          onClick={handleTranscribe}
          disabled={loading}
          className="py-2 px-6 rounded-md text-white font-semibold bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 transition"
        >
          {loading ? "Transcribing..." : "Transcribe"}
        </button>
      </div>

      {/* Error and Transcript Display */}
      {error && (
        <p className="text-red-500 text-center mt-2 font-semibold">{error}</p>
      )}
      {transcript && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-gray-800">Transcript:</h2>
          <p className="text-lg text-gray-700 mt-2">{transcript}</p>
          <h2 className="text-2xl font-semibold text-gray-800 mt-4">
            Confidence:
          </h2>
          <p className="text-lg text-gray-700">{confidence}</p>
        </div>
      )}
    </div>
  );
}
