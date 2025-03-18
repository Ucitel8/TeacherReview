import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { type Teacher, type Review } from "@shared/schema";
import { ReviewForm } from "@/components/ReviewForm";
import { Reviews } from "@/components/Reviews";
import { StarRating } from "@/components/StarRating";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TeacherPage() {
  const [, params] = useRoute("/teacher/:id");
  const teacherId = parseInt(params?.id || "");

  const { data: teacher } = useQuery<Teacher>({
    queryKey: [`/api/teachers/${teacherId}`],
  });

  const { data: reviews } = useQuery<Review[]>({
    queryKey: [`/api/teachers/${teacherId}/reviews`],
  });

  if (!teacher) return null;

  const avgRating =
    reviews?.length
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={teacher.imageUrl} alt={teacher.name} />
              <AvatarFallback>{teacher.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{teacher.name}</h1>
              <p className="text-lg text-muted-foreground">{teacher.subject}</p>
              {reviews?.length ? (
                <div className="flex items-center gap-2 mt-2">
                  <StarRating rating={Math.round(avgRating)} />
                  <span className="text-muted-foreground">
                    ({reviews.length} reviews)
                  </span>
                </div>
              ) : null}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{teacher.description}</p>
          </CardContent>
        </Card>

        <Tabs defaultValue="reviews" className="mt-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="write">Write a Review</TabsTrigger>
          </TabsList>
          <TabsContent value="reviews" className="mt-4">
            <Reviews reviews={reviews || []} />
          </TabsContent>
          <TabsContent value="write" className="mt-4">
            <ReviewForm teacherId={teacherId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
