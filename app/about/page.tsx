'use client';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6 py-12 text-gray-800 dark:text-gray-100">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4 text-red-500">About VideoUploader</h1>
        <p className="text-lg mb-8">
          <span className="font-semibold">VideoUploader</span> is a modern web application that allows users to upload,
          manage, and share videos with ease. Designed with a Modern UI's, secure authentication, and cloud-based file handling,
          it empowers creators to showcase their work effortlessly.
        </p>

        <div className="text-left space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2 text-red-400">🌟 Features:</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Secure login and registration with NextAuth</li>
              <li>Drag-and-drop video and thumbnail uploading via ImageKit</li>
              <li>Public/private visibility settings for each video</li>
              <li>Personal dashboard to view your uploaded content</li>
              <li>Responsive design with TailwindCSS</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2 text-red-400">⚙️ Technologies Used:</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Next.js 13 (App Router)</li>
              <li>Tailwind CSS</li>
              <li>MongoDB + Mongoose</li>
              <li>NextAuth for authentication</li>
              <li>ImageKit for cloud uploads</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2 text-red-400">👨‍💻 Developer Note:</h2>
            <p>
              This project is actively maintained and built with 👩🏻‍💻📓✍🏻💡 by <strong>Himanshu Magar</strong>. 
              Feel free to suggest features or report issues via GitHub or contact himanshumagar1030@gmail.com.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
