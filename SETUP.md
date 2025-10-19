# PDF Analyzer Setup

This project uses `pdfid.py` by Didier Stevens to analyze PDF files for security threats and suspicious content.

## Prerequisites

- Node.js (v18 or higher)
- Python 3
- npm or yarn

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Install pdfid.py

Run the setup script to download and install pdfid.py:

```bash
./setup-pdfid.sh
```

This will:
- Create a `tools` directory
- Download `pdfid.py` from Didier Stevens' repository
- Make it executable
- Test the installation

### 3. Start the Development Server

```bash
npm run dev
```

## How It Works

1. **File Upload**: Users can drag and drop or select PDF files through the web interface
2. **Temporary Storage**: The uploaded file is temporarily saved to the system's temp directory
3. **Analysis**: `pdfid.py` analyzes the PDF for:
   - JavaScript code
   - Embedded files
   - Launch actions
   - Open actions
   - Suspicious objects
   - Entropy analysis
4. **Results Display**: The analysis results are parsed and displayed in a user-friendly format
5. **Cleanup**: Temporary files are automatically deleted after analysis

## API Endpoint

The analysis is handled by the `/api/analyze-pdf` endpoint which:
- Accepts multipart form data with a PDF file
- Runs `pdfid.py` on the uploaded file
- Returns structured analysis results

## Security Note

This tool runs `pdfid.py` locally on your machine. The analysis happens server-side, so make sure you trust the PDF files you're analyzing.

## Troubleshooting

### pdfid.py not found
- Make sure you ran `./setup-pdfid.sh`
- Check that `tools/pdfid.py` exists
- Verify Python 3 is installed: `python3 --version`

### Permission errors
- Make sure `pdfid.py` is executable: `chmod +x tools/pdfid.py`
- Check that the tools directory has proper permissions

### Analysis fails
- Check the browser console for error messages
- Look at the server logs for detailed error information
- Ensure the PDF file is not corrupted
