import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      // Proxy for Google images to avoid CORS issues
      '/api/image-proxy': {
        target: 'https://lh3.googleusercontent.com',
        changeOrigin: true,
        rewrite: (path) => {
          // Extract the encoded URL from the path
          const urlParam = new URLSearchParams(path.split('?')[1]).get('url');
          if (!urlParam) return path;
          
          try {
            // Decode the URL and extract the path part
            const decodedUrl = decodeURIComponent(urlParam);
            const parsedUrl = new URL(decodedUrl);
            // Return just the pathname and search params
            return parsedUrl.pathname + parsedUrl.search;
          } catch (e) {
            console.error('Error parsing URL:', e);
            return path;
          }
        },
        headers: {
          // Add headers to ensure the request is accepted
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br',
          'Referer': 'https://maps.google.com/'
        }
      }
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
