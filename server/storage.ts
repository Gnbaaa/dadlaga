import { type User, type InsertUser, type Pet, type InsertPet, type Application, type InsertApplication, type Adoption, type InsertAdoption } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Pet methods
  getAllPets(): Promise<Pet[]>;
  getPet(id: string): Promise<Pet | undefined>;
  getAvailablePets(): Promise<Pet[]>;
  createPet(pet: InsertPet): Promise<Pet>;
  updatePet(id: string, pet: Partial<InsertPet>): Promise<Pet | undefined>;
  deletePet(id: string): Promise<boolean>;
  adoptPet(id: string): Promise<boolean>;

  // Application methods
  getAllApplications(): Promise<Application[]>;
  getApplication(id: string): Promise<Application | undefined>;
  getApplicationsByPet(petId: string): Promise<Application[]>;
  createApplication(application: InsertApplication): Promise<Application>;
  updateApplicationStatus(id: string, status: string): Promise<Application | undefined>;

  // Adoption methods
  getAllAdoptions(): Promise<Adoption[]>;
  getAdoption(id: string): Promise<Adoption | undefined>;
  createAdoption(adoption: InsertAdoption): Promise<Adoption>;
  getAdoptionStats(): Promise<{
    totalAdopted: number;
    currentPets: number;
    happyFamilies: number;
    todayApplications: number;
    monthlyAdoptions: number;
    activePets: number;
    pendingApplications: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private pets: Map<string, Pet>;
  private applications: Map<string, Application>;
  private adoptions: Map<string, Adoption>;

  constructor() {
    this.users = new Map();
    this.pets = new Map();
    this.applications = new Map();
    this.adoptions = new Map();
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Pet methods
  async getAllPets(): Promise<Pet[]> {
    return Array.from(this.pets.values());
  }

  async getPet(id: string): Promise<Pet | undefined> {
    return this.pets.get(id);
  }

  async getAvailablePets(): Promise<Pet[]> {
    return Array.from(this.pets.values()).filter(pet => !pet.isAdopted);
  }

  async createPet(insertPet: InsertPet): Promise<Pet> {
    const id = randomUUID();
    const pet: Pet = {
      ...insertPet,
      id,
      isAdopted: false,
      createdAt: new Date(),
    };
    this.pets.set(id, pet);
    return pet;
  }

  async updatePet(id: string, updates: Partial<InsertPet>): Promise<Pet | undefined> {
    const pet = this.pets.get(id);
    if (!pet) return undefined;
    
    const updatedPet: Pet = { ...pet, ...updates };
    this.pets.set(id, updatedPet);
    return updatedPet;
  }

  async deletePet(id: string): Promise<boolean> {
    return this.pets.delete(id);
  }

  async adoptPet(id: string): Promise<boolean> {
    const pet = this.pets.get(id);
    if (!pet) return false;
    
    pet.isAdopted = true;
    this.pets.set(id, pet);
    return true;
  }

  // Application methods
  async getAllApplications(): Promise<Application[]> {
    return Array.from(this.applications.values());
  }

  async getApplication(id: string): Promise<Application | undefined> {
    return this.applications.get(id);
  }

  async getApplicationsByPet(petId: string): Promise<Application[]> {
    return Array.from(this.applications.values()).filter(app => app.petId === petId);
  }

  async createApplication(insertApplication: InsertApplication): Promise<Application> {
    const id = randomUUID();
    const application: Application = {
      ...insertApplication,
      id,
      status: "pending",
      createdAt: new Date(),
    };
    this.applications.set(id, application);
    return application;
  }

  async updateApplicationStatus(id: string, status: string): Promise<Application | undefined> {
    const application = this.applications.get(id);
    if (!application) return undefined;
    
    application.status = status;
    this.applications.set(id, application);
    return application;
  }

  // Adoption methods
  async getAllAdoptions(): Promise<Adoption[]> {
    return Array.from(this.adoptions.values());
  }

  async getAdoption(id: string): Promise<Adoption | undefined> {
    return this.adoptions.get(id);
  }

  async createAdoption(insertAdoption: InsertAdoption): Promise<Adoption> {
    const id = randomUUID();
    const adoption: Adoption = {
      ...insertAdoption,
      id,
      adoptionDate: new Date(),
    };
    this.adoptions.set(id, adoption);
    
    // Mark pet as adopted
    await this.adoptPet(insertAdoption.petId);
    
    return adoption;
  }

  async getAdoptionStats(): Promise<{
    totalAdopted: number;
    currentPets: number;
    happyFamilies: number;
    todayApplications: number;
    monthlyAdoptions: number;
    activePets: number;
    pendingApplications: number;
  }> {
    const adoptions = Array.from(this.adoptions.values());
    const applications = Array.from(this.applications.values());
    const pets = Array.from(this.pets.values());
    
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    return {
      totalAdopted: adoptions.length,
      currentPets: pets.filter(pet => !pet.isAdopted).length,
      happyFamilies: adoptions.length,
      todayApplications: applications.filter(app => 
        app.createdAt && app.createdAt >= startOfToday
      ).length,
      monthlyAdoptions: adoptions.filter(adoption => 
        adoption.adoptionDate && adoption.adoptionDate >= startOfMonth
      ).length,
      activePets: pets.filter(pet => !pet.isAdopted).length,
      pendingApplications: applications.filter(app => app.status === "pending").length,
    };
  }
}

export const storage = new MemStorage();
