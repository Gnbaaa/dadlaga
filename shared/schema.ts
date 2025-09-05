import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const staffUsers = pgTable("staff_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull().default("staff"), // admin, staff
  isActive: boolean("is_active").default(true),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

export const pets = pgTable("pets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  species: text("species").notNull(), // нохой, муур, туулай
  breed: text("breed").notNull(),
  age: text("age").notNull(), // "8 сартай", "2 настай"
  weight: text("weight").notNull(), // "12 кг"
  gender: text("gender").notNull(), // эр, эм
  description: text("description").notNull(),
  healthStatus: text("health_status").array().notNull().default(sql`ARRAY[]::text[]`), // эрүүл, вакцинжуулсан, үржил хаасан
  imageUrl: text("image_url"),
  isAdopted: boolean("is_adopted").default(false),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const applications = pgTable("applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  petId: varchar("pet_id").notNull(),
  fullName: text("full_name").notNull(),
  phoneNumber: text("phone_number").notNull(),
  email: text("email").notNull(),
  age: integer("age").notNull(),
  address: text("address").notNull(),
  livingCondition: text("living_condition").notNull(), // apartment, house, house-with-yard
  experience: text("experience"), // амьтан өсгөсөн туршлага
  reason: text("reason"), // яагаад үрчлэх гэж байгаа шалтгаан
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const adoptions = pgTable("adoptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  petId: varchar("pet_id").notNull(),
  applicationId: varchar("application_id").notNull(),
  adoptionDate: timestamp("adoption_date").default(sql`now()`),
  story: text("story"), // амжилтын түүх
  adoptedBy: text("adopted_by").notNull(),
});

export const insertStaffUserSchema = createInsertSchema(staffUsers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastLoginAt: true,
  isActive: true,
});

export const loginSchema = z.object({
  username: z.string().min(1, "Хэрэглэгчийн нэр оруулна уу"),
  password: z.string().min(1, "Нууц үг оруулна уу"),
});

export const insertPetSchema = createInsertSchema(pets).omit({
  id: true,
  createdAt: true,
  isAdopted: true,
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  createdAt: true,
  status: true,
});

export const insertAdoptionSchema = createInsertSchema(adoptions).omit({
  id: true,
  adoptionDate: true,
});

export type StaffUser = typeof staffUsers.$inferSelect;
export type InsertStaffUser = z.infer<typeof insertStaffUserSchema>;
export type LoginCredentials = z.infer<typeof loginSchema>;
export type Pet = typeof pets.$inferSelect;
export type InsertPet = z.infer<typeof insertPetSchema>;
export type Application = typeof applications.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Adoption = typeof adoptions.$inferSelect;
export type InsertAdoption = z.infer<typeof insertAdoptionSchema>;

