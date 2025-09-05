import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { authService } from "./auth";
import { requireAuth, requireAdmin } from "./middleware";
import { insertPetSchema, insertApplicationSchema, insertAdoptionSchema, loginSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const credentials = loginSchema.parse(req.body);
      const user = await authService.authenticateUser(credentials);
      
      if (!user) {
        return res.status(401).json({ 
          message: "Хэрэглэгчийн нэр эсвэл нууц үг буруу байна",
          code: "INVALID_CREDENTIALS"
        });
      }

      // Set session
      req.session.userId = user.id;
      req.session.user = {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      };

      res.json({
        message: "Амжилттай нэвтэрлээ",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Мэдээлэл буруу байна", errors: error.errors });
      }
      res.status(500).json({ message: "Нэвтрэхэд алдаа гарлаа" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Гарахад алдаа гарлаа" });
      }
      res.json({ message: "Амжилттай гарлаа" });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    if (!req.user) {
      return res.status(401).json({ 
        message: "Нэвтрэх шаардлагатай",
        code: "UNAUTHORIZED"
      });
    }
    res.json({ user: req.user });
  });

  // Public routes
  app.get("/api/pets", async (req, res) => {
    try {
      const pets = await storage.getAvailablePets();
      res.json(pets);
    } catch (error) {
      res.status(500).json({ message: "Амьтдын мэдээлэл татахад алдаа гарлаа" });
    }
  });

  app.get("/api/pets/:id", async (req, res) => {
    try {
      const pet = await storage.getPet(req.params.id);
      if (!pet) {
        return res.status(404).json({ message: "Амьтан олдсонгүй" });
      }
      res.json(pet);
    } catch (error) {
      res.status(500).json({ message: "Амьтны мэдээлэл татахад алдаа гарлаа" });
    }
  });

  app.post("/api/applications", async (req, res) => {
    try {
      const validatedData = insertApplicationSchema.parse(req.body);
      const application = await storage.createApplication(validatedData);
      res.status(201).json(application);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Мэдээлэл буруу байна", errors: error.errors });
      }
      res.status(500).json({ message: "Өргөдөл илгээхэд алдаа гарлаа" });
    }
  });

  // Protected staff routes
  app.get("/api/pets/all", requireAuth, async (req, res) => {
    try {
      const pets = await storage.getAllPets();
      res.json(pets);
    } catch (error) {
      res.status(500).json({ message: "Амьтдын мэдээлэл татахад алдаа гарлаа" });
    }
  });

  app.post("/api/pets", requireAuth, async (req, res) => {
    try {
      const validatedData = insertPetSchema.parse(req.body);
      const pet = await storage.createPet(validatedData);
      res.status(201).json(pet);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Мэдээлэл буруу байна", errors: error.errors });
      }
      res.status(500).json({ message: "Амьтан нэмэхэд алдаа гарлаа" });
    }
  });

  app.patch("/api/pets/:id", requireAuth, async (req, res) => {
    try {
      const updates = insertPetSchema.partial().parse(req.body);
      const pet = await storage.updatePet(req.params.id, updates);
      if (!pet) {
        return res.status(404).json({ message: "Амьтан олдсонгүй" });
      }
      res.json(pet);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Мэдээлэл буруу байна", errors: error.errors });
      }
      res.status(500).json({ message: "Амьтны мэдээлэл шинэчлэхэд алдаа гарлаа" });
    }
  });

  app.delete("/api/pets/:id", requireAuth, async (req, res) => {
    try {
      const success = await storage.deletePet(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Амьтан олдсонгүй" });
      }
      res.json({ message: "Амьтны мэдээлэл устгагдлаа" });
    } catch (error) {
      res.status(500).json({ message: "Амьтны мэдээлэл устгахад алдаа гарлаа" });
    }
  });

  // Application routes (staff only)
  app.get("/api/applications", requireAuth, async (req, res) => {
    try {
      const applications = await storage.getAllApplications();
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Өргөдлийн мэдээлэл татахад алдаа гарлаа" });
    }
  });

  app.get("/api/applications/:id", requireAuth, async (req, res) => {
    try {
      const application = await storage.getApplication(req.params.id);
      if (!application) {
        return res.status(404).json({ message: "Өргөдөл олдсонгүй" });
      }
      res.json(application);
    } catch (error) {
      res.status(500).json({ message: "Өргөдлийн мэдээлэл татахад алдаа гарлаа" });
    }
  });

  app.patch("/api/applications/:id/status", requireAuth, async (req, res) => {
    try {
      const { status } = req.body;
      if (!["pending", "approved", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Буруу статус" });
      }
      
      const application = await storage.updateApplicationStatus(req.params.id, status);
      if (!application) {
        return res.status(404).json({ message: "Өргөдөл олдсонгүй" });
      }
      res.json(application);
    } catch (error) {
      res.status(500).json({ message: "Өргөдлийн статус шинэчлэхэд алдаа гарлаа" });
    }
  });

  // Adoption routes (staff only)
  app.get("/api/adoptions", requireAuth, async (req, res) => {
    try {
      const adoptions = await storage.getAllAdoptions();
      res.json(adoptions);
    } catch (error) {
      res.status(500).json({ message: "Үрчлэлтийн мэдээлэл татахад алдаа гарлаа" });
    }
  });

  app.post("/api/adoptions", requireAuth, async (req, res) => {
    try {
      const validatedData = insertAdoptionSchema.parse(req.body);
      const adoption = await storage.createAdoption(validatedData);
      res.status(201).json(adoption);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Мэдээлэл буруу байна", errors: error.errors });
      }
      res.status(500).json({ message: "Үрчлэлт үүсгэхэд алдаа гарлаа" });
    }
  });

  // Statistics route (staff only)
  app.get("/api/stats", requireAuth, async (req, res) => {
    try {
      const stats = await storage.getAdoptionStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Статистик татахад алдаа гарлаа" });
    }
  });

  // Staff management routes (admin only)
  app.get("/api/staff/users", requireAdmin, async (req, res) => {
    try {
      const users = await storage.getAllStaffUsers();
      res.json(users.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isActive: user.isActive,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
      })));
    } catch (error) {
      res.status(500).json({ message: "Ажилтны мэдээлэл татахад алдаа гарлаа" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
