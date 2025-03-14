// Serverless function for proxying Google Images to avoid CORS issues
export default async function handler(req, res) {
  try {
    // Get the URL from the query parameters
    const imageUrl = req.query.url;

    if (!imageUrl) {
      return res.status(400).json({ error: 'Missing URL parameter' });
    }

    // Fetch the image with proper credentials
    const response = await fetch(imageUrl);

    // If the fetch failed, return an error
    if (!response.ok) {
      return res.status(response.status).json({ 
        error: `Failed to fetch image: ${response.statusText}` 
      });
    }

    // Get the image data
    const imageBuffer = await response.arrayBuffer();
    
    // Set the content type based on the response
    const contentType = response.headers.get('content-type');
    res.setHeader('Content-Type', contentType || 'image/jpeg');
    
    // Set cache headers to help with performance
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
    
    // Return the image data
    return res.status(200).send(Buffer.from(imageBuffer));
  } catch (error) {
    console.error('Error in image-proxy:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
