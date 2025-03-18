import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type Review, type Teacher } from "@shared/schema";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/StarRating";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useIsAdmin } from "@/lib/auth";

export default function Admin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const isAdmin = useIsAdmin();

  // Redirect to login if not authenticated
  if (!isAdmin) {
    setLocation("/login");
    return null;
  }

  const queryClient = useQueryClient();

  const { data: pendingReviews } = useQuery<Review[]>({
    queryKey: ["/api/admin/reviews/pending"],
  });

  const { data: teachers } = useQuery<Teacher[]>({
    queryKey: ["/api/teachers"],
  });

  const approveMutation = useMutation({
    mutationFn: async (reviewId: number) => {
      await apiRequest("POST", `/api/admin/reviews/${reviewId}/approve`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reviews/pending"] });
      toast({
        title: "Review approved",
        description: "The review is now visible to users.",
      });
    },
  });

  if (!pendingReviews || !teachers) return null;

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Review Moderation</h1>
        <div className="space-y-4">
          {pendingReviews.map((review) => {
            const teacher = teachers.find((t) => t.id === review.teacherId);
            if (!teacher) return null;

            return (
              <Card key={review.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{teacher.name}</h3>
                      <StarRating rating={review.rating} className="mt-1" />
                    </div>
                    <Button
                      onClick={() => approveMutation.mutate(review.id)}
                      disabled={approveMutation.isPending}
                    >
                      Approve
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                </CardContent>
              </Card>
            );
          })}

          {pendingReviews.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No pending reviews to moderate.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}