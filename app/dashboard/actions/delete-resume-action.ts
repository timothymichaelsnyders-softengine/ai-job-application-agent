"use server";

import { revalidatePath } from "next/cache"

import { createClient } from "@/lib/supabase/server"

import type { ResumeActionState } from "./upload-resume-action"

export async function deleteResumeAction() : Promise<ResumeActionState> {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return {
        error: "Unauthorized.",
        }
    }

    // Find the current resume
    const { data: resume } = await supabase
        .from("resumes")
        .select("*")
        .eq("user_id", user.id)
        .single()

    if (!resume) {
        return {
        error: "Resume not found.",
        }
    }

    // Delete the file from Storage
    const { error: storageError } = await supabase.storage
        .from("resumes")
        .remove([resume.file_path])

    if (storageError) {
        return {
        error: storageError.message,
        }
    }

    // Delete the database row
    const { error: databaseError } = await supabase
        .from("resumes")
        .delete()
        .eq("user_id", user.id)

    if (databaseError) {
        return {
        error: databaseError.message,
        }
    }

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/resume")

    return {
        success: true,
    }
}