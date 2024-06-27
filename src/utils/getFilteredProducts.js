const getFilteredProducts = (productList) => {
    return productList.map(product => {
        const id = product.id;
        const title = product.title;
        const description = product.body_html.replace(/<[^>]*>/g, '');
        const price = product?.variants[0].price || product.price;
        const imageUrl = product.imageUrl || product.images[0]?.src;

        return { id, title, description, price, imageUrl };
    });
}

export default getFilteredProducts;