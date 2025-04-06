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
    <div style={{ padding: "20px" }}>
      <h1>Audio Transcription with Deepgram</h1>
      <input
        type="file"
        accept="audio/*"
        onChange={(e) => {
          const files = e.target.files;
          if (files && files.length > 0) {
            setFile(files[0]);
          } else {
            setFile(null);
          }
        }}
      />
      <button onClick={handleTranscribe} disabled={loading}>
        {loading ? "Transcribing..." : "Transcribe"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {transcript && (
        <div>
          <h2>Transcript:</h2>
          <p>{transcript}</p>
          <h2>Confidence:</h2>
          <p>{confidence}</p>
        </div>
      )}
    </div>
  );
}
