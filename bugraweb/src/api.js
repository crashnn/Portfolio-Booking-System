// Use Vercel-provided `VITE_API_URL` when available.
// Fallback to empty string so frontend deployed on Vercel doesn't try to call localhost.
const API_URL = import.meta.env.VITE_API_URL ?? '';
export default API_URL;
