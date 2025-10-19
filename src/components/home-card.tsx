"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import FileDropzone from "./file-dropzone";
import PdfAnalysisResults from "./pdf-analysis-results";

interface AnalysisResult {
  success: boolean;
  filename: string;
  analysis: {
    summary: {
      header?: string;
      entropy?: string;
      [key: string]: any;
    };
    objects: any[];
    suspicious: string[];
  };
  rawOutput: string;
}

export default function HomeCard() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    console.log("File selected:", file.name);
    setSelectedFile(file);
    setAnalysisResult(null);
    setError(null);
  };

  const analyzePdf = async () => {
    if (!selectedFile) {
      setError("Please select a PDF file first");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      console.log('Uploading file:', selectedFile.name, 'Size:', selectedFile.size);

      const response = await fetch('/api/analyze-pdf', {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      const result = await response.json();
      console.log('Response result:', result);

      if (!response.ok) {
        throw new Error(result.error || 'Analysis failed');
      }

      setAnalysisResult(result);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="min-h-screen grid place-items-center p-8">
      <div className="w-full max-w-4xl space-y-6">
        <Card className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">PDF Analyzer</h1>
            <p className="text-sm opacity-80">Upload your PDF document to analyze with pdfid.py</p>
          </div>
          
          <FileDropzone 
            onFileSelect={handleFileSelect}
            acceptedTypes={[".pdf"]}
            maxSize={10}
          />
          
          <div className="text-center">
            <Button 
              onClick={analyzePdf}
              disabled={!selectedFile || isAnalyzing}
              className="w-full"
            >
              {isAnalyzing ? "Analyzing..." : "Analyze PDF"}
            </Button>
          </div>
        </Card>

        <PdfAnalysisResults 
          result={analysisResult}
          isLoading={isAnalyzing}
          error={error}
        />
      </div>
    </main>
  );
}
