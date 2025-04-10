
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useEvents } from "@/context/EventContext";
import { Star } from "lucide-react";

interface ReviewFormProps {
  eventId: string;
  onReviewSubmitted?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ eventId, onReviewSubmitted }) => {
  const { user } = useAuth();
  const { addReview } = useEvents();
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    addReview({
      eventId,
      userId: user.id,
      userName: user.name,
      rating,
      comment
    });
    
    // Reset form
    setRating(0);
    setComment("");
    
    if (onReviewSubmitted) {
      onReviewSubmitted();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
        <CardDescription>Share your experience with others</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Rating</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(null)}
                  className="focus:outline-none"
                >
                  <Star 
                    className={`h-6 w-6 ${
                      (hoveredRating !== null ? star <= hoveredRating : star <= rating)
                        ? "fill-yellow-400 text-yellow-400" 
                        : "text-muted"
                    } transition-colors`} 
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Your Comments</p>
            <Textarea
              placeholder="Share your thoughts about this event..."
              className="min-h-[100px]"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            disabled={rating === 0 || !comment.trim()}
          >
            Submit Review
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ReviewForm;
