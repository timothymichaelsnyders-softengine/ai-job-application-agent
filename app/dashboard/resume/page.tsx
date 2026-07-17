import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import {ResumeView} from "@/components/dashboard/views/resume-view";

export default async function ResumePage() {

  const supabase = await createClient();

  const {
    data : { user }
  } = await supabase.auth.getUser();

  if( !user ) {
    redirect("/sign-in");
  }

  // get the resume for the current logged in user
  const { data : resume } = await supabase
    .from("resumes")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // pass this resume to the ResumeView
  return <ResumeView resume={resume}/>
}