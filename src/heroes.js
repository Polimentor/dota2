export const fetchHeroes = async () => {
    try {
        const response = await fetch('https://api.opendota.com/api/heroStats');
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Ошибка при получении героев:', error.message);
        throw error;
    }
};