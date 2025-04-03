
import React from 'react';
import { useImage } from '@/context/ImageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const ImagePreview = ({ image }) => {
  const { analyzeImage, loading } = useImage();
  
  if (!image) return null;

  const handleAnalyze = async () => {
    await analyzeImage(image._id);
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="aspect-square w-full overflow-hidden">
          <img
            src={image.url}
            alt="Mushroom"
            className="h-full w-full object-cover"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between gap-2 p-4">
        <div className="text-sm">
          <p className="font-medium">{image.fileName}</p>
          <p className="text-muted-foreground">
            {new Date(image.uploadDate).toLocaleString()}
          </p>
        </div>
        <Button 
          onClick={handleAnalyze} 
          disabled={loading || image.analyzed}
          className="bg-mushroom-primary hover:bg-mushroom-dark"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : image.analyzed ? (
            'Analyzed'
          ) : (
            'Analyze Image'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ImagePreview;
