'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface Video {
  _id: string;
  title: string;
  description: string;
  url: string;
  thumbnailUrl: string;
}

export default function Home() {
  const { data: session } = useSession();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPublicVideos = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/video?filter=public');
      const data = await res.json();
      setVideos(data.videos || []);
    } catch (err) {
      console.error('Fetch public videos failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicVideos();
  }, []);

  return (
    <>
      {/* ✅ Hero Section with distinct background */}
      <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 text-white py-20 px-4 text-center shadow-inner">
        <h1 className="text-5xl font-extrabold mb-4">
          Welcome to <span className="text-red-500">VideoUploader</span>
        </h1>
        <p className="text-gray-300 max-w-xl mx-auto mb-6 text-lg">
          Upload videos, manage them smartly, and share with your audience — all in one place.
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
           {!session ? (
            <>
              <a
                href="/login"
                className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition-colors font-medium shadow"
              >
                Get Started
              </a>
          <a
            href="/dashboard"
            className="border border-gray-300 text-white px-6 py-2 rounded-full hover:bg-gray-600 transition-colors font-medium shadow"
          >
            View Dashboard
          </a>
          </>
          ) : (
            <a
              href="/dashboard"
              className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors"
            >
              View Dashboard
            </a>
             )}
        </div>
      </section>



      {/* ✅ Videos Section */}
      <section className="p-6 bg-gray-50 dark:bg-gray-900">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          Explore Public Videos
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : videos.length === 0 ? (
          <p className="text-center text-gray-500">No public videos available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div
                key={video._id}
                className="border rounded-lg shadow hover:shadow-lg transition bg-white dark:bg-gray-800 overflow-hidden"
              >
                <video
                  src={video.url}
                  poster={video.thumbnailUrl}
                  controls
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h4 className="font-semibold text-lg text-gray-800 dark:text-white truncate">
                    {video.title}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-300 truncate">
                    {video.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </>
  );
}
