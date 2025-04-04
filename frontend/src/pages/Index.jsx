
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Search, Leaf, AlertCircle, FileText, Upload, MessageSquare, ThumbsUp } from 'lucide-react';
import api from '@/services/api';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const navigate = useNavigate();
  const [recentFeedback, setRecentFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentFeedback = async () => {
      try {
        setLoading(true);
        const response = await api.get('/feedback/recent');
        setRecentFeedback(response.data);
      } catch (error) {
        console.error('Failed to fetch recent feedback:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentFeedback();
  }, []);

  const features = [
    {
      icon: <Search className="h-6 w-6" />,
      title: 'AI Identification',
      description: 'Upload a photo of any mushroom and let our AI identify whether it\'s safe to eat or poisonous.',
    },
    {
      icon: <AlertCircle className="h-6 w-6" />,
      title: 'Safety First',
      description: 'Get instant warnings about dangerous mushrooms to keep yourself and others safe.',
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: 'Detailed Information',
      description: 'Learn about different mushroom species, their characteristics, and edibility status.',
    },
  ];

  const renderClassificationBadge = (classification) => {
    let badgeClasses = '';
    let dotClasses = '';
    let label = classification || 'Unknown';

    if (classification?.includes('edible')) {
      badgeClasses = 'bg-green-100 text-green-800';
      dotClasses = 'bg-green-500';
      label = 'Edible';
    } else if (classification?.includes('poisonous')) {
      badgeClasses = 'bg-red-100 text-red-800';
      dotClasses = 'bg-red-500';
      label = 'Poisonous';
    } else if (classification === 'not_a_mushroom') {
      badgeClasses = 'bg-gray-100 text-gray-800';
      dotClasses = 'bg-gray-500';
      label = 'Not a Mushroom';
    } else {
      badgeClasses = 'bg-yellow-100 text-yellow-800';
      dotClasses = 'bg-yellow-500';
      label = 'Unknown';
    }
    
    return (
      <span className={`text-xs px-2 py-1 rounded-full inline-flex items-center  gap-1 ${badgeClasses}`}>
        <div className={`w-2 h-2 rounded-full ${dotClasses}`}></div>
        {label}
      </span>
    );
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="mushroom-pattern">
        <div className="container px-4 py-16 md:py-24 lg:py-32">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center mb-4">
              <Leaf size={40} className="text-mushroom-primary mr-2" />
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                Mushroom SafeGuard
              </h1>
            </div>
            <p className="max-w-[700px] text-lg text-muted-foreground mb-6">
              Quickly identify whether a mushroom is edible or poisonous using our AI-powered
              image recognition technology. Stay safe while foraging!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={() => navigate('/identify')}
                className="bg-mushroom-primary hover:bg-mushroom-dark"
              >
                <Upload className="mr-2 h-5 w-5" />
                Upload & Identify
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/about')}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">How It Works</h2>
          <p className="text-muted-foreground max-w-[700px] mx-auto">
            Our AI-powered application makes mushroom identification safe and accessible to everyone.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="rounded-full bg-mushroom-light p-4 mb-4 text-mushroom-primary">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How To Use Section */}
      <section className="bg-muted py-16">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">How To Use</h2>
            <p className="text-muted-foreground max-w-[700px] mx-auto">
              Three simple steps to identify if a mushroom is edible or poisonous.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background rounded-lg p-6 shadow-sm">
              <div className="rounded-full h-12 w-12 flex items-center justify-center bg-mushroom-primary text-white font-bold text-lg mb-4">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Take a Photo</h3>
              <p className="text-muted-foreground">
                Snap a clear photo of the mushroom you want to identify.
              </p>
            </div>

            <div className="bg-background rounded-lg p-6 shadow-sm">
              <div className="rounded-full h-12 w-12 flex items-center justify-center bg-mushroom-primary text-white font-bold text-lg mb-4">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">Upload & Analyze</h3>
              <p className="text-muted-foreground">
                Upload the image to our platform for our AI to analyze.
              </p>
            </div>

            <div className="bg-background rounded-lg p-6 shadow-sm">
              <div className="rounded-full h-12 w-12 flex items-center justify-center bg-mushroom-primary text-white font-bold text-lg mb-4">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">Get Results</h3>
              <p className="text-muted-foreground">
                Receive instant results on whether the mushroom is edible or poisonous.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              onClick={() => navigate('/identify')}
              className="bg-mushroom-primary hover:bg-mushroom-dark"
            >
              Start Identifying Now
            </Button>
          </div>
        </div>
      </section>

      {/* Recent User Feedback Section */}
      <section className="container px-4 py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3 bg-clip-text text-mushroom-dark">Community Experiences</h2>
          <p className="text-muted-foreground max-w-[700px] mx-auto">
            Discover insights from fellow foragers about their mushroom identification journeys
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array(3).fill(0).map((_, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-4 mb-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ))}
          </div>
        ) : recentFeedback.length === 0 ? (
          <div className="col-span-3 text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100 max-w-md mx-auto">
            <MessageSquare className="mx-auto h-12 w-12 text-mushroom-primary mb-3" />
            <h3 className="text-xl font-medium mb-2">No feedback yet</h3>
            <p className="text-muted-foreground mb-6">
              Be the first to identify a mushroom and share your experience!
            </p>
            <Button
              onClick={() => navigate('/identify')}
              className="bg-mushroom-primary hover:bg-mushroom-dark"
            >
              Start Identifying
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentFeedback.map((item) => (
              <div key={item._id} className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="h-16 w-16 overflow-hidden border-2 border-gray-200">
                    <img
                      src={item.image?.url || "/api/placeholder/80/80"}
                      alt="Mushroom"
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = "/api/placeholder/80/80" }}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{item.user?.name || "Forager"}</h3>
                    {renderClassificationBadge(item.image?.classification?.classification)}
                  </div>
                </div>

                <div className="relative mb-4 overflow-auto">
                  <p className="text-gray-700 italic bg-gray-50 p-3 rounded-lg border-l-2 border-mushroom-primary text-sm">"{item.text}"</p>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <p className="text-xs text-muted-foreground">
                    {new Date(item.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    <span>Feedback</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Important Disclaimer */}
      <section className="container px-4 py-16">
        <div className="max-w-[800px] mx-auto">
          <div className="flex items-center justify-center mb-6">
            <AlertCircle size={28} className="text-mushroom-primary mr-2" />
            <h2 className="text-2xl font-bold">Important Safety Notice</h2>
          </div>
          <div className="bg-mushroom-light/50 border border-mushroom-primary/20 rounded-lg p-6 text-center">
            <p className="text-sm md:text-base">
              While our AI technology strives for accuracy, never rely solely on this app for mushroom consumption decisions.
              Always consult with professional mycologists or field guides to confirm any identification. Many mushrooms have
              poisonous look-alikes, and consumption of misidentified mushrooms can be fatal.
            </p>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
