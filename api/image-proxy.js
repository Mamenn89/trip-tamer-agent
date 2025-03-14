// Serverless function for proxying Google Images to avoid CORS issues
import fetch from 'node-fetch';

export default async function handler(req, res) {
  // Make this function work with both Vercel and development environment
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing URL parameter' });
  }

  try {
    console.log('Proxying image:', url);
    
    // Fetch the image directly without additional headers
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'image/*',
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch image: ${response.status} ${response.statusText}`);
      return res.status(response.status).json({ 
        error: `Failed to fetch image: ${response.statusText}` 
      });
    }

    // Get the image data as array buffer
    const imageBuffer = await response.arrayBuffer();
    
    // Set appropriate content type
    const contentType = response.headers.get('content-type');
    res.setHeader('Content-Type', contentType || 'image/jpeg');
    
    // Set cache control headers
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    
    // Send the image data
    return res.status(200).send(Buffer.from(imageBuffer));
  } catch (error) {
    console.error('Error in image-proxy:', error);
    return res.status(500).json({ error: 'Failed to proxy image' });
  }
}
