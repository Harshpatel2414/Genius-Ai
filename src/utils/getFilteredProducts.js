const getFilteredProducts = (productList) => {
    return productList.map(product => {
        const id = product.id;
        const title = product.title;
        const description = product.description.replace(/<[^>]*>/g, '');
        const price = product.price;
        const imageUrl = product.imageUrl;

        return { id, title, description, price, imageUrl };
    });
}

export default getFilteredProducts;