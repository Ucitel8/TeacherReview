import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertReviewSchema, insertTeacherSchema } from "@shared/schema";
import { z } from "zod";
import { requireAdmin, login } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Admin authentication
  app.post("/api/admin/login", async (req, res) => {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const isValid = await login(password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    req.session.isAdmin = true;
    res.json({ message: "Logged in successfully" });
  });

  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Logged out successfully" });
    });
  });

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

  // Update teacher (protected)
  app.patch("/api/teachers/:id", requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid teacher ID" });
    }

    try {
      const teacher = insertTeacherSchema.parse(req.body);
      const updatedTeacher = await storage.updateTeacher(id, teacher);
      res.json(updatedTeacher);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid teacher data" });
      }
      throw error;
    }
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

  // Get pending reviews (protected)
  app.get("/api/admin/reviews/pending", requireAdmin, async (_req, res) => {
    const reviews = await storage.getPendingReviews();
    res.json(reviews);
  });

  // Approve a review (protected)
  app.post("/api/admin/reviews/:id/approve", requireAdmin, async (req, res) => {
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