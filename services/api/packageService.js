const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const packageService = {
    async getAvailablePackages() {
        try {
            const response = await fetch(`${API_BASE_URL}/public/GetAvailablePackages`);
            if (!response.ok) throw new Error('Failed to fetch packages');
            return await response.json();
    } catch (error) {
        console.error('Error fetching packages:', error);
        throw error;
        }
    }
};