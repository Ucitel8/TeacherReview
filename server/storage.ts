import {
  type Teacher,
  type InsertTeacher,
  type Review,
  type InsertReview,
} from "@shared/schema";

export interface IStorage {
  // Teacher operations
  getTeachers(): Promise<Teacher[]>;
  getTeacher(id: number): Promise<Teacher | undefined>;
  createTeacher(teacher: InsertTeacher): Promise<Teacher>;
  updateTeacher(id: number, teacher: InsertTeacher): Promise<Teacher>;

  // Review operations
  getReviewsForTeacher(teacherId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  approveReview(id: number): Promise<Review>;
  getPendingReviews(): Promise<Review[]>;
}

export class MemStorage implements IStorage {
  private teachers: Map<number, Teacher>;
  private reviews: Map<number, Review>;
  private teacherId: number;
  private reviewId: number;

  constructor() {
    this.teachers = new Map();
    this.reviews = new Map();
    this.teacherId = 1;
    this.reviewId = 1;

    // Seed with initial teachers
    const teacherData = [
      {
        name: "Jaromír Mazal",
        subject: "odborné předměty elektro",
        imageUrl: "https://www.spszl.cz/wp-content/uploads/2020/08/MJ.jpg",
        description: "Konzultace: Čtvrtek 8. vyučovací hodina",
      },
      {
        name: "Prof. Michael Chen",
        subject: "Physics",
        imageUrl:
          "https://images.unsplash.com/photo-1580894732444-8ecded7900cd",
        description:
          "Specializes in theoretical physics with 15 years of teaching experience.",
      },
      {
        name: "Ms. Emily Parker",
        subject: "English Literature",
        imageUrl:
          "https://images.unsplash.com/photo-1485217988980-11786ced9454",
        description:
          "Dedicated to fostering creativity and critical thinking through literature.",
      },
      {
        name: "Mr. David Wilson",
        subject: "History",
        imageUrl:
          "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
        description:
          "Makes history come alive through engaging storytelling and discussions.",
      },
    ];

    teacherData.forEach((teacher) => this.createTeacher(teacher));
  }

  async getTeachers(): Promise<Teacher[]> {
    return Array.from(this.teachers.values());
  }

  async getTeacher(id: number): Promise<Teacher | undefined> {
    return this.teachers.get(id);
  }

  async createTeacher(teacher: InsertTeacher): Promise<Teacher> {
    const id = this.teacherId++;
    const newTeacher = { ...teacher, id };
    this.teachers.set(id, newTeacher);
    return newTeacher;
  }

  async updateTeacher(id: number, teacher: InsertTeacher): Promise<Teacher> {
    const existingTeacher = this.teachers.get(id);
    if (!existingTeacher) {
      throw new Error("Teacher not found");
    }

    const updatedTeacher = { ...teacher, id };
    this.teachers.set(id, updatedTeacher);
    return updatedTeacher;
  }

  async getReviewsForTeacher(teacherId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      (review) => review.teacherId === teacherId && review.approved,
    );
  }

  async createReview(review: InsertReview): Promise<Review> {
    const id = this.reviewId++;
    const newReview = { ...review, id, approved: false };
    this.reviews.set(id, newReview);
    return newReview;
  }

  async approveReview(id: number): Promise<Review> {
    const review = this.reviews.get(id);
    if (!review) throw new Error("Review not found");

    const updatedReview = { ...review, approved: true };
    this.reviews.set(id, updatedReview);
    return updatedReview;
  }

  async getPendingReviews(): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      (review) => !review.approved,
    );
  }
}

export const storage = new MemStorage();
