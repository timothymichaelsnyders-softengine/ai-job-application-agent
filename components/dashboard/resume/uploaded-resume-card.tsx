"use client";

import { useActionState, useEffect, useRef } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { formatFileSize } from "@/lib/format-file-size";

import { replaceResumeAction } from "@/app/dashboard/actions/replace-resume-action"

import {
    FileText,
    Eye,
    Replace,
    Trash2,
} from "lucide-react";

// This was added after creating the delete action
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteResumeAction } from "@/app/dashboard/actions/delete-resume-action"
import { useRouter } from "next/navigation"
//----------------------------------------------

type UploadedResumeCardProps = {
    resume: any;
}

export function UploadedResumeCard({
    resume
} : UploadedResumeCardProps ) {

  // Create the delete action state
  const [deleteState, deleteAction] = useActionState(
    deleteResumeAction,
    {}
  )
  //-------------------------------

  const formRef = useRef<HTMLFormElement>(null)

  const inputRef = useRef<HTMLInputElement>(null)

  // used to automatically replace the resume after file is selected.
  // The form is submitted
  const [state, formAction] = useActionState(
    replaceResumeAction,
    {}
  )

  function handleFileChange() {
    formRef.current?.requestSubmit()
  }

  const router = useRouter()

  useEffect(() => {
    if (state.success) {
      router.refresh()
    }
  }, [state.success, router])

  // Refresh after deletion
  useEffect(() => {
    if (deleteState.success) {
      router.refresh()
    }
  }, [deleteState.success, router])
  //-----------------------

  return (
    <Card>
      <CardHeader>
          <CardTitle>
              Uploaded Resume
          </CardTitle>
      </CardHeader>

      {/* Content - Static for now */}
      <CardContent>
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
              <div className="rounded-xl bg-primary/10 p-3">
                  <FileText className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">
                    {resume?.file_name}
                </h3>
                <p className="text-sm text-muted-foreground">
                    File Type : {resume?.file_type.includes("/") ? resume?.file_type.split("/")[1].toUpperCase() : resume?.file_type} • Size : {formatFileSize(resume?.file_size)}
                </p>

                <p className="text-sm text-muted-foreground mt-1">
                    Uploaded : {new Date(resume?.uploaded_at).toLocaleDateString()}
                </p>
              </div>
          </div>
          <div className="flex gap-2">
              <Button 
                variant="outline"
                asChild
              >
                <a
                    href={resume?.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center"
                >
                  <Eye className="mr-2 h-4 w-4"/>
                  View
                </a>
              </Button>
              <form
                ref={formRef}
                action={formAction}
              >
                <input
                  ref={inputRef}
                  hidden
                  type="file"
                  name="resume"
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                />

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => inputRef.current?.click()}
                >
                  <Replace className="mr-2 h-4 w-4" />

                  Replace
                </Button>
              </form>
              {/* Replace the Delete button */}
              {/* <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4"/>
                Delete
              </Button> */}
              {/* With */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Delete Resume?
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                      This will permanently delete your uploaded resume from storage.
                      You'll need to upload a new resume before you can continue using JobBuddy AI.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>

                    <AlertDialogCancel>
                      Cancel
                    </AlertDialogCancel>

                    <form action={deleteAction}>
                      <AlertDialogAction asChild>
                        <Button type="submit" variant="destructive">
                          Delete Resume
                        </Button>
                      </AlertDialogAction>
                    </form>

                  </AlertDialogFooter>

                </AlertDialogContent>
              </AlertDialog>
          </div>
      </div>
    </CardContent>
    </Card>
  )
}
