// Resolve API base URL with a few fallbacks:
// 1) `VITE_API_URL` if provided (recommended for production deployments)
// 2) If running in the browser on localhost/127.0.0.1, use local backend port
// 3) Otherwise empty string so fetches are relative to site origin
const envUrl = import.meta.env.VITE_API_URL;
let API_URL = envUrl ?? '';

if (!API_URL && typeof window !== 'undefined') {
	const host = window.location.hostname;
	if (host === 'localhost' || host === '127.0.0.1') {
		API_URL = 'http://localhost:5000';
	}
}

if (!API_URL) console.warn('API base URL not set (VITE_API_URL). Fetches will be relative to site origin.');

export default API_URL;
