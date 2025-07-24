'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface Video {
  _id: string;
  title: string;
  description: string;
  url: string;
  thumbnailUrl: string;
  isPublic: boolean;
}

const DashboardPage = () => {
  const { data: session } = useSession();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMyVideos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/video?filter=my`);
      if (!res.ok) throw new Error('Failed to fetch videos');
      const data = await res.json();
      setVideos(data);
    } catch (err) {
      console.error('Fetch videos failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyVideos();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Uploads</h2>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : videos.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-center text-gray-500">No videos uploaded yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div
              key={video._id}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow hover:shadow-lg transition transform hover:-translate-y-1"
            >
              <video
                src={video.url}
                controls
                poster={video.thumbnailUrl}
                className="w-full h-48 object-cover rounded-t-lg"
              ></video>
              <div className="p-2">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white truncate">{video.title}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{video.description}</p>
                <div className="flex justify-end">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${video.isPublic
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                      }`}
                  >
                    {video.isPublic ? 'Public' : 'Private'}
                  </span>
                </div>
              </div>
            </div>
          ))}
            </div>
          )}
        </div>
      );
};

      export default DashboardPage;







// 'use client';
// import { useEffect, useState } from 'react';
// import { useSession } from 'next-auth/react';

// interface Video {
//   _id: string;
//   title: string;
//   description: string;
//   url: string;
//   thumbnailUrl: string;
//   isPublic: boolean;
// }

// const DashboardPage = () => {
//   const { data: session } = useSession();
//   const [videos, setVideos] = useState<Video[]>([]);
//   const [loading, setLoading] = useState(false);

//   const fetchMyVideos = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`/api/video?filter=my`);
//       if (!res.ok) throw new Error('Failed to fetch videos');
//       const data = await res.json();
//       setVideos(data);
//     } catch (err) {
//       console.error('Fetch videos failed:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMyVideos();
//   }, []);

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4">My Uploads</h2>

//       {loading ? (
//         <p className="text-center">Loading...</p>
//       ) : videos.length === 0 ? (
//         <div className="flex items-center justify-center h-64">
//           <p className="text-center text-gray-500">No videos uploaded yet.</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//           {videos.map((video) => (
//             <div
//               key={video._id}
//               className="border rounded shadow hover:shadow-lg transition"
//             >
//               <video
//                 src={video.url}
//                 controls
//                 className="w-full h-48 object-cover"
//               ></video>
//               <div className="p-2">
//                 <h4 className="font-semibold">{video.title}</h4>
//                 <p className="text-sm text-gray-500">{video.description}</p>
//                 <div className="flex justify-end">
//                   <span
//                     className={`text-xs font-semibold px-2 py-1 rounded ${video.isPublic
//                         ? 'bg-green-100 text-green-700'
//                         : 'bg-yellow-100 text-yellow-700'
//                       }`}
//                   >
//                     {video.isPublic ? 'Public' : 'Private'}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           ))}
//             </div>
//           )}
//         </div>
//       );
// };

//       export default DashboardPage;


