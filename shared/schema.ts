import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const teachers = pgTable("teachers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  subject: text("subject").notNull(),
  imageUrl: text("image_url").notNull(),
  description: text("description").notNull(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  teacherId: integer("teacher_id").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  approved: boolean("approved").default(false),
});

export const insertTeacherSchema = createInsertSchema(teachers).pick({
  name: true,
  subject: true,
  imageUrl: true,
  description: true,
});

export const insertReviewSchema = createInsertSchema(reviews).pick({
  teacherId: true,
  rating: true,
  comment: true,
});

export type InsertTeacher = z.infer<typeof insertTeacherSchema>;
export type Teacher = typeof teachers.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;
