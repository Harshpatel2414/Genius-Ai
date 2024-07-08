
"use client";

import { useAuth } from '@/context/AuthContext';
import fetchFavoriteProducts from '@/utils/fetchFavoriteProducts';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { FaHeart, FaRegHeart, FaSpinner } from 'react-icons/fa';

const ProductCard = ({ product }) => {
  const { title, imageUrl, description, price, id } = product;
  const { currentUser, setFavProducts } = useAuth();
  const [localFavorites, setLocalFavorites] = useState([]);
  const [updatingFavorite, setUpdatingFavorite] = useState(false); // Flag to track update state

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setLocalFavorites(storedFavorites);
  }, []);

  const isFav = (id) => {
    return localFavorites.some((favProduct) => favProduct.id === id);
  };

  const handleFavoriteClick = async () => {
    setUpdatingFavorite(true)
    const newFavoriteState = !isFav(id);

    setLocalFavorites((prevFavorites) => {
      const updatedFavorites = newFavoriteState
        ? [...prevFavorites, product]
        : prevFavorites.filter((favProduct) => favProduct.id !== id);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });

    try {
      const body = JSON.stringify({
        product: product,
        userId: currentUser._id,
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
      
      setLocalFavorites((prevFavorites) => {
        const revertedFavorites = newFavoriteState
          ? prevFavorites.filter((favProduct) => favProduct.id !== id)
          : [...prevFavorites, product];
        localStorage.setItem('favorites', JSON.stringify(revertedFavorites));
        return revertedFavorites;
      });
    } finally {
      setUpdatingFavorite(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg min-w-[240px] w-[320px] h-fit drop-shadow-md shadow-zinc-100">
      <Image
        width={280}
        height={140}
        src={imageUrl}
        alt={title}
        className="w-full h-40 object-contain rounded-md object-center"
      />
      <div className="mt-2">
        <h3 className="font-semibold text-lg text-gray-900 truncate">
          {title.slice(0, 25)}
        </h3>
        <p className="text-gray-600">
          <span className="text-md font-semibold">Price</span>: ${price}
        </p>
        <p className="text-gray-600">
          <span className="text-md font-semibold">Details</span>:{' '}
          {description.slice(0, 50)}...
        </p>
      </div>
      <div className="flex justify-between items-center my-2">
        <span className={` ${isFav(id) ? 'text-blue-500' : 'text-gray-400'}`}>
          {isFav(id) ? 'Added to favorites' : 'Add to favorites'}
        </span>
        <button className="focus:outline-none" onClick={handleFavoriteClick} disabled={updatingFavorite}>
          {updatingFavorite ? (
            <FaSpinner className="animate-spin w-6 h-6 text-blue-500" />
          ) : (
            isFav(id) ? (
              <FaHeart className="w-6 h-6 text-blue-500" />
            ) : (
              <FaRegHeart className="w-6 h-6 text-gray-400" />
            )
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
