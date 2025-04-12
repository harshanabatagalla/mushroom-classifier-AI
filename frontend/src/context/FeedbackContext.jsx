
import React, { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';
import api from '../services/api';

const FeedbackContext = createContext();

export const FeedbackProvider = ({ children }) => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currentUser, isAdmin } = useAuth();

  // Fetch feedback when user changes
  useEffect(() => {
    if (currentUser) {
      fetchFeedback();
    } else {
      // Clear feedback when user logs out
      setFeedback([]);
    }
  }, [currentUser, isAdmin]);

  const fetchFeedback = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      let response;
      
      // Admin users get all feedback, regular users get their own feedback
      if (isAdmin) {
        response = await api.get('/feedback');
      } else {
        response = await api.get('/feedback/user');
      }
      
      setFeedback(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching feedback:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const submitFeedback = async (imageId, text) => {
    if (!currentUser) {
      toast.error("You need to be logged in to submit feedback");
      return { success: false, error: "Authentication required" };
    }

    setLoading(true);
    try {
      const response = await api.post('/feedback', { imageId, text });
      
      setFeedback(prevFeedback => [...prevFeedback, response.data]);
      toast.success("Feedback submitted successfully");
      return { success: true, feedback: response.data };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to submit feedback";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const getUserFeedback = async (userId) => {
    try {
      return feedback.filter(fb => fb.user === userId || fb.user._id === userId);
    } catch (error) {
      console.error("Error filtering user feedback:", error);
      return [];
    }
  };

  const getAllFeedback = () => {
    return feedback;
  };

  const updateFeedbackStatus = async (feedbackId, status) => {
    try {
      const response = await api.put(`/feedback/${feedbackId}/status`, { status });
      
      setFeedback(prevFeedback => 
        prevFeedback.map(fb => 
          fb._id === feedbackId ? response.data : fb
        )
      );
      
      toast.success(`Feedback status updated to ${status}`);
      return { success: true, feedback: response.data };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update feedback status";
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const getPublicFeedback = async () => {
    try {
      const response = await api.get('/feedback/public');
      return response.data;
    } catch (error) {
      console.error("Error fetching public feedback:", error);
      return [];
    }
  };

  const value = {
    feedback,
    loading,
    submitFeedback,
    getUserFeedback,
    getAllFeedback,
    updateFeedbackStatus,
    fetchFeedback,
    getPublicFeedback
  };

  return (
    <FeedbackContext.Provider value={value}>
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (context === undefined) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
};
