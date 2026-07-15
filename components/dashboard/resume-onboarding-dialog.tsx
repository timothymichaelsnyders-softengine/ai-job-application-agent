"use client"

import { useRef, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";

import { UploadCloud, FileText, ArrowRight, CheckCircle2 } from "lucide-react"

type ResumeOnboardingDialogProps = {
  open: boolean
}

export function ResumeOnboardingDialog({
  open,
}: ResumeOnboardingDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
    ) => {
    const selectedFile = e.target.files?.[0]

    if (!selectedFile) return

    setFile(selectedFile)
  }

  const formatFileSize = (bytes: number) => {
    if( bytes < 1024 ) 
        return `${bytes} B`

    if ( bytes < 1024 * 1024 )
        return `${(bytes / 1024).toFixed(1)} KB`

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
            We'll automatically extract your experience, education,
            skills and projects so your profile is ready in seconds.
          </DialogDescription>
        </DialogHeader>

        {/* Sin Cara */}
        {file ? (
            <>
                <div className="flex flex-col items-center justify-center text-center">
                    <h3>Selected File: <span className="font-semibold">{file.name}</span></h3>
                    <span className="py-1">File Size: {formatFileSize(file.size)}</span>
                    <p className="flex items-center gap-1 py-1 text-sm font-medium text-green-600">
                        Ready
                        <CheckCircle2 className="h-5 w-5" />
                    </p>
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                        Upload Resume
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </>
        ) : (
            <p className="font-semibold">No file selected</p> 
        )}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-6 flex h-64 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed hover:bg-muted/40 transition"
        >
          <UploadCloud className="mb-4 h-10 w-10 text-primary" />

          <p className="font-medium">
            Click to upload your resume
          </p>

          <p className="text-sm text-muted-foreground">
            PDF or DOCX
          </p>
        </button>

        {/* {!file ? (<button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-6 flex h-64 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed hover:bg-muted/40 transition"
        >
          <UploadCloud className="mb-4 h-10 w-10 text-primary" />

          <p className="font-medium">
            Click to upload your resume
          </p>

          <p className="text-sm text-muted-foreground">
            PDF or DOCX
          </p>
        </button>) : (
            <div></div>
        )} */}

        <input
          ref={inputRef}
          hidden
          type="file"
          accept=".pdf,.docx"
          onChange={handleFileChange}
        />

        <div className="mt-6 rounded-lg bg-muted p-4">
          <div className="flex gap-3">
            <FileText className="mt-0.5 h-5 w-5" />

            <div>
              <p className="font-medium">
                What we'll import
              </p>

              <ul className="mt-2 text-sm text-muted-foreground space-y-1">
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
      </DialogContent>
    </Dialog>
  )
}