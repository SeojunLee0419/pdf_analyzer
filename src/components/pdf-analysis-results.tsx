"use client";

import { Card } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Info, FileText } from "lucide-react";

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

interface PdfAnalysisResultsProps {
  result: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
}

export default function PdfAnalysisResults({ result, isLoading, error }: PdfAnalysisResultsProps) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Analyzing PDF...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 border-red-200 bg-red-50">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="h-6 w-6 text-red-600" />
          <div>
            <h3 className="font-semibold text-red-800">Analysis Failed</h3>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      </Card>
    );
  }

  if (!result) {
    return null;
  }

  const { analysis, filename } = result;

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <FileText className="h-6 w-6 text-blue-600" />
          <div>
            <h3 className="font-semibold text-gray-800">Analysis Results</h3>
            <p className="text-sm text-gray-600">File: {filename}</p>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {Object.entries(analysis.summary).map(([key, value]) => (
            <div key={key} className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{value}</div>
              <div className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
            </div>
          ))}
        </div>

        {/* Suspicious Elements */}
        {analysis.suspicious.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <h4 className="font-semibold text-orange-800">Potentially Suspicious Elements</h4>
            </div>
            <div className="space-y-2">
              {analysis.suspicious.map((item, index) => (
                <div key={index} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm text-orange-800">{item}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Raw Output (Collapsible) */}
        <details className="mt-4">
          <summary className="cursor-pointer flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800">
            <Info className="h-4 w-4" />
            <span>View Raw Analysis Output</span>
          </summary>
          <pre className="mt-2 p-4 bg-gray-100 rounded-lg text-xs overflow-auto max-h-64">
            {result.rawOutput}
          </pre>
        </details>
      </Card>
    </div>
  );
}
