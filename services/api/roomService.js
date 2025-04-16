const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const roomService = {
    async getAvailableRoomTypes(checkInDate, checkOutDate) {
        try {
            const response = await fetch(
                `${API_BASE_URL}/public/room/availableRoomTypes?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`
            );
            if (!response.ok) throw new Error('Failed to fetch room types');
        
            return await response.json();

        } catch (error) {
            console.error('Error fetching room types:', error);
        throw error;
        }
    },

    async getAllRoomTypes() {
        try {
            const response = await fetch(`${API_BASE_URL}/public/room/getAllRoomTypes`);
        if (!response.ok) throw new Error('Failed to fetch all room types');
            return await response.json();
        } catch (error) {
            console.error('Error fetching all room types:', error);
            throw error;
        }
    }
};