
import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Leaf, AlertCircle, Book, HeartHandshake } from 'lucide-react';

const AboutPage = () => {
  return (
    <MainLayout>
      <section className="container py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <Leaf size={32} className="text-mushroom-primary mr-3" />
            <h1 className="text-3xl md:text-4xl font-bold">About Mushroom SafeGuard</h1>
          </div>
          
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-center text-muted-foreground mb-8">
              Our mission is to make mushroom foraging safer by providing accessible, 
              AI-powered identification tools to help prevent poisoning incidents.
            </p>
            
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Book className="h-6 w-6 text-mushroom-primary mr-2" />
                  <h2 className="text-2xl font-semibold">Our Story</h2>
                </div>
                <p className="mb-4">
                  Mushroom SafeGuard was born from a passion for both technology and mycology.
                  Our founder, an avid mushroom forager, recognized the need for a reliable, 
                  accessible tool to help identify potentially dangerous mushrooms in the wild.
                </p>
                <p>
                  By combining cutting-edge AI technology with expert mycological knowledge, we've 
                  created a platform that can help both beginners and experienced foragers make more 
                  informed decisions about the mushrooms they encounter.
                </p>
              </CardContent>
            </Card>
            
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <HeartHandshake className="h-6 w-6 text-mushroom-primary mr-2" />
                  <h2 className="text-2xl font-semibold">How Our AI Works</h2>
                </div>
                <p className="mb-4">
                  Our artificial intelligence model has been trained on thousands of verified mushroom 
                  images across hundreds of species, with special emphasis on distinguishing between edible 
                  mushrooms and their poisonous look-alikes.
                </p>
                <p className="mb-4">
                  When you upload a photo, our AI analyzes visual characteristics like cap shape, gill structure, 
                  stem features, color patterns, and other identifying markers. It then provides a classification 
                  along with a confidence score to help you understand how certain the identification is.
                </p>
                <p>
                  We continually improve our model by incorporating user feedback and new verified images, 
                  making our identification system more accurate over time.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <AlertCircle className="h-6 w-6 text-mushroom-primary mr-2" />
                  <h2 className="text-2xl font-semibold">Important Safety Disclaimer</h2>
                </div>
                <div className="bg-mushroom-light/50 border border-mushroom-primary/20 rounded-lg p-4 mb-4">
                  <p className="font-medium">
                    Never rely solely on this application to determine if a mushroom is safe to consume.
                  </p>
                </div>
                <p className="mb-4">
                  While our AI strives for accuracy, it cannot replace expert knowledge. Many mushroom species are 
                  difficult to distinguish even for experienced mycologists, and some poisonous mushrooms can cause 
                  severe illness or death if consumed.
                </p>
                <p>
                  Always consult multiple identification sources, field guides, and expert opinions before consuming 
                  any wild mushroom. When in doubt, don't eat it!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default AboutPage;
