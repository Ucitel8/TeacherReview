import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertReviewSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all teachers
  app.get("/api/teachers", async (_req, res) => {
    const teachers = await storage.getTeachers();
    res.json(teachers);
  });

  // Get specific teacher
  app.get("/api/teachers/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid teacher ID" });
    }

    const teacher = await storage.getTeacher(id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.json(teacher);
  });

  // Get reviews for a teacher
  app.get("/api/teachers/:id/reviews", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid teacher ID" });
    }

    const reviews = await storage.getReviewsForTeacher(id);
    res.json(reviews);
  });

  // Submit a review
  app.post("/api/reviews", async (req, res) => {
    try {
      const review = insertReviewSchema.parse(req.body);
      const newReview = await storage.createReview(review);
      res.status(201).json(newReview);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid review data" });
      }
      throw error;
    }
  });

  // Get pending reviews (admin)
  app.get("/api/admin/reviews/pending", async (_req, res) => {
    const reviews = await storage.getPendingReviews();
    res.json(reviews);
  });

  // Approve a review (admin)
  app.post("/api/admin/reviews/:id/approve", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid review ID" });
    }

    try {
      const review = await storage.approveReview(id);
      res.json(review);
    } catch (error) {
      return res.status(404).json({ message: "Review not found" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
