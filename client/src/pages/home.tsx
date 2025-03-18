import { useQuery } from "@tanstack/react-query";
import { TeacherCard } from "@/components/TeacherCard";
import { type Teacher } from "@shared/schema";

export default function Home() {
  const { data: teachers, isLoading } = useQuery<Teacher[]>({
    queryKey: ["/api/teachers"],
  });

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-cyan-600 text-transparent bg-clip-text">
          Teacher Reviews
        </h1>
        <div className="space-y-4">
          {teachers?.map((teacher) => (
            <TeacherCard key={teacher.id} teacher={teacher} />
          ))}
        </div>
      </div>
    </div>
  );
}
