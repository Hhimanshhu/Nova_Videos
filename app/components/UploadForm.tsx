'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FileUpload from './FileUpload';


const UploadForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [isPublic, setIsPublic] = useState(true);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !videoUrl || !thumbnailUrl) {
      alert('Please upload video & thumbnail first, then fill all fields');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          url: videoUrl,
          thumbnailUrl,
          isPublic,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.error || 'Failed to upload');
        setLoading(false);
        return;
      }

      router.push('/dashboard');
    } catch (error) {
      console.error('Upload error:', error);
      alert('An error occurred during upload');
    } finally {
      setLoading(false);
    }
  };


  const handleUpload = async (file: File, type: 'video' | 'image') => {
    try {
      const authRes = await fetch('/api/auth/imagekit-auth');
      const auth = await authRes.json();

      const { upload } = await import('@imagekit/next');

      const uploadRes = await upload({
        file,
        fileName: file.name,
        publicKey: auth.publicKey,
        signature: auth.signature,
        expire: auth.expire,
        token: auth.token,
        onProgress: (event) => {
          console.log(`${type} Upload Progress:`, Math.round((event.loaded * 100) / event.total), '%');
        },
      });

      if (uploadRes.url) {
        if (type === 'video') {
          setVideoUrl(uploadRes.url);
        } else {
          setThumbnailUrl(uploadRes.url);
        }
      } else {
        throw new Error('Upload failed: No URL returned');
      }

    } catch (err) {
      console.error('Upload failed:', err);
      alert('Failed to upload file');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-8 border border-gray-200 dark:border-gray-700">
      {/* // <div className="max-w-xl mx-auto p-8 bg-white dark:bg-gray-900 rounded-lg shadow-lg mt-8"> */}
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        Upload Your Video
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Video Title"
          required
          className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Video Description"
          required
          rows={3}
          className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
        ></textarea>

        <div className="flex flex-col gap-2">
          <label className="font-semibold">Upload Video File</label>
          <div className="border rounded p-2">
            <FileUpload onFileSelect={(file) => handleUpload(file, 'video')} fileType="video" />
            {videoUrl && <p className="text-green-500 text-sm mt-1">✅ Video uploaded successfully!</p>}
          </div>
        </div>



        <div className="flex flex-col gap-2">
          <label className="font-semibold">Upload Thumbnail Image</label>
          <div className="border rounded p-2">
            <FileUpload onFileSelect={(file) => handleUpload(file, 'image')} fileType="image" />
            {thumbnailUrl && <p className="text-green-500 text-sm mt-1">✅ Thumbnail uploaded successfully!</p>}
          </div>
        </div>


        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={() => setIsPublic(!isPublic)}
            className="w-4 h-4"
          />
          <label>Make this video Public</label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-red-500 hover:bg-red-600 text-white py-2 rounded transition"
        >
          {loading ? 'Uploading...' : 'Submit'}
        </button>
      </form>
    </div>

    //     <div className="max-w-xl mx-auto p-6">
    //       <h2 className="text-2xl font-bold mb-4 text-center">Upload Video</h2>
    //       <form onSubmit={handleSubmit} className="flex flex-col gap-4">
    //         <input
    //           type="text"
    //           value={title}
    //           onChange={(e) => setTitle(e.target.value)}
    //           placeholder="Video Title"
    //           required
    //           className="border p-2 rounded"
    //         />
    //         <textarea
    //           value={description}
    //           onChange={(e) => setDescription(e.target.value)}
    //           placeholder="Video Description"
    //           required
    //           rows={3}
    //           className="border p-2 rounded"
    //         ></textarea>

    //         <div className="flex flex-col gap-1">
    //           <label className="font-semibold">Upload Video File</label>
    //           <div className="border rounded p-2">
    //             <FileUpload
    //               onSuccess={(res) => setVideoUrl(res.url)}
    //               onProgress={(progress) => console.log('Video Upload:', progress)}
    //               fileType="video"
    //             />
    //             {videoUrl && <p className="text-green-500 text-sm mt-1">✅ Video uploaded successfully!</p>}
    //           </div>
    //         </div>

    //         <div className="flex items-center gap-2">
    //   <input
    //     type="checkbox"
    //     checked={isPublic}
    //     onChange={() => setIsPublic(!isPublic)}
    //     className="w-4 h-4"
    //   />
    //   <label>Make this video Public</label>
    // </div>


    //         <div className="flex flex-col gap-1">
    //           <label className="font-semibold">Upload Thumbnail Image</label>
    //           <div className="border rounded p-2">
    //             <FileUpload
    //               onSuccess={(res) => setThumbnailUrl(res.url)}
    //               onProgress={(progress) => console.log('Thumbnail Upload:', progress)}
    //               fileType="image"
    //             />
    //             {thumbnailUrl && <p className="text-green-500 text-sm mt-1">✅ Thumbnail uploaded successfully!</p>}
    //           </div>
    //         </div>

    //         <button
    //           type="submit"
    //           disabled={loading}
    //           className="bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
    //         >
    //           {loading ? 'Uploading...' : 'Submit'}
    //         </button>
    //       </form>
    //     </div>
  );
};

export default UploadForm;
