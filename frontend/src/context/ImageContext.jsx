
import React, { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';
import api from '../services/api';

const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [classification, setClassification] = useState(null);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  // Fetch user images when user changes
  useEffect(() => {
    if (currentUser) {
      fetchUserImages();
    } else {
      // Clear images when user logs out
      setImages([]);
      setSelectedImage(null);
      setClassification(null);
    }
  }, [currentUser]);

  const fetchUserImages = async () => {
    try {
      setLoading(true);
      const response = await api.get('/images');
      setImages(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching images:", error);
      toast.error("Failed to load images");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file) => {
    if (!currentUser) {
      toast.error("You need to be logged in to upload images");
      return { success: false, error: "Authentication required" };
    }

    setLoading(true);
    try {
      // Create form data to send the file
      const formData = new FormData();
      formData.append('image', file);

      const response = await api.post('/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      const newImage = response.data;
      setImages((prevImages) => [...prevImages, newImage]);
      setSelectedImage(newImage);
      toast.success("Image uploaded successfully");
      return { success: true, image: newImage };
    } catch (error) {
      console.error("Image upload error:", error);
      const message = error.response?.data?.message || "Failed to upload image";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const analyzeImage = async (imageId) => {
    setLoading(true);
    try {
      const response = await api.post(`/images/analyze/${imageId}`);
      
      // Update the image to mark it as analyzed
      setImages(prevImages => 
        prevImages.map(img => 
          img._id === imageId ? { ...img, analyzed: true, classification: response.data._id } : img
        )
      );
      
      // Fetch the complete image with populated classification
      const imageResponse = await api.get(`/images/${imageId}`);
      const updatedImage = imageResponse.data;
      
      setSelectedImage(updatedImage);
      setClassification(updatedImage.classification);
      toast.success("Analysis complete");
      return { success: true, result: updatedImage.classification };
    } catch (error) {
      console.error("Image analysis error:", error);
      const message = error.response?.data?.message || "Failed to analyze image";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const getImage = async (imageId) => {
    try {
      const response = await api.get(`/images/${imageId}`);
      return { success: true, image: response.data };
    } catch (error) {
      console.error("Error fetching image:", error);
      return { success: false, error: error.response?.data?.message || "Error fetching image" };
    }
  };

  const getUserImages = async (userId) => {
    try {
      const userImages = images.filter(img => img.user === userId || img.user._id === userId);
      return userImages;
    } catch (error) {
      console.error("Error filtering user images:", error);
      return [];
    }
  };

  const value = {
    images,
    selectedImage,
    setSelectedImage,
    classification,
    setClassification,
    loading,
    uploadImage,
    analyzeImage,
    getUserImages,
    fetchUserImages,
    getImage
  };

  return (
    <ImageContext.Provider value={value}>
      {children}
    </ImageContext.Provider>
  );
};

export const useImage = () => {
  const context = useContext(ImageContext);
  if (context === undefined) {
    throw new Error('useImage must be used within an ImageProvider');
  }
  return context;
};
