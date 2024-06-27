const fetchFavoriteProducts = async (userId, setFavProducts) => {
    try {
        const response = await fetch('/api/fetch-favorite', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId })
        });
        if (!response.ok) {
            throw new Error('Failed to fetch favorite products');
        }
        const { favorites } = await response.json();
        localStorage.setItem('favorites', JSON.stringify(favorites));
        setFavProducts(favorites)
    } catch (error) {
        console.error('Error fetching favorite products:', error);
        return [];
    }
};

export default fetchFavoriteProducts;