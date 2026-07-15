"use server"

import { randomUUID } from "crypto"
import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export type ResumeActionState = {
  success?: boolean
  error?: string
}

export async function uploadResumeAction(
  _prevState: ResumeActionState,
  formData: FormData
): Promise<ResumeActionState> {
  // Get the uploaded file
  const file = formData.get("resume") as File | null

  if (!file || file.size === 0) {
    return {
      error: "Please select a resume.",
    }
  }

  // Validate file type
  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ]

  if (!allowedTypes.includes(file.type)) {
    return {
      error: "Only PDF and DOCX files are allowed.",
    }
  }

  // Create Supabase client
  const supabase = await createClient()

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      error: "Unauthorized.",
    }
  }

  // Generate a unique storage path
  const extension = file.name.split(".").pop()
  const storagePath = `${user.id}/${randomUUID()}.${extension}`

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from("resumes")
    .upload(storagePath, file)

  if (uploadError) {
    return {
      error: uploadError.message,
    }
  }

  // Get the public URL
  const {
    data: { publicUrl },
  } = supabase.storage
    .from("resumes")
    .getPublicUrl(storagePath)

  // Save/update the database record
  const { error: databaseError } = await supabase
    .from("resumes")
    .upsert({
      user_id: user.id,
      file_name: file.name,
      file_path: storagePath,
      file_url: publicUrl,
      file_size: file.size,
      file_type: file.type,
      status: "processing",
    })

  if (databaseError) {
    return {
      error: databaseError.message,
    }
  }

  // Refresh the dashboard so onboarding status is recalculated
  revalidatePath("/dashboard")

  return {
    success: true,
  }
}