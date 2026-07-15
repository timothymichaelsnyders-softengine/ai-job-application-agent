/*
    We can use both the `client` and/or the `server` for this.
    But I recommend using the client because if you use the `server` then you have to 
    `pass` all of the `image data` from the `client`, to the `server` and then send it
    to your `storage`.

    `Instead` we can just go `directly` from the `client` to the `storage`.
    `If` you `use` something like `Vercel`, they have `limits` on how much `data` you 
    can send to the `Server`.

    So, it's always best to go from Client -> Storage
*/

import { v4 as uuidv4 } from 'uuid';
import { createClient } from '../client';

function getStorage() {
    const { storage } = createClient(); // this is the class that we need from `lib/supabase`
    return storage;
}

type UploadProps = {
    file: File;
    bucket: string;
    folder?: string;
}

export async function uploadFile({ file, bucket, folder }: UploadProps) {
    const fileName = file.name;
    const fileExtension = fileName.slice(fileName.lastIndexOf(".") + 1); // get everything to the right of the last `.`
    
    // generate a uuid for this path to make it unique
    // `npm i uuid`
    // If you're using Typescript: pnpm add -D @types/uuid
    const path = `${folder ? folder + "/" : ""}${uuidv4()}.${fileExtension}`

    const storage = getStorage();

    // VALIDATE RESUMES:
    const allowed = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowed.includes(file.type)) {
        return {
            error: "Only PDF and DOCX files are allowed."
        };
    }

    const { data, error } = await storage.from(bucket).upload(path, file);

    if( error ) {
        return {fileUrl: "", error: "Image upload failed"};
    }

    const fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL!}/storage/v1/object/public/${bucket}/${data?.path}`;

    return { fileUrl, path, error: "" };
}