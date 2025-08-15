import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPetSchema, insertApplicationSchema, insertAdoptionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Pet routes
  app.get("/api/pets", async (req, res) => {
    try {
      const pets = await storage.getAvailablePets();
      res.json(pets);
    } catch (error) {
      res.status(500).json({ message: "Амьтдын мэдээлэл татахад алдаа гарлаа" });
    }
  });

  app.get("/api/pets/all", async (req, res) => {
    try {
      const pets = await storage.getAllPets();
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

  app.post("/api/pets", async (req, res) => {
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

  app.patch("/api/pets/:id", async (req, res) => {
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

  app.delete("/api/pets/:id", async (req, res) => {
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

  // Application routes
  app.get("/api/applications", async (req, res) => {
    try {
      const applications = await storage.getAllApplications();
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Өргөдлийн мэдээлэл татахад алдаа гарлаа" });
    }
  });

  app.get("/api/applications/:id", async (req, res) => {
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

  app.patch("/api/applications/:id/status", async (req, res) => {
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

  // Adoption routes
  app.get("/api/adoptions", async (req, res) => {
    try {
      const adoptions = await storage.getAllAdoptions();
      res.json(adoptions);
    } catch (error) {
      res.status(500).json({ message: "Үрчлэлтийн мэдээлэл татахад алдаа гарлаа" });
    }
  });

  app.post("/api/adoptions", async (req, res) => {
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

  // Statistics route
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getAdoptionStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Статистик татахад алдаа гарлаа" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
