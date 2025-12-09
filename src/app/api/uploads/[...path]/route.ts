import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy endpoint for serving uploaded files from the backend.
 * This avoids CORS issues with static files by proxying through Next.js.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const filePath = path.join('/');
  
  // Get backend URL without /api/v1 suffix
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';
  const backendUrl = apiUrl.replace(/\/api\/v1\/?$/, '');
  
  try {
    const response = await fetch(`${backendUrl}/uploads/${filePath}`, {
      headers: {
        // Forward any relevant headers
        'Accept': request.headers.get('Accept') || '*/*',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: response.status }
      );
    }

    const contentType = response.headers.get('Content-Type') || 'application/octet-stream';
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error proxying file:', error);
    return NextResponse.json(
      { error: 'Failed to fetch file' },
      { status: 500 }
    );
  }
}
