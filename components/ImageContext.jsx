'use client'
import React, { useState, useEffect, useContext } from 'react';

const ImageContext = React.createContext();

export const ImageProvider = ({ children }) => {
    const [imageDetails, setImageDetails] = useState([]);

    useEffect(() => {
        const localImageDetails = localStorage.getItem('imageDetails');
        const initialImageDetails = localImageDetails ? JSON.parse(localImageDetails) : [];
        setImageDetails(initialImageDetails);
    }, []); 

    const contextValue = { imageDetails, setImageDetails };

    return (
        <ImageContext.Provider value={contextValue}>
            {children}
        </ImageContext.Provider>
    );
};

// ... [rest of your ImageContext code]

const useImageContext = () => {
  const context = useContext(ImageContext);
  if (!context) {
      throw new Error('useImageContext must be used within an ImageProvider');
  }
  return context;
};

export {useImageContext };