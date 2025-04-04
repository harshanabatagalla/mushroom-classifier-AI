import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MessageSquare, Image, AlertCircle } from 'lucide-react';

const ProfileActivity = ({ imageCount = 0, feedbackCount = 0 }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Activity</CardTitle>
        <CardDescription>
          Summary of your mushroom identification activity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-4 bg-mushroom-light p-2 rounded-full">
                <Image size={20} className="text-mushroom-primary" />
              </div>
              <div>
                <p className="font-medium">Identified Mushrooms</p>
                <p className="text-sm text-muted-foreground">
                  You have uploaded {imageCount} mushroom images for identification
                </p>
              </div>
            </div>
            <span className="text-2xl font-bold">{imageCount}</span>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-4 bg-mushroom-light p-2 rounded-full">
                <MessageSquare size={20} className="text-mushroom-primary" />
              </div>
              <div>
                <p className="font-medium">Feedback Submitted</p>
                <p className="text-sm text-muted-foreground">
                  You have provided feedback {feedbackCount} times
                </p>
              </div>
            </div>
            <span className="text-2xl font-bold">{feedbackCount}</span>
          </div>
          
          <Separator />
          
          <div className="flex items-center">
            <div className="mr-4 bg-mushroom-light p-2 rounded-full">
              <AlertCircle size={20} className="text-mushroom-primary" />
            </div>
            <div>
              <p className="font-medium">Safety Score</p>
              <p className="text-sm text-muted-foreground">
                You're helping to make mushroom foraging safer
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant="outline" asChild>
          <Link to="/my-identifications">View Your Identifications & Feedback</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileActivity;