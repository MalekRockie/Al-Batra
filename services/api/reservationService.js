const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const reservationService = {
    async lookupReservation(lastName, referenceCode) {
    try {
        const response = await fetch(`${API_BASE_URL}/public/reservation/lookup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lastName, referenceCode })
        });

        if (!response.ok) throw new Error('Failed to lookup reservation');
        return await response.json();
        
        } catch (error) {
            console.error('Error looking up reservation:', error);
            throw error;
        }
    }
};