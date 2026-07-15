"use client";

import { uploadFile } from "@/lib/supabase/storage/client.copy";
import { convertBlobUrlToFile } from "@/lib/utils";
import Image from "next/image";
import { ChangeEvent, useRef, useState, useTransition } from "react";

const DashboardFileUploadTestShell = () => {

  const [files, setFiles] = useState<File[]>([]);
  
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Expects an event of type ChangeEvent<HTMLInputElement>
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        setFiles(Array.from(e.target.files));
  };

  const [isPending, startTransition] = useTransition();

  const handleClickUploadImagesButton = () => {
    startTransition(async () => {
        for(const file of files) {
            await uploadFile({
                file,
                bucket: "resumes",
            });
        }

        // console.log(urls);
        setFiles([]);
    })
  }

  return (
    <div className='bg-slate-500 min-h-screen flex justify-center items-center flex-col gap-8'>

        <input 
            type='file' 
            accept=".pdf,.docx"
            hidden 
            multiple 
            ref={imageInputRef} 
            onChange={handleFileChange}
            disabled={isPending}    
        />
        <button 
            className='bg-slate-600 py-2 w-49 rounded-lg' 
            onClick={() => {
                imageInputRef.current?.click()
            }}
            disabled={isPending}
        >
            Select Files
        </button>    

        <div className="flex-row gap-4">
            {files.map((file, index) => (
                <p key={index}>
                    {index + 1}. {file.name}
                </p>
            ))}
        </div>    

        <button 
            className='bg-slate-600 py-2 w-49 rounded-lg'
            onClick={handleClickUploadImagesButton}
        >
            {isPending ? "Uploading..." : "Upload Images"}
        </button>

    </div>
  )
}

export default DashboardFileUploadTestShell