import bcrypt from "bcryptjs";
import { type StaffUser, type InsertStaffUser, type LoginCredentials } from "@shared/schema";
import { storage } from "./storage";

export class AuthService {
  private static instance: AuthService;
  
  private constructor() {}
  
  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  async createStaffUser(userData: InsertStaffUser): Promise<StaffUser> {
    const hashedPassword = await this.hashPassword(userData.passwordHash);
    return await storage.createStaffUser({
      ...userData,
      passwordHash: hashedPassword,
    });
  }

  async authenticateUser(credentials: LoginCredentials): Promise<StaffUser | null> {
    const user = await storage.getStaffUserByUsername(credentials.username);
    
    if (!user || !user.isActive) {
      return null;
    }

    const isValidPassword = await this.comparePassword(credentials.password, user.passwordHash);
    
    if (!isValidPassword) {
      return null;
    }

    // Update last login time
    await storage.updateStaffUserLastLogin(user.id);
    
    return user;
  }

  async getStaffUserById(id: string): Promise<StaffUser | null> {
    return (await storage.getStaffUserById(id)) ?? null;
  }

  async getStaffUserByUsername(username: string): Promise<StaffUser | null> {
    return (await storage.getStaffUserByUsername(username)) ?? null;
  }

  async getAllStaffUsers(): Promise<StaffUser[]> {
    return await storage.getAllStaffUsers();
  }

  async updateStaffUser(id: string, updates: Partial<InsertStaffUser>): Promise<StaffUser | null> {
    if (updates.passwordHash) {
      updates.passwordHash = await this.hashPassword(updates.passwordHash);
    }
    return (await storage.updateStaffUser(id, updates)) ?? null;
  }

  async deactivateStaffUser(id: string): Promise<boolean> {
    return await storage.deactivateStaffUser(id);
  }
}

export const authService = AuthService.getInstance();
