"use client";
import DZ from "react-dropzone";
import { toast } from "sonner";

import Loader from "@/components/Loader";

import { cn } from "@/lib/utils";

const Dropzone = ({ onFileUpload, processing }) => {
  const MAX_FILE_SIZE = 20971520; // 20MB

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length === 0 || processing) return;

    const acceptedFile = acceptedFiles[0];

    if (acceptedFile.size > MAX_FILE_SIZE) {
      toast.error(`File ${acceptedFile.name} is too large!`);
      return;
    }

    onFileUpload(acceptedFile);
  };

  return (
    <DZ onDrop={onDrop} maxFiles={1}>
      {({ getRootProps, getInputProps, isDragActive, isDragReject }) => (
        <section className="mx-4 mt-6">
          <div
            {...getRootProps()}
            className={cn(
              "flex h-60 w-full cursor-pointer items-center justify-center rounded-md border border-dashed border-gray-300",
              isDragActive && "animate-pulse bg-background-hover",
              processing ? "cursor-not-allowed opacity-50" : "hover:bg-background-hover",
            )}
          >
            <input {...getInputProps()} disabled={processing} aria-label="File upload" />
            {processing ? (
              // <p className="text-gray-500">Processing file...</p>
              <Loader />
            ) : !isDragActive ? (
              "Click here or drop your resume to upload!"
            ) : isDragActive && !isDragReject ? (
              "Drop a file to upload"
            ) : (
              "File not accepted, sorry!"
            )}
          </div>
        </section>
      )}
    </DZ>
  );
};

export default Dropzone;
