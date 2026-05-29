import {
  JOB_LEVEL,
  JOB_TYPE,
  MIN_EDUCATION,
  SALARY_CURRENCY,
  SALARY_PERIOD,
  WORK_TYPE,
} from "@/config/constant";
import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  datetime,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  year,
} from "drizzle-orm/mysql-core";
import { id } from "zod/v4/locales";

export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  username: varchar("username", { length: 255 }).unique().notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  role: mysqlEnum("role", ["admin", "applicant", "employer"]).default(
    "applicant",
  ),
  phone: varchar("phone", { length: 255 }),
  avatarUrl: text("avatar_url"),
  deletedAt: timestamp("deleted_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// using session in future for authentication and authorization
export const sessionsTable = mysqlTable("sessions_table", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: int("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  userAgent: text("user_agent").notNull(),
  ip: varchar("ip", { length: 255 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// employers table with one to one relationship with users table
export const employers = mysqlTable("employers", {
  id: int("id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }),
  description: text("description"),
  //   avatarUrl: text('avatar_url'),
  bannerImageUrl: text("banner_image_url"),
  organizationType: varchar("organization_type", { length: 100 }),
  teamSize: varchar("team_size", { length: 50 }),
  yearOfEstablishment: year("year_of_establishment"),
  websiteUrl: varchar("website_url", { length: 255 }),
  location: varchar("location", { length: 255 }),

  deletedAt: timestamp("deleted_at", { mode: "string" }),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
});

// applicants table with one to one relationship with users table
export const applicants = mysqlTable("applicants", {
  id: int("id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  biography: text("biography"),
  dateOfBirth: datetime("date_of_birth"),
  nationality: varchar("nationality", { length: 100 }),
  maritalStatus: mysqlEnum("marital_status", [
    "single",
    "married",
    "divorced",
    "widowed",
  ]),
  gender: mysqlEnum("gender", ["male", "female", "other"]),
  education: mysqlEnum("education", [
    "none",
    "high_school",
    "bachelor",
    "master",
    "phd",
  ]),
  experience: text("experience"),
  websiteUrl: varchar("website_url", { length: 255 }),
  location: varchar("location", { length: 255 }),

  deletedAt: timestamp("deleted_at", { mode: "string" }),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
});

export const jobs = mysqlTable("jobs", {
  id: int("id").autoincrement().primaryKey(),
  // title: text("title").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  employerId: int("employer_id")
    .notNull()
    .references(() => employers.id, { onDelete: "cascade" }),
  description: text("description").notNull(),
  tags: text("tags"),
  minSalary: int("min_salary"),
  maxSalary: int("max_salary"),
  salaryCurrency: mysqlEnum("salary_currency", SALARY_CURRENCY),
  salaryPeriod: mysqlEnum("salary_period", SALARY_PERIOD),
  location: varchar("location", { length: 255 }),
  jobType: mysqlEnum("job_type", JOB_TYPE),
  workType: mysqlEnum("work_type", WORK_TYPE),
  jobLevel: mysqlEnum("job_level", JOB_LEVEL),
  experience: text("experience"),
  minEducation: mysqlEnum("min_education", MIN_EDUCATION),
  isFeatured: boolean("is_featured").default(false).notNull(),
  expiresAt: date("expires_at"),
  deletedAt: timestamp("deleted_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const resumes = mysqlTable("resumes", {
  id: int("id").autoincrement().primaryKey(),
  applicantId: int("applicant_id")
    .notNull()
    .references(() => applicants.id, { onDelete: "cascade" }),

  fileUrl: text("file_url").notNull(), // The UploadThing URL
  fileName: varchar("file_name", { length: 255 }).notNull(),
  fileSize: int("file_size"),
  isPrimary: boolean("is_primary").default(false),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const jobApplications = mysqlTable("jobApplications", {
  id: int("id").autoincrement().primaryKey(),

  jobId: int("job_id")
    .notNull()
    .references(() => jobs.id, { onDelete: "cascade" }),

  applicantId: int("applicant_id")
    .notNull()
    .references(() => applicants.id, { onDelete: "cascade" }),

  resumeId: int("resume_id")
    .notNull()
    .references(() => resumes.id, { onDelete: "restrict" }), // They can't delete a resume if it's used in an application

  coverLetter: text("cover_letter"),

  // You can add a status enum later if you want employers to "accept/reject"
  // Status: mysqlEnum("status", ["pending", "reviewed", "rejected"]).default("pending"),

  appliedAt: timestamp("applied_at").defaultNow().notNull(),
});

export const jobApplicationsRelations = relations(
  jobApplications,
  ({ one }) => ({
    job: one(jobs, {
      fields: [jobApplications.jobId],
      references: [jobs.id],
    }),
    applicant: one(applicants, {
      fields: [jobApplications.applicantId],
      references: [applicants.id],
    }),
    resume: one(resumes, {
      fields: [jobApplications.resumeId],
      references: [resumes.id],
    }),
  }),
);

// ------------------- ** ------------------- ** ------------- //

// export const tableNameRelations = relations(
// // 1. the main table being defeined (e.g. users)

// table,

// // 2. A callback function to define the relations
// ({ one, many }) => ({
//  // ... relation definitions
// })
// );

// -------------------- ** ------------------- ** ------------- //

//! Both the one() and many() helper functions take arguments to define the relationships

// Relations definations
export const userRelations = relations(users, ({ one, many }) => ({
  // one user can have one employer profile ( if role is employer )
  employer: one(employers, {
    fields: [users.id],
    references: [employers.id],
  }),

  // one user can have one applicant profile ( if role is applicant )
  applicant: one(applicants, {
    fields: [users.id],
    references: [applicants.id],
  }),

  // one user can have many sessions
  sessions: many(sessionsTable),
}));

export const sessionRelations = relations(sessionsTable, ({ one }) => ({
  // Each session belongs to one user
  user: one(users, {
    fields: [sessionsTable.userId],
    references: [users.id],
  }),
}));

export const jobsRelations = relations(jobs, ({ one }) => ({
  // Each job belongs to one employer
  employer: one(employers, {
    fields: [jobs.employerId],
    references: [employers.id],
  }),
}));

export const resumesRelations = relations(resumes, ({ one }) => ({
  // Each resume belongs to one applicant
  applicant: one(applicants, {
    fields: [resumes.applicantId],
    references: [applicants.id],
  }),
}));

export const applicantsRelations = relations(applicants, ({ many }) => ({
  resumes: many(resumes),
}));

// relations(TABLE_NAME, (helpers) => ({
//     relationName: relationType(OTHER_TABLE, {
//     fields:[CURRENT_TABLE.colums],
//     references: [OTHER_TABLE.column],
//     }),
// }));
