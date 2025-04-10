import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import { useAuth } from '@/context/AuthContext';
import { useImage } from '@/context/ImageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import FeedbackList from '@/components/Feedback/FeedbackList';
import { FileImage, Loader2, AlertTriangle, CheckCircle2, HelpCircle, Info } from 'lucide-react';
import { toast } from 'sonner';
import ClassificationResult from '../components/Identification/ClassificationResult';

function MyCollectionPage() {
    const { currentUser } = useAuth();
    const { fetchUserImages, getUserImages, analyzeImage } = useImage();
    const [userImages, setUserImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [analyzingId, setAnalyzingId] = useState(null);
  
    useEffect(() => {
      const loadUserData = async () => {
        if (currentUser) {
          setLoading(true);
          await fetchUserImages();
          const images = await getUserImages(currentUser.id);
          setUserImages(images);
          setLoading(false);
          setProfileData({
            name: currentUser.name,
            email: currentUser.email
          });
        }
      };
  
      loadUserData();
    }, [currentUser]);
  
    // Handle analysis request
    const handleAnalyzeImage = async (imageId) => {
      try {
        setAnalyzingId(imageId);
        const response = await analyzeImage(imageId);
        // Update the image in the userImages list
        setUserImages(userImages.map(img =>
          img._id === imageId ? { ...img, analyzed: true, classification: response.classification } : img
        ));
  
        if (selectedImage && selectedImage._id === imageId) {
          setSelectedImage({ ...selectedImage, analyzed: true, classification: response.classification });
        }
  
        toast({
          title: "Analysis Complete",
          description: "Your mushroom image has been successfully analyzed.",
          variant: "success"
        });
      } catch (error) {
        toast({
          title: "Analysis Failed",
          description: "There was an error analyzing your image. Please try again.",
          variant: "destructive"
        });
        console.error("Error analyzing image:", error);
      } finally {
        setAnalyzingId(null);
      }
    };
  
    // Open modal with selected image details
    const openImageModal = (image) => {
      setSelectedImage(image);
      setIsModalOpen(true);
    };
  
    const getClassificationBadge = (classification) => {
      if (!classification) return null;
  
      const classType = classification.toLowerCase();
  
      if (classType.includes('edible')) {
        return <Badge className="bg-green-500 hover:bg-green-600">Edible</Badge>;
      } else if (classType.includes('poisonous')) {
        return <Badge className="bg-red-500 hover:bg-red-600">Poisonous</Badge>;
      } else if (classType === 'unknown') {
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Unknown</Badge>;
      } else if (classType === 'not_a_mushroom') {
        return <Badge className="bg-gray-500 hover:bg-gray-600">Not a Mushroom</Badge>;
      }
  
      return <Badge>{classification}</Badge>;
    };
  
    // Functions for the modal styling similar to ClassificationResult
    const getAlertStyles = (classification) => {
      if (!classification) return "border-gray-500 bg-gray-50";
  
      const classType = classification.toLowerCase();
  
      if (classType.includes('edible')) return "border-green-500 bg-green-50";
      if (classType.includes('poisonous')) return "border-red-500 bg-red-50";
      if (classType === 'not_a_mushroom') return "border-gray-500 bg-gray-50";
      return "border-yellow-500 bg-yellow-50"; // For unknown
    };
  
    const getAlertIcon = (classification) => {
      if (!classification) return <HelpCircle className="h-5 w-5 text-gray-600" />;
  
      const classType = classification.toLowerCase();
  
      if (classType.includes('edible')) return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      if (classType.includes('poisonous')) return <AlertTriangle className="h-5 w-5 text-red-600" />;
      if (classType === 'not_a_mushroom') return <HelpCircle className="h-5 w-5 text-gray-600" />;
      return <Info className="h-5 w-5 text-yellow-600" />; // For unknown
    };
  
    const getProgressStyles = (classification) => {
      if (!classification) return "text-gray-500 bg-gray-100 h-2";
  
      const classType = classification.toLowerCase();
  
      if (classType.includes('edible')) return "text-green-500 bg-green-100 h-2";
      if (classType.includes('poisonous')) return "text-red-500 bg-red-100 h-2";
      if (classType === 'not_a_mushroom') return "text-gray-500 bg-gray-100 h-2";
      return "text-yellow-500 bg-yellow-100 h-2"; // For unknown
    };
  
    const getClassificationColor = (classification) => {
      if (!classification) return "text-gray-600";
  
      const classType = classification.toLowerCase();
  
      if (classType.includes('edible')) return "text-green-600";
      if (classType.includes('poisonous')) return "text-red-600";
      if (classType === 'not_a_mushroom') return "text-gray-600";
      return "text-yellow-600"; // For unknown
    };
  
    const truncateFileName = (fileName, maxLength = 20) => {
      if (!fileName) return '';
      if (fileName.length <= maxLength) return fileName;
      return fileName.substring(0, maxLength) + '...';
    };
  
    if (!currentUser) {
      return <Navigate to="/login" replace />;
    }
  
    return (
      <MainLayout>
        <section className="container py-8 md:py-12">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-1">My Collection</h1>
                <p className="text-sm md:text-base text-muted-foreground">
                Review all your mushroom identifications and submitted feedback.
                </p>
              </div>
            </div>
            <Tabs defaultValue="identifications">
              <TabsList className="mb-4">
                <TabsTrigger value="identifications">My Identifications</TabsTrigger>
                <TabsTrigger value="feedback">My Feedback</TabsTrigger>
              </TabsList>
  
              <TabsContent value="identifications" className="space-y-4">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userImages.map((image) => (
                      <Card
                        key={image._id}
                        className="cursor-pointer hover:shadow-lg transition-shadow flex flex-col pb-4 border-mushroom-primary border-opacity-30 "
                        onClick={() => openImageModal(image)}
                      >
                        <div className="relative pb-10">
                          <img
                            src={image.url}
                            alt={`Mushroom ${image._id}`}
                            className="object-cover w-full h-full max-h-52"
                          />
                          {image.analyzed ? (
                            <div className="absolute top-2 right-2 flex gap-2">
                              {getClassificationBadge(image.classification?.classification)}
                            </div>
                          ) : (
                            <div className="absolute  top-2 right-2">
                              <Badge variant="outline" className="bg-white">Not Analyzed</Badge>
                            </div>
                          )}
                        </div>
                        <CardContent className="p-3 flex-grow">
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <p className="font-medium text-sm truncate" title={image.fileName}>
                                {truncateFileName(image.fileName)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(image.uploadDate).toLocaleDateString()}
                              </p>
                            </div>
                            {getAlertIcon(image.classification?.classification)}
                          </div>
  
                          {image.analyzed ? (
                            <div className="mt-2">
                              {image.classification?.confidence && (
                                <div className="space-y-1">
                                  <div className="flex justify-between text-xs">
                                    <span>Confidence</span>
                                    <span className={getClassificationColor(image.classification.classification)}>
                                      {Math.round(image.classification.confidence * 100)}%
                                    </span>
                                  </div>
                                  <Progress
                                    value={image.classification.confidence * 100}
                                    className={getProgressStyles(image.classification?.classification)}
                                  />
                                </div>
                              )}
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              className="w-full mt-2 bg-mushroom-primary hover:bg-mushroom-dark"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAnalyzeImage(image._id);
                              }}
                              disabled={analyzingId === image._id}
                            >
                              {analyzingId === image._id ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Analyzing...
                                </>
                              ) : (
                                'Analyze Now'
                              )}
                            </Button>
                          )}
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
  
            {/* Image Details Modal - Styled like ClassificationResult */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                {selectedImage && (
                  <>
                    <DialogHeader>
                      <DialogTitle>Mushroom Details</DialogTitle>
                    </DialogHeader>
  
                    <div className="space-y-4">
                      <div className="aspect-video relative bg-muted rounded-md overflow-hidden">
                        <img
                          src={selectedImage.url}
                          alt="Mushroom identification"
                          className="object-contain w-full h-full"
                        />
                      </div>
                      {selectedImage.analyzed && selectedImage.classification ? (
                        <ClassificationResult result={selectedImage.classification} image={selectedImage} />
                      ) : (
                        <div className="text-center py-4">
                          <AlertTriangle className="h-12 w-12 mx-auto text-yellow-500 mb-2" />
                          <h3 className="font-semibold text-lg">Not Yet Analyzed</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            This image hasn't been analyzed yet. Would you like to analyze it now?
                          </p>
                          <Button
                            className="w-full bg-mushroom-primary hover:bg-mushroom-dark"
                            onClick={() => handleAnalyzeImage(selectedImage._id)}
                            disabled={analyzingId === selectedImage._id}
                          >
                            {analyzingId === selectedImage._id ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Analyzing...
                              </>
                            ) : (
                              'Analyze Now'
                            )}
                          </Button>
                        </div>)
                      }
                    </div>
                  </>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </section>
      </MainLayout>
    );
  };
  
export default MyCollectionPage;
