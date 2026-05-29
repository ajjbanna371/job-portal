RENAME TABLE `job_applications` TO `jobApplications`;--> statement-breakpoint
ALTER TABLE `jobApplications` DROP FOREIGN KEY `job_applications_job_id_jobs_id_fk`;
--> statement-breakpoint
ALTER TABLE `jobApplications` DROP FOREIGN KEY `job_applications_applicant_id_applicants_id_fk`;
--> statement-breakpoint
ALTER TABLE `jobApplications` DROP FOREIGN KEY `job_applications_resume_id_resumes_id_fk`;
--> statement-breakpoint
ALTER TABLE `jobApplications` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `jobApplications` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `jobApplications` ADD CONSTRAINT `jobApplications_job_id_jobs_id_fk` FOREIGN KEY (`job_id`) REFERENCES `jobs`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `jobApplications` ADD CONSTRAINT `jobApplications_applicant_id_applicants_id_fk` FOREIGN KEY (`applicant_id`) REFERENCES `applicants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `jobApplications` ADD CONSTRAINT `jobApplications_resume_id_resumes_id_fk` FOREIGN KEY (`resume_id`) REFERENCES `resumes`(`id`) ON DELETE restrict ON UPDATE no action;