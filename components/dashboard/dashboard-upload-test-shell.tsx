"use client";

import { uploadImage } from "@/lib/supabase/storage/client";
import { convertBlobUrlToFile } from "@/lib/utils";
import Image from "next/image";
import { ChangeEvent, useRef, useState, useTransition } from "react";

const DashboardUploadTestShell = () => {

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Expects an event of type ChangeEvent<HTMLInputElement>
  const handleImageChange = (e : ChangeEvent<HTMLInputElement>) => {
    if(e.target.files) {
        const filesArray = Array.from(e.target.files);
        const newImageUrls = filesArray.map((file) => URL.createObjectURL(file))

        setImageUrls([...imageUrls, ...newImageUrls]);
    }
  }

  const [isPending, startTransition] = useTransition();

  const handleClickUploadImagesButton = () => {
    startTransition(async () => {
        let urls = [];
        for(const url in imageUrls) {
            const imageFile = await convertBlobUrlToFile(url);

            const {imageUrl, error} = await uploadImage({
                file: imageFile,
                bucket: 'resumes', // our Supabase Storage Bucket Name
            })

            if(error) {
                console.error(error);
                return;
            }

            urls.push(imageUrl);
        }

        console.log(urls);
        setImageUrls([]);
    })
  }

  return (
    <div className='bg-slate-500 min-h-screen flex justify-center items-center flex-col gap-8'>

        <input 
            type='file' 
            hidden 
            multiple 
            ref={imageInputRef} 
            onChange={handleImageChange}
            disabled={isPending}    
        />
        <button 
            className='bg-slate-600 py-2 w-49 rounded-lg' 
            onClick={() => {
                imageInputRef.current?.click()
            }}
            disabled={isPending}
        >
            Select Images
        </button>    

        <div className="flex gap-4">
            {imageUrls.map((url, index) => (
                <Image 
                    key={url}
                    src={url}
                    width={300}
                    height={300}
                    alt={`img-${index}`}
                />
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

export default DashboardUploadTestShell