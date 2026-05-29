import { EmployerJobList } from "@/app/features/employers/components/employer-job-list";

export default function Jobs() {
    return (
        <div className="container max-auto py-6">
            <h1 className="text-2xl font-bold mb-6">My Job Posts</h1>
            <EmployerJobList />
        </div>
    );
};