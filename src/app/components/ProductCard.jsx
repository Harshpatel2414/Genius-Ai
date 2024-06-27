"use client";
import { useAuth } from '@/context/AuthContext';
import fetchFavoriteProducts from '@/utils/fetchFavoriteProducts';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const ProductCard = ({ product }) => {
  const { title, imageUrl, description, price, id } = product;
  const { currentUser, setFavProducts, favProducts } = useAuth();
  const [localFavorites, setLocalFavorites] = useState([]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setLocalFavorites(storedFavorites);
  }, []);

  const isFav = (id) => {
    return localFavorites.some((favProduct) => favProduct.id === id) && favProducts.some((favProduct) => favProduct.id === id);
  };

  const handleFavoriteClick = async () => {
    const newFavoriteState = !isFav(id);

    const updatedLocalFavorites = newFavoriteState
      ? [...localFavorites, product]
      : localFavorites.filter((favProduct) => favProduct.id !== id);

    setLocalFavorites(updatedLocalFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedLocalFavorites));

    try {
      const body = JSON.stringify({
        product: product,
        userId: currentUser._id
      });

      const response = await fetch('/api/add-favorite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      });

      if (!response.ok) {
        throw new Error('Failed to update product in favorites');
      }

      await fetchFavoriteProducts(currentUser._id, setFavProducts);
    } catch (error) {
      console.error('Error updating product in favorites:', error.message);
  
      setLocalFavorites(prev => newFavoriteState
        ? prev.filter((favProduct) => favProduct.id !== id)
        : [...prev, product]);
      localStorage.setItem('favorites', JSON.stringify(localFavorites));
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg min-w-[240px] w-[320px] h-fit drop-shadow-md shadow-zinc-100">
      <Image width={280} height={140} src={imageUrl} alt={title} className="w-full h-40 object-contain rounded-md object-center" />
      <div className="mt-2">
        <h3 className="font-semibold text-lg text-gray-900 truncate">{title.slice(0, 25)}</h3>
        <p className="text-gray-600">
          <span className="text-md font-semibold">Price</span>: ${price}
        </p>
        <p className="text-gray-600">
          <span className="text-md font-semibold">Details</span>: {description.slice(0, 50)}...
        </p>
      </div>
      <div className="flex justify-between items-center my-2">
        <span className={` ${isFav(id) ? 'text-blue-500' : 'text-gray-400'}`}>
          {isFav(id) ? 'Added to favorites' : 'Add to favorites'}
        </span>
        <button
          className="focus:outline-none"
          onClick={handleFavoriteClick}
        >
          {isFav(id) ? <FaHeart className="w-6 h-6 text-blue-500" /> : <FaRegHeart className="w-6 h-6 text-gray-400" />}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
