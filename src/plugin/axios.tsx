import axios from 'axios';

// Set the base URL for Axios requests
axios.defaults.baseURL = `${import.meta.env.VITE_URL}/api/`;

// Set default headers for GET and POST requests
axios.defaults.headers.get['Accept'] = 'application/json';
axios.defaults.headers.post['Content-Type'] = 'application/json';

// Set CSRF token header if available
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
if (csrfToken) {
  axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
}

export default axios;