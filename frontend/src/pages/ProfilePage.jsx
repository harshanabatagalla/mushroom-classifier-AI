import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import { useAuth } from '@/context/AuthContext';
import { useImage } from '@/context/ImageContext';
import { useFeedback } from '@/context/FeedbackContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileActivity from '@/components/Profile/ProfileActivity';
import ProfileEditForm from '@/components/Profile/ProfileEditForm';

const ProfilePage = () => {
  const { currentUser, isAdmin } = useAuth();
  const { images, fetchUserImages } = useImage();
  const { feedback, fetchFeedback } = useFeedback();
  const [loading, setLoading] = useState(true);
  const [imageCount, setImageCount] = useState(0);
  const [feedbackCount, setFeedbackCount] = useState(0);
  
  useEffect(() => {
    const loadUserData = async () => {
      if (currentUser) {
        setLoading(true);
        await fetchUserImages();
        await fetchFeedback();
        
        // Count user's images and feedback
        const userImages = images.filter(img => 
          img.user === currentUser.id || 
          img.user?._id === currentUser.id
        );
        const userFeedback = feedback.filter(fb => 
          fb.user === currentUser.id || 
          fb.user?._id === currentUser.id
        );
        
        setImageCount(userImages.length);
        setFeedbackCount(userFeedback.length);
        setLoading(false);
      }
    };
    
    loadUserData();
  }, [currentUser]);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <MainLayout>
      <section className="container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-1">My Profile</h1>
            <p className="text-muted-foreground">
              Manage your account and view your mushroom identification activity
            </p>
          </div>
          
          <Tabs defaultValue="activity">
            <TabsList className="mb-6">
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="edit">Edit Profile</TabsTrigger>
            </TabsList>
            
            <TabsContent value="activity">
              <ProfileActivity 
                imageCount={imageCount} 
                feedbackCount={feedbackCount}
                loading={loading}
              />
            </TabsContent>
            
            <TabsContent value="edit">
              <ProfileEditForm />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </MainLayout>
  );
};

export default ProfilePage;