"use client"

import { useActionState, useRef, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileText, UploadCloud } from "lucide-react"
import {
  uploadResumeAction,
  type ResumeActionState,
} from "@/app/dashboard/actions/upload-resume"

type ResumeOnboardingDialogProps = {
  open: boolean
}

export function ResumeOnboardingDialog({
  open,
}: ResumeOnboardingDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const [file, setFile] = useState<File | null>(null)

  const initialState: ResumeActionState = {}

  const [state, formAction, pending] = useActionState(
    uploadResumeAction,
    initialState
  )

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = e.target.files?.[0]

    if (!selectedFile) return

    setFile(selectedFile)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  return (
    <Dialog open={open}>
      <DialogContent
        showCloseButton={false}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        className="sm:max-w-xl"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Welcome 👋
          </DialogTitle>

          <DialogDescription>
            Before you can use JobBuddy AI, upload your resume.
            We'll automatically extract your experience,
            education, skills, projects and build your
            professional profile.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-6">

          {file ? (
            <div className="rounded-xl border p-4">
              <div className="flex items-center gap-3">
                <FileText className="size-8 text-primary" />

                <div className="flex-1">
                  <p className="font-medium">
                    {file.name}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => inputRef.current?.click()}
                >
                  Change
                </Button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex h-64 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed transition hover:bg-muted/40"
            >
              <UploadCloud className="mb-4 h-10 w-10 text-primary" />

              <p className="font-medium">
                Click to upload your resume
              </p>

              <p className="text-sm text-muted-foreground">
                PDF or DOCX
              </p>
            </button>
          )}

          <input
            ref={inputRef}
            hidden
            type="file"
            name="resume"
            accept=".pdf,.docx"
            onChange={handleFileChange}
          />

          <div className="rounded-lg bg-muted p-4">
            <div className="flex gap-3">
              <FileText className="mt-0.5 h-5 w-5" />

              <div>
                <p className="font-medium">
                  What we'll import
                </p>

                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>• Personal information</li>
                  <li>• Professional summary</li>
                  <li>• Skills</li>
                  <li>• Work experience</li>
                  <li>• Education</li>
                  <li>• Projects</li>
                  <li>• Certifications</li>
                  <li>• Links</li>
                </ul>
              </div>
            </div>
          </div>

          {state.error && (
            <p className="text-sm text-destructive">
              {state.error}
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={!file || pending}
          >
            {pending
              ? "Uploading Resume..."
              : "Upload Resume"}
          </Button>

        </form>
      </DialogContent>
    </Dialog>
  )
}