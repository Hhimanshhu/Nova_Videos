'use client';
import { useState } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  fileType?: 'video' | 'image';
}

const FileUpload = ({ onFileSelect, fileType = 'video' }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFileSelect(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded p-6 text-center cursor-pointer transition ${
        isDragging ? 'border-red-500 bg-red-50' : 'border-gray-300'
      }`}
    >
      <p className="text-gray-600 mb-2">Drag & Drop your file here</p>
      <p className="text-gray-500 mb-2">or</p>
      <label className="inline-block bg-red-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-red-600 transition">
        Browse Files
        <input
          type="file"
          accept={fileType === 'video' ? 'video/*' : 'image/*'}
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
    </div>
  );
};

export default FileUpload;





// "use client";

// import {
//     upload,
// } from "@imagekit/next";
// import { useState } from "react";

// interface FileUploadProps {
//     onSuccess: (res: any) => void;
//     onProgress: (progress: number) => void;
//     fileType?: "video" | "image";
// }

// const FileUpload = ({ onSuccess, onProgress, fileType }: FileUploadProps) => {
//     const [uploading, setUploading] = useState(false);
//     const [error, setError] = useState<string | null>(null);

//     const validateFile = (file: File) => {
//         if (fileType === "video" && !file.type.startsWith("video/")) {
//             throw new Error("Invalid file type for video upload");
//         }
//         if (fileType === "image" && !file.type.startsWith("image/")) {
//             throw new Error("Invalid file type for image upload");
//         }
//         if (file.size > 100 * 1024 * 1024) {
//             throw new Error("File size exceeds the limit of 100 MB");
//         }
//         return true;
//     };

//     const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
//         const file = event.target.files?.[0];
//         if (!file) {
//             setError("No file selected");
//             return;
//         }

//         try {
//             validateFile(file);
//         } catch (err: any) {
//             setError(err.message);
//             return;
//         }

//         setUploading(true);
//         setError(null);

//         try {
//             const authRes = await fetch("/api/auth/imagekit-auth");
//             const auth = await authRes.json();

//             const res = await upload({
//                 file,
//                 fileName: file.name,
//                 publicKey: auth.publicKey,  
//                 signature: auth.signature,
//                 expire: auth.expire,
//                 token: auth.token,
//                 onProgress: (event) => {
//                     if (event.lengthComputable) {
//                         const progress = Math.round((event.loaded * 100) / event.total);
//                         onProgress(progress);
//                     }
//                 },
//             });

//             onSuccess(res);
//         } catch (err) {
//             console.error("Upload failed:", err);
//             setError("Upload failed. Please try again.");
//         } finally {
//             setUploading(false);
//         }
//     };

//     return (
//         <>
//             <input
//                 type="file"
//                 accept={fileType === "video" ? "video/*" : "image/*"}
//                 onChange={handleFileChange}
//             />
//             {uploading && <p>Uploading...</p>}
//             {error && <p style={{ color: "red" }}>{error}</p>}
//         </>
//     );
// };

// export default FileUpload;


