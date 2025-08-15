import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const pets = pgTable("pets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  species: text("species").notNull(), // нохой, муур, туулай
  breed: text("breed").notNull(),
  age: text("age").notNull(), // "8 сартай", "2 настай"
  weight: text("weight").notNull(), // "12 кг"
  gender: text("gender").notNull(), // эр, эм
  description: text("description").notNull(),
  healthStatus: text("health_status").array().notNull().default(sql`ARRAY[]::text[]`), // эрүүл, вакцинжуулсан, стерилизацилагдсан
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

export type Pet = typeof pets.$inferSelect;
export type InsertPet = z.infer<typeof insertPetSchema>;
export type Application = typeof applications.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Adoption = typeof adoptions.$inferSelect;
export type InsertAdoption = z.infer<typeof insertAdoptionSchema>;

