import React from 'react';

const FavoriteProducts = ({ favProducts }) => {
  return (
    <ul className="mt-2 pt-1 space-y-2 overflow-y-auto max-h-80 min-h-40 hide-scrollbar">
      {favProducts.length > 0 ? (
        favProducts.map(product => (
          <li key={product.id} className="p-2 bg-gray-50 drop-shadow-sm rounded hover:bg-blue-100 cursor-pointer select-none">
            <h3 className="truncate text-gray-950 text-md">{product.title}</h3>
            <p className="text-sm text-gray-600 truncate">{product.description}</p>
            <p className="text-sm font-semibold text-gray-600">${product.price}</p>
          </li>
        ))
      ) : (
        <div>
          <p className="text-gray-600 text-md ml-2">No favourite products</p>
        </div>
      )}
    </ul>
  );
};

export default FavoriteProducts;
