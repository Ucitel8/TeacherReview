import { type Teacher } from "@shared/schema";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { StarRating } from "./StarRating";
import { Link } from "wouter";

interface TeacherCardProps {
  teacher: Teacher;
}

export function TeacherCard({ teacher }: TeacherCardProps) {
  const { data: reviews } = useQuery({
    queryKey: [`/api/teachers/${teacher.id}/reviews`],
  });

  const avgRating = reviews?.length
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : 0;

  return (
    <Link href={`/teacher/${teacher.id}`}>
      <Card className="cursor-pointer hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={teacher.imageUrl} alt={teacher.name} />
            <AvatarFallback>{teacher.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold">{teacher.name}</h3>
            <p className="text-sm text-muted-foreground">{teacher.subject}</p>
            {reviews?.length > 0 && (
              <div className="flex items-center gap-2 mt-1">
                <StarRating rating={Math.round(avgRating)} size={16} />
                <span className="text-sm text-muted-foreground">
                  ({reviews.length} reviews)
                </span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{teacher.description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
