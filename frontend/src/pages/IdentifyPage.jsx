
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import ImageUploader from '@/components/Identification/ImageUploader';
import ImagePreview from '@/components/Identification/ImagePreview';
import ClassificationResult from '@/components/Identification/ClassificationResult';
import { useImage } from '@/context/ImageContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

const IdentifyPage = () => {
  const { currentUser } = useAuth();
  const { selectedImage, classification, setSelectedImage, setClassification } = useImage();
  
  // Reset selected image and classification when component unmounts
  useEffect(() => {
    return () => {
      setSelectedImage(null);
      setClassification(null);
    };
  }, []);
  
  // If user is not logged in, show a prompt to login
  if (!currentUser) {
    return (
      <MainLayout>
        <section className="container py-12 md:py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Identify Mushrooms</h1>
            <div className="bg-muted p-8 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Login Required</h2>
              <p className="text-muted-foreground mb-6">
                Please log in or create an account to identify mushrooms.
              </p>
              <div className="flex justify-center gap-4">
                <Button asChild className="bg-mushroom-primary hover:bg-mushroom-dark">
                  <a href="/login">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/register">Create Account</a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <section className="container py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Identify Mushrooms</h1>
          <p className="text-muted-foreground mb-6">
            Upload a photo of a mushroom to identify if it's edible or poisonous.
          </p>
          
          <div className="grid grid-cols-1 gap-8">
            {!selectedImage ? (
              <ImageUploader />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ImagePreview image={selectedImage} />
                {classification && (
                  <ClassificationResult result={classification} image={selectedImage} />
                )}
              </div>
            )}
          </div>
          
          {selectedImage && !classification && (
            <div className="mt-6 bg-mushroom-light/30 border border-mushroom-primary/20 p-4 rounded-md">
              <p className="text-sm text-center">
                Click the "Analyze Image" button to identify the mushroom.
              </p>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default IdentifyPage;
