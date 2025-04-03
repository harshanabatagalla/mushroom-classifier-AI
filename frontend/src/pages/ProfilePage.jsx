
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import { useAuth } from '@/context/AuthContext';
import { useImage } from '@/context/ImageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FeedbackList from '@/components/Feedback/FeedbackList';
import { User, FileImage, Loader2 } from 'lucide-react';

const ProfilePage = () => {
  const { currentUser, logout } = useAuth();
  const { fetchUserImages, getUserImages } = useImage();
  const [userImages, setUserImages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadUserData = async () => {
      if (currentUser) {
        setLoading(true);
        await fetchUserImages();
        const images = await getUserImages(currentUser.id);
        setUserImages(images);
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
      <section className="container py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-1">My Profile</h1>
              <p className="text-muted-foreground">
                Manage your account information and view past identifications.
              </p>
            </div>
            <Button variant="outline" onClick={logout}>
              Log Out
            </Button>
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">Account Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="bg-muted rounded-full p-6 md:p-8">
                  <User className="h-12 w-12 text-mushroom-primary" />
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="font-medium">Name</div>
                    <div className="text-muted-foreground">{currentUser.name}</div>
                  </div>
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-muted-foreground">{currentUser.email}</div>
                  </div>
                  <div>
                    <div className="font-medium">Account Type</div>
                    <div className="text-muted-foreground capitalize">{currentUser.role}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="identifications">
            <TabsList className="mb-6">
              <TabsTrigger value="identifications">My Identifications</TabsTrigger>
              <TabsTrigger value="feedback">My Feedback</TabsTrigger>
            </TabsList>
            
            <TabsContent value="identifications" className="space-y-6">
              {loading ? (
                <div className="flex justify-center items-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-mushroom-primary" />
                </div>
              ) : userImages.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                      <FileImage className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="mt-3 text-lg font-semibold">No images yet</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      You haven't uploaded any mushroom images for identification.
                    </p>
                    <Button 
                      className="mt-4 bg-mushroom-primary hover:bg-mushroom-dark" 
                      asChild
                    >
                      <a href="/identify">Upload an Image</a>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userImages.map((image) => (
                    <Card key={image._id} className="overflow-hidden">
                      <div className="aspect-square relative">
                        <img 
                          src={image.url}
                          alt={`Mushroom ${image._id}`}
                          className="object-cover w-full h-full"
                        />
                        {image.analyzed && (
                          <div className="absolute top-2 right-2">
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                              Analyzed
                            </span>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-3">
                        <p className="text-sm truncate">{image.fileName}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(image.uploadDate).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="feedback">
              <FeedbackList userId={currentUser.id} isAdmin={false} />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </MainLayout>
  );
};

export default ProfilePage;
