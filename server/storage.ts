import { type Pet, type InsertPet, type Application, type InsertApplication, type Adoption, type InsertAdoption, type StaffUser, type InsertStaffUser } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
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

  // Staff User methods
  getAllStaffUsers(): Promise<StaffUser[]>;
  getStaffUserById(id: string): Promise<StaffUser | undefined>;
  getStaffUserByUsername(username: string): Promise<StaffUser | undefined>;
  createStaffUser(user: InsertStaffUser): Promise<StaffUser>;
  updateStaffUser(id: string, updates: Partial<InsertStaffUser>): Promise<StaffUser | undefined>;
  updateStaffUserLastLogin(id: string): Promise<boolean>;
  deactivateStaffUser(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private pets: Map<string, Pet>;
  private applications: Map<string, Application>;
  private adoptions: Map<string, Adoption>;
  private staffUsers: Map<string, StaffUser>;

  constructor() {
    this.pets = new Map();
    this.applications = new Map();
    this.adoptions = new Map();
    this.staffUsers = new Map();
    
    // Add sample data
    this.initializeSampleData();
  }

  private async initializeSampleData() {
    // Sample pets
    const samplePets = [
      {
        name: "Бар",
        species: "нохой",
        breed: "Голден Ретривер",
        age: "2 настай",
        weight: "25 кг",
        gender: "эр",
        description: "Бар бол маш найрсаг, хүүхдүүдтэй дуртай нохой. Тоглох дуртай, сахилга батыг сайн дагадаг.",
        healthStatus: ["эрүүл", "вакцинжуулсан", "үржил хаасан"],
        imageUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop&crop=center",
      },
      {
        name: "Луна",
        species: "муур",
        breed: "Перс",
        age: "1 настай",
        weight: "4 кг",
        gender: "эм",
        description: "Луна бол тайван, инээмсэглэх дуртай муур. Гэрт суух дуртай, хүмүүстэй ойр дотно болох дуртай.",
        healthStatus: ["эрүүл", "вакцинжуулсан"],
        imageUrl: "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=400&h=300&fit=crop&crop=center",
      },
      {
        name: "Чинк",
        species: "туулай",
        breed: "Holland Lop",
        age: "8 сартай",
        weight: "1.5 кг",
        gender: "эр",
        description: "Чинк бол жижиг, хөөрхөн туулай. Хүүхдүүдтэй тоглох дуртай, идэх дуртай.",
        healthStatus: ["эрүүл", "вакцинжуулсан"],
        imageUrl: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400&h=300&fit=crop&crop=center",
      }
    ];

    for (const petData of samplePets) {
      await this.createPet(petData);
    }

    // Sample staff users (password: "admin123")
    // Using a pre-generated bcrypt hash for "admin123" with salt rounds 12
    const sampleStaffUsers = [
      {
        username: "admin",
        email: "admin@petconnect.mn",
        passwordHash: "$2b$12$0i7G57e8L16tpRfF6n11SuhG9Cll7jzp9cVaEQXn9jTlI2nMsLY6G", // admin123
        fullName: "Админ Хэрэглэгч",
        role: "admin",
        isActive: true,
      },
      {
        username: "staff1",
        email: "staff1@petconnect.mn",
        passwordHash: "$2b$12$0i7G57e8L16tpRfF6n11SuhG9Cll7jzp9cVaEQXn9jTlI2nMsLY6G", // admin123
        fullName: "Ажилтан 1",
        role: "staff",
        isActive: true,
      }
    ];

    for (const userData of sampleStaffUsers) {
      await this.createStaffUser(userData);
    }
  }

  // Staff User methods
  async getAllStaffUsers(): Promise<StaffUser[]> {
    return Array.from(this.staffUsers.values());
  }

  async getStaffUserById(id: string): Promise<StaffUser | undefined> {
    return this.staffUsers.get(id);
  }

  async getStaffUserByUsername(username: string): Promise<StaffUser | undefined> {
    return Array.from(this.staffUsers.values()).find(user => user.username === username);
  }

  async createStaffUser(insertStaffUser: InsertStaffUser): Promise<StaffUser> {
    const id = randomUUID();
    const now = new Date();
    const user: StaffUser = {
      ...insertStaffUser,
      id,
      role: insertStaffUser.role || "staff",
      isActive: true,
      lastLoginAt: null,
      createdAt: now,
      updatedAt: now,
    };
    this.staffUsers.set(id, user);
    return user;
  }

  async updateStaffUser(id: string, updates: Partial<InsertStaffUser>): Promise<StaffUser | undefined> {
    const user = this.staffUsers.get(id);
    if (!user) return undefined;
    
    const updatedUser: StaffUser = { 
      ...user, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.staffUsers.set(id, updatedUser);
    return updatedUser;
  }

  async updateStaffUserLastLogin(id: string): Promise<boolean> {
    const user = this.staffUsers.get(id);
    if (!user) return false;
    
    user.lastLoginAt = new Date();
    this.staffUsers.set(id, user);
    return true;
  }

  async deactivateStaffUser(id: string): Promise<boolean> {
    const user = this.staffUsers.get(id);
    if (!user) return false;
    
    user.isActive = false;
    user.updatedAt = new Date();
    this.staffUsers.set(id, user);
    return true;
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
      healthStatus: insertPet.healthStatus || [],
      imageUrl: insertPet.imageUrl || null,
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
      experience: insertApplication.experience || null,
      reason: insertApplication.reason || null,
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
      story: insertAdoption.story || null,
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
