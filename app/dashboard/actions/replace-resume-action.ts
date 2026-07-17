"use server"

import { randomUUID } from "crypto"
import { revalidatePath } from "next/cache"

import { createClient } from "@/lib/supabase/server"

import type { ResumeActionState } from "./upload-resume-action"

export async function replaceResumeAction(
  _prevState: ResumeActionState,
  formData: FormData
): Promise<ResumeActionState> {
  const file = formData.get("resume") as File | null

  if (!file || file.size === 0) {
    return {
      error: "Please select a resume.",
    }
  }

  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ]

  if (!allowedTypes.includes(file.type)) {
    return {
      error: "Only PDF and DOCX files are allowed.",
    }
  }

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      error: "Unauthorized.",
    }
  }

  // Fetch the current resume
  const { data: currentResume } = await supabase
    .from("resumes")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (!currentResume) {
    return {
      error: "Resume not found.",
    }
  }

  // Delete the old file from Storage
  const { error: deleteError } = await supabase.storage
    .from("resumes")
    .remove([currentResume.file_path])

  if (deleteError) {
    return {
      error: deleteError.message,
    }
  }

  // Generate a new storage path
  const extension = file.name.split(".").pop()

  const storagePath = `${user.id}/${randomUUID()}.${extension}`

  // Upload the replacement file
  const { error: uploadError } = await supabase.storage
    .from("resumes")
    .upload(storagePath, file)

  if (uploadError) {
    return {
      error: uploadError.message,
    }
  }

  const {
    data: { publicUrl },
  } = supabase.storage
    .from("resumes")
    .getPublicUrl(storagePath)

  // Update the existing row
  const { error: updateError } = await supabase
    .from("resumes")
    .update({
      file_name: file.name,
      file_path: storagePath,
      file_url: publicUrl,
      file_size: file.size,
      file_type: file.type,
      status: "processing",
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", user.id)

  if (updateError) {
    return {
      error: updateError.message,
    }
  }

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/resume")

  return {
    success: true,
  }
}