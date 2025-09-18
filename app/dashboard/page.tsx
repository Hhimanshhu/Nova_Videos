'use client';
import ConfirmDialog from '../components/ConfirmDialog';
import { useCallback, useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';


interface Video {
    _id: string;
    title: string;
    description: string;
    url: string;
    thumbnailUrl: string;
    isPublic: boolean;
}

const DashboardPage = () => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(false);
    const [visibility, setVisibility] = useState<'all' | 'public' | 'private' | 'trash'>('all');
    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmAction, setConfirmAction] = useState<() => void>(() => { });
    const [confirmMessage, setConfirmMessage] = useState('');




    const handleTrash = (id: string) => {
        setConfirmMessage("Are you sure you want to move this video to trash?");
        setConfirmAction(() => async () => {
            try {
                const res = await fetch(`/api/video/${id}/trash`, { method: "PUT" });
                if (res.ok) {
                    toast.success("Moved to trash");
                    fetchMyVideos();
                } else {
                    const err = await res.json();
                    toast.error(err.error || "Failed to trash video");
                }
            } catch (err) {
                console.error("Trash error:", err);
            } finally {
                setShowConfirm(false);
            }
        });
        setShowConfirm(true);
    };


    const handleRestore = async (id: string) => {
        try {
            const res = await fetch(`/api/video/${id}/restore`, { method: 'PUT' });
            if (res.ok) {
                toast.success("Video restored successfully");
                fetchMyVideos();
            } else {
                const err = await res.json();
                toast.error(err.error || "Failed to restore video");
            }
        } catch (err) {
            console.error("Restore error:", err);
        }
    };

    const handleDelete = (id: string) => {
        setConfirmMessage("Are you sure you want to permanently delete this video?");
        setConfirmAction(() => async () => {
            try {
                const res = await fetch(`/api/video/${id}/delete`, { method: "DELETE" });
                if (res.ok) {
                    toast.success("Video deleted permanently");
                    fetchMyVideos();
                } else {
                    const err = await res.json();
                    toast.error(err.error || "Failed to delete video");
                }
            } catch (err) {
                console.error("Delete error:", err);
            } finally {
                setShowConfirm(false);
            }
        });
        setShowConfirm(true);
    };

    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchMyVideos = useCallback(async () => {
        setLoading(true);
        try {
            let url = `/api/video?filter=my&page=${page}&search=${searchTerm}`;
            if (visibility === 'public') url += `&visibility=public`;
            if (visibility === 'private') url += `&visibility=private`;
            if (visibility === 'trash') url += `&visibility=trash`;

            const res = await fetch(url);
            if (!res.ok) throw new Error('Failed to fetch videos');

            const data = await res.json();
            setVideos(data.videos); // expects { videos: [], totalPages }
            setTotalPages(data.totalPages);
        } catch (err) {
            console.error('Fetch videos failed:', err);
        } finally {
            setLoading(false);
        }
    }, [page, searchTerm, visibility]); // ✅ pass dependencies here




    useEffect(() => {
        fetchMyVideos();
    }, [fetchMyVideos]);






    return (
        <div className="p-6">
            {/* Header with Search + Filter */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
                <h2 className="text-2xl font-bold">My Uploads</h2>

                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="Search by title..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(1);
                        }}
                        className="border border-gray-300 dark:border-gray-700 p-2 rounded w-full sm:w-64 bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                    />

                    <select
                        value={visibility}
                        onChange={(e) => {
                            setVisibility(e.target.value as 'all' | 'public' | 'private' | 'trash');
                            setPage(1);
                        }}
                        className="border border-gray-300 dark:border-gray-700 p-2 rounded text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                    >
                        <option value="all">All</option>
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                        <option value="trash">Trash</option>
                    </select>
                </div>
            </div>

            {/* Loading or Empty States */}
            {loading ? (
                <p className="text-center">Loading...</p>
            ) : videos.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                    <p className="text-center text-gray-500">
                        {visibility === 'public'
                            ? 'No public videos found.'
                            : visibility === 'private'
                                ? 'No private videos found.'
                                : visibility === 'trash'
                                    ? 'Trash is empty.'
                                    : 'No videos uploaded yet.'}
                    </p>
                </div>
            ) : (
                <>
                    {/* Video Grid */}
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
                                />
                                <div className="p-2">
                                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white truncate">
                                        {video.title}
                                    </h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                                        {video.description}
                                    </p>
                                    <div className="flex justify-end mt-2">
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

                                {/* Actions */}
                                {visibility === 'trash' ? (
                                    <div className="flex justify-between px-2 pb-2">
                                        <button
                                            onClick={() => handleRestore(video._id)}
                                            className="text-green-600 hover:text-green-800 text-sm"
                                        >
                                            Restore
                                        </button>
                                        <button
                                            onClick={() => handleDelete(video._id)}
                                            className="text-red-600 hover:text-red-800 text-sm"
                                        >
                                            Delete Permanently
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handleTrash(video._id)}
                                        className="text-red-600 hover:text-red-800 ml-2 mb-2"
                                        title="Move to Trash"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-6 gap-2">
                            <button
                                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                                disabled={page === 1}
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded disabled:opacity-50"
                            >
                                Prev
                            </button>
                            <span className="px-4 py-2">
                                Page {page} of {totalPages}
                            </span>
                            <button
                                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                                disabled={page === totalPages}
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>

                    )}
                    {showConfirm && (
                        <ConfirmDialog
                            message={confirmMessage}
                            onConfirm={confirmAction}
                            onCancel={() => setShowConfirm(false)}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default DashboardPage;


