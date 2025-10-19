#!/bin/bash

# Setup script for pdfid.py
echo "Setting up pdfid.py for PDF analysis..."

# Create a tools directory
mkdir -p tools
cd tools

# Download pdfid.py from Didier Stevens' repository
echo "Downloading pdfid.py..."
curl -o pdfid.py https://raw.githubusercontent.com/didierstevens/DidierStevensSuite/master/pdfid.py

# Make it executable
chmod +x pdfid.py

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

# Test the installation
echo "Testing pdfid.py installation..."
python3 pdfid.py --help

if [ $? -eq 0 ]; then
    echo "✅ pdfid.py setup completed successfully!"
    echo "📁 pdfid.py is located at: $(pwd)/pdfid.py"
    echo ""
    echo "To use it in your Next.js app, make sure the API route points to the correct path."
    echo "You may need to update the path in src/app/api/analyze-pdf/route.ts"
else
    echo "❌ pdfid.py setup failed. Please check the error messages above."
    exit 1
fi
