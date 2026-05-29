import { JobForm } from "@/app/features/employers/components/employer-job-form";
import { GetJobByIdAction } from "@/app/features/server/jobs.actions";
import { redirect } from "next/navigation";

// interface EditJobPageProps {
//   params: Promise<{ jobId: string }>;
// }

interface EditJobPageProps {
  readonly params: Promise<{
    readonly jobId: string;
  }>;
}

export default async function EditJobPage({ params }: EditJobPageProps) {
  const { jobId } = await params;

  const numericId = Number(jobId);

  // 1. Validate ID
  if (!jobId || Number.isNaN(numericId)) {
    redirect("/employer-dashboard/jobs");
  }

  // 2. Fetch Data
  const { status, data: job } = await GetJobByIdAction(numericId);
  console.log("Job Data after ID:", job);

  // 3. Handle Errors (e.g., user manually types a random ID)
  if (status === "ERROR" || !job) {
    redirect("/employer-dashboard/jobs");
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
    {/* <div className="flex flex-col gap-4"> */}
    <div className="mb-8">
      <h1 className="text-2xl font-bold">Edit Job: {job.title}</h1>
      <p>Editing job with ID: {numericId}</p>
    </div>

    {/* 4. Pass the fetched data to the form */}
    <JobForm initialData={job} isEditMode={true} />
    </div>
  );
}
