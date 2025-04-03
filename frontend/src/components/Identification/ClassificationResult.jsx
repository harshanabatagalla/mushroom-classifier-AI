
import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useFeedback } from '@/context/FeedbackContext';
import FeedbackForm from '../Feedback/FeedbackForm';

const ClassificationResult = ({ result, image }) => {
  const [showFeedback, setShowFeedback] = React.useState(false);
  
  if (!result || !image) return null;
  
  const isEdible = result.classification === 'edible';
  const confidencePercentage = Math.round(result.confidence * 100);
  
  return (
    <div className="space-y-4">
      <Alert className={isEdible ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}>
        <div className="flex items-center gap-2">
          {isEdible ? (
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600" />
          )}
          <AlertTitle className={isEdible ? "text-green-700" : "text-red-700"}>
            {isEdible ? "Likely Edible" : "Likely Poisonous"}
          </AlertTitle>
        </div>
        <AlertDescription className="mt-2 text-muted-foreground">
          {result.details}
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Identification Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Confidence Level</span>
              <span className="text-sm font-medium">{confidencePercentage}%</span>
            </div>
            <Progress value={confidencePercentage} className={
              isEdible 
                ? "text-green-500 bg-green-100" 
                : "text-red-500 bg-red-100"
            } />
          </div>
          
          <div className="rounded-md border p-4">
            <div className="grid gap-3">
              <div className="grid grid-cols-2 gap-1">
                <span className="text-sm font-medium">Classification:</span>
                <span className={`text-sm ${isEdible ? 'text-green-600' : 'text-red-600'}`}>
                  {isEdible ? 'Edible' : 'Poisonous'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <span className="text-sm font-medium">Analysis Date:</span>
                <span className="text-sm">{new Date(result.date).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Important Disclaimer</h4>
            <p className="text-sm text-muted-foreground">
              This AI classification is for informational purposes only. Never consume wild mushrooms based solely 
              on this identification. Always consult with a professional mycologist or expert before consuming any 
              wild mushroom.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => window.print()}>
            Save Results
          </Button>
          <Button onClick={() => setShowFeedback(!showFeedback)}>
            {showFeedback ? 'Hide Feedback' : 'Leave Feedback'}
          </Button>
        </CardFooter>
      </Card>
      
      {showFeedback && <FeedbackForm imageId={image._id} />}
    </div>
  );
};

export default ClassificationResult;
