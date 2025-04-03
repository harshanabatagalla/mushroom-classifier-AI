
import React, { useState } from 'react';
import { useFeedback } from '@/context/FeedbackContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const FeedbackForm = ({ imageId }) => {
  const [text, setText] = useState('');
  const { submitFeedback, loading } = useFeedback();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    const result = await submitFeedback(imageId, text);
    if (result.success) {
      setText('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Leave Feedback</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="space-y-2">
            <Textarea
              placeholder="Share your feedback about this identification..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[100px]"
              required
            />
            <p className="text-xs text-muted-foreground">
              Your feedback helps improve our AI model and assists other foragers.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            disabled={loading || !text.trim()} 
            className="bg-mushroom-primary hover:bg-mushroom-dark"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Feedback'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default FeedbackForm;
