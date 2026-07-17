import { UploadedResumeCard } from "../resume/uploaded-resume-card";
import { ResumeParsingCard } from "../resume/resume-parsing-card";
import { ResumeInsightsCard } from "../resume/resume-insights-card";

type ResumeViewProps = {
  resume: any;
}

export function ResumeView({
  resume
} : ResumeViewProps ) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Resume
        </h1>

        <p className="text-muted-foreground mt-1">
          Manage your uploaded resume and AI parsing.
        </p>
      </div>

      {/* We need to pass the resume information to the UploadedResumeCard component as well to display DB information */}
<<<<<<< HEAD
      {resume ? (
        <>
          <UploadedResumeCard resume={resume} />

          <div className="grid gap-6 lg:grid-cols-2">
            <ResumeParsingCard />

            <ResumeInsightsCard />
          </div>
        </>
      ) : (
        <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
          No resume uploaded yet.
        </div>
      )}
=======
      <UploadedResumeCard resume={resume} />

      <div className="grid gap-6 lg:grid-cols-2">
        <ResumeParsingCard />

        <ResumeInsightsCard />
      </div>
>>>>>>> ee6c453 (Resume Page displayes DB Information)
    </div>
  );
}