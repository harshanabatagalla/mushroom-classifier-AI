
import React, { useEffect, useState } from 'react';
import { useFeedback } from '@/context/FeedbackContext';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { MessageCircle, Check, X, Loader2 } from 'lucide-react';

const FeedbackList = ({ userId, isAdmin = false }) => {
  const { getAllFeedback, getUserFeedback, updateFeedbackStatus, fetchFeedback, loading } = useFeedback();
  const [feedbackList, setFeedbackList] = useState([]);
  const [loadingFeedback, setLoadingFeedback] = useState(true);
  const { currentUser } = useAuth();
  
  useEffect(() => {
    const loadFeedback = async () => {
      setLoadingFeedback(true);
      await fetchFeedback();
      
      let fbList;
      if (isAdmin) {
        fbList = getAllFeedback();
      } else {
        fbList = await getUserFeedback(userId);
      }
      setFeedbackList(fbList);
      setLoadingFeedback(false);
    };
    
    if (currentUser) {
      loadFeedback();
    }
  }, [currentUser, userId, isAdmin]);

  if (loadingFeedback) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-mushroom-primary" />
      </div>
    );
  }

  if (feedbackList.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <MessageCircle className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-3 text-lg font-semibold">No feedback yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {isAdmin ? "When users submit feedback, it will appear here." : "After you submit feedback, it will appear here."}
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleUpdateStatus = async (feedbackId, newStatus) => {
    await updateFeedbackStatus(feedbackId, newStatus);
  };

  return (
    <div className="space-y-4">
      {feedbackList.map((feedback) => (
        <Card key={feedback._id}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base">
                  {feedback.user.name || feedback.userName || 'Anonymous'}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {new Date(feedback.date).toLocaleString()}
                </p>
              </div>
              <Badge 
                className={
                  feedback.status === 'approved' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                  feedback.status === 'rejected' ? 'bg-red-100 text-red-800 hover:bg-red-200' :
                  'bg-amber-100 text-amber-800 hover:bg-amber-200'
                }
              >
                {feedback.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{feedback.text}</p>
            
            {isAdmin && feedback.status === 'pending' && (
              <div className="mt-4 flex items-center gap-2">
                <Button 
                  size="sm" 
                  onClick={() => handleUpdateStatus(feedback._id, 'approved')}
                  disabled={loading}
                  className="h-8 bg-green-600 hover:bg-green-700 text-white"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Check className="mr-1 h-4 w-4" />
                      Approve
                    </>
                  )}
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => handleUpdateStatus(feedback._id, 'rejected')}
                  disabled={loading}
                  className="h-8 bg-red-600 hover:bg-red-700 text-white"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <X className="mr-1 h-4 w-4" />
                      Reject
                    </>
                  )}
                </Button>
              </div>
            )}
            
            <Separator className="my-4" />
            <p className="text-xs text-muted-foreground">
              Feedback ID: {feedback._id}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FeedbackList;
