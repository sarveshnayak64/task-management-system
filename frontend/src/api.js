const API_BASE_URL = 'http://localhost:3001/api'; 

export const apiRequest = async (endpoint, method = 'GET', data = null, token = null) => {
    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method,
        headers,
    };

    if (data) {
        config.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Something went wrong with the API request.');
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            return response.json();
        } else {
            return {}; 
        }

    } catch (error) {
        console.error('API Request Error:', error);
        throw error; 
    }
};
