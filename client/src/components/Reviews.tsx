import { type Review } from "@shared/schema";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StarRating } from "./StarRating";

interface ReviewsProps {
  reviews: Review[];
}

export function Reviews({ reviews }: ReviewsProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No reviews yet. Be the first to review!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardHeader>
            <StarRating rating={review.rating} />
          </CardHeader>
          <CardContent>
            <p className="text-sm">{review.comment}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
