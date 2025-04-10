
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, MessageSquare } from "lucide-react";
import { useAI } from "@/context/AIContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Review } from "@/context/EventContext";

interface ReviewListProps {
  eventId: string;
  reviews: Review[];
}

const ReviewList: React.FC<ReviewListProps> = ({ eventId, reviews }) => {
  const { generateReviewSummary, reviewSummaries, isProcessing } = useAI();
  const [showSummary, setShowSummary] = useState(false);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateSummary = async () => {
    setIsSummaryLoading(true);
    setError(null);
    try {
      await generateReviewSummary(eventId, reviews);
      setShowSummary(true);
    } catch (err) {
      setError("Unable to generate summary. Please try again later.");
    } finally {
      setIsSummaryLoading(false);
    }
  };

  const reviewSummary = reviewSummaries[eventId];

  if (reviews.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
          <CardDescription>No reviews yet for this event</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Be the first to share your experience!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Reviews & Feedback</CardTitle>
            <CardDescription>{reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</CardDescription>
          </div>
          
          <Button
            variant="outline"
            onClick={handleGenerateSummary}
            disabled={isProcessing || isSummaryLoading || reviews.length === 0}
            className="flex items-center gap-1"
          >
            <MessageSquare className="h-4 w-4" />
            <span>AI Summary</span>
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {showSummary && reviewSummary && (
          <div className="mb-6 p-4 bg-muted rounded-md animate-fade-in">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-sm">AI-Generated Summary</h3>
              <div className={`px-2 py-0.5 text-xs rounded-full ${
                reviewSummary.sentiment === "positive" 
                  ? "bg-green-100 text-green-700"
                  : reviewSummary.sentiment === "negative"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}>
                {reviewSummary.averageRating} / 5
              </div>
            </div>
            <p className="text-sm">{reviewSummary.summary}</p>
          </div>
        )}
        
        {isSummaryLoading && (
          <div className="mb-6 p-4 bg-muted rounded-md space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        )}
        
        <div className="divide-y">
          {reviews.map((review) => (
            <div key={review.id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs bg-secondary">
                      {review.userName.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{review.userName}</span>
                </div>
                <div className="flex items-center">
                  <div className="flex mr-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {review.date}
                  </span>
                </div>
              </div>
              <p className="text-sm mt-2">{review.comment}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewList;
