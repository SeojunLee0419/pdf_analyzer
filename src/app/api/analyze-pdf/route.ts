import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create temporary file
    const tempFilePath = join(tmpdir(), `temp_${Date.now()}_${file.name}`);
    await writeFile(tempFilePath, buffer);

    try {
      // Run pdfid.py on the temporary file
      // Note: Make sure pdfid.py is installed in the tools directory
      // Run ./setup-pdfid.sh to install it
      const pdfidPath = join(process.cwd(), 'tools', 'pdfid.py');
      const { stdout, stderr } = await execAsync(`python3 "${pdfidPath}" "${tempFilePath}"`);
      
      if (stderr) {
        console.error('pdfid.py stderr:', stderr);
      }

      // Parse the output (pdfid.py outputs structured data)
      const analysisResult = parsePdfIdOutput(stdout);

      return NextResponse.json({
        success: true,
        filename: file.name,
        analysis: analysisResult,
        rawOutput: stdout
      });

    } finally {
      // Clean up temporary file
      try {
        await unlink(tempFilePath);
      } catch (cleanupError) {
        console.error('Error cleaning up temp file:', cleanupError);
      }
    }

  } catch (error) {
    console.error('Error analyzing PDF:', error);
    return NextResponse.json(
      { error: 'Failed to analyze PDF', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

function parsePdfIdOutput(output: string) {
  const lines = output.split('\n');
  const result: any = {
    summary: {},
    objects: [],
    suspicious: []
  };

  for (const line of lines) {
    const trimmed = line.trim();
    
    // Parse summary statistics
    if (trimmed.includes('PDF Header:')) {
      result.summary.header = trimmed.split('PDF Header:')[1]?.trim();
    } else if (trimmed.includes('Total entropy:')) {
      result.summary.entropy = trimmed.split('Total entropy:')[1]?.trim();
    } else if (trimmed.includes('Count ')) {
      const match = trimmed.match(/Count (\w+):\s*(\d+)/);
      if (match) {
        result.summary[match[1].toLowerCase()] = parseInt(match[2]);
      }
    }
    
    // Look for suspicious patterns
    if (trimmed.includes('JavaScript') || trimmed.includes('OpenAction') || 
        trimmed.includes('Launch') || trimmed.includes('EmbeddedFile')) {
      result.suspicious.push(trimmed);
    }
  }

  return result;
}
