import React from 'react';
import { AlertCircle, CheckCircle2, HelpCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import FeedbackForm from '../Feedback/FeedbackForm';

const ClassificationResult = ({ result, image }) => {
  const [showFeedback, setShowFeedback] = React.useState(false);
  
  if (!result || !image) return null;
  
  const isEdible = result.classification === 'edible';
  const isPoisonous = result.classification === 'poisonous';
  const isDeadly = result.classification === 'deadly';
  const isConditionallyEdible = result.classification === 'conditionally_edible';
  const isNotMushroom = result.classification === 'not_a_mushroom';
  const confidencePercentage = Math.round(result.confidence * 100);
  
  // Determine alert styling based on classification
  const getAlertStyles = () => {
    if (isEdible) return "border-green-500 bg-green-50";
    if (isPoisonous || isDeadly) return "border-red-500 bg-red-50";
    if (isConditionallyEdible) return "border-amber-500 bg-amber-50";
    if (isNotMushroom) return "border-blue-500 bg-blue-50";
    return "border-gray-500 bg-gray-50"; // For unknown
  };
  
  // Determine alert icon based on classification
  const AlertIcon = () => {
    if (isEdible) return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    if (isPoisonous || isDeadly) return <AlertCircle className="h-5 w-5 text-red-600" />;
    if (isConditionallyEdible) return <AlertTriangle className="h-5 w-5 text-amber-600" />;
    if (isNotMushroom) return <HelpCircle className="h-5 w-5 text-blue-600" />;
    return <HelpCircle className="h-5 w-5 text-gray-600" />; // For unknown
  };
  
  // Determine alert title based on classification
  const getAlertTitle = () => {
    if (isEdible) return "Likely Edible";
    if (isPoisonous) return "Likely Poisonous";
    if (isDeadly) return "Likely Deadly";
    if (isConditionallyEdible) return "Conditionally Edible";
    if (isNotMushroom) return "Not a Mushroom";
    return "Unknown";
  };
  
  // Determine alert title color based on classification
  const getAlertTitleColor = () => {
    if (isEdible) return "text-green-700";
    if (isPoisonous || isDeadly) return "text-red-700";
    if (isConditionallyEdible) return "text-amber-700";
    if (isNotMushroom) return "text-blue-700";
    return "text-gray-700"; // For unknown
  };
  
  // Determine progress bar styling
  const getProgressStyles = () => {
    if (isEdible) return "text-green-500 bg-green-100";
    if (isPoisonous || isDeadly) return "text-red-500 bg-red-100";
    if (isConditionallyEdible) return "text-amber-500 bg-amber-100";
    if (isNotMushroom) return "text-blue-500 bg-blue-100";
    return "text-gray-500 bg-gray-100"; // For unknown
  };
  
  // Determine classification text color
  const getClassificationColor = () => {
    if (isEdible) return "text-green-600";
    if (isPoisonous || isDeadly) return "text-red-600";
    if (isConditionallyEdible) return "text-amber-600";
    if (isNotMushroom) return "text-blue-600";
    return "text-gray-600"; // For unknown
  };
  
  return (
    <div className="space-y-4">
      <Alert className={getAlertStyles()}>
        <div className="flex items-center gap-2">
          <AlertIcon />
          <AlertTitle className={getAlertTitleColor()}>
            {getAlertTitle()}
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
            <Progress value={confidencePercentage} className={getProgressStyles()} />
          </div>
          
          <div className="rounded-md border p-4">
            <div className="grid gap-3">
              <div className="grid grid-cols-2 gap-1">
                <span className="text-sm font-medium">Classification:</span>
                <span className={`text-sm ${getClassificationColor()}`}>
                  {result.classification}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <span className="text-sm font-medium">Analysis Date:</span>
                <span className="text-sm">{new Date(result.date).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          {isConditionallyEdible && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Special Preparation Required</h4>
              <p className="text-sm text-muted-foreground">
                This mushroom may be edible only after specific preparation methods or under certain conditions. 
                Improper preparation could lead to illness. Always consult expert resources about proper preparation 
                techniques for this species.
              </p>
            </div>
          )}
          
          {!isNotMushroom && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Important Disclaimer</h4>
              <p className="text-sm text-muted-foreground">
                This AI classification is for informational purposes only. Never consume wild mushrooms based solely 
                on this identification. Always consult with a professional mycologist or expert before consuming any 
                wild mushroom.
              </p>
            </div>
          )}
          
          {isNotMushroom && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Suggestion</h4>
              <p className="text-sm text-muted-foreground">
                The image provided does not appear to contain a mushroom, or the mushroom is not clearly visible. 
                Please try uploading a clearer image where the mushroom is the main subject.
              </p>
            </div>
          )}
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