const getBaseURL = () => {
    // In Vite, `import.meta.env.PROD` is `true` for production builds.
    if (import.meta.env.PROD) {
        // This now comes from VITE_BACKEND_URL
        return import.meta.env.VITE_BACKEND_URL;
    }
    // This is used for local development
    return 'http://localhost:5000';
};

const API_BASE_URL = getBaseURL();

const apiFetch = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}/api${endpoint}`; // Prepend /api to all requests

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
        // Replicates axios behavior of rejecting on non-2xx status codes
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        const error = new Error(errorData.message || 'An error occurred');
        error.response = response;
        throw error;
    }

    return response.json();
};

export default apiFetch;