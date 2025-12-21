import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../auth/Context';
import toast from 'react-hot-toast';
import { assets } from '../assets/assets';

const Verify = () => {
    const { lists, setLists, axios } = useAppContext();
    const { id } = useParams();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [list, setList] = useState(null);
    const [loadingData, setLoadingData] = useState(true);

    // ================= Fetch Laptop =================
    useEffect(() => {
        const fetchLaptopDetails = async () => {
            try {
                setLoadingData(true);
                const numericId = Number(id);

                if (isNaN(numericId)) {
                    toast.error('Invalid laptop ID');
                    return;
                }

                const response = await axios.get(`/api/laptops/${numericId}`);
                setList(response.data || null);
            } catch (error) {
                console.error(error);
                toast.error('Failed to load laptop details');
            } finally {
                setLoadingData(false);
            }
        };

        if (id) fetchLaptopDetails();
    }, [id, axios]);

    // ================= Verify =================
    const handleVerify = async () => {
        if (!list) return;

        try {
            setIsLoading(true);
            const response = await axios.put(`/api/laptops/${list.id}/verify`);

            const updatedLists = lists.map(item =>
                item.id === list.id ? response.data : item
            );

            setLists(updatedLists);
            setList(response.data);

            toast.success('Laptop verified successfully!');
        } catch (error) {
            console.error(error);
            toast.error('Failed to verify laptop');
        } finally {
            setIsLoading(false);
        }
    };

    // ================= Delete =================
    const handleDelete = async () => {
        if (!list) return;

        if (!window.confirm('Are you sure you want to delete this laptop registration?')) {
            return;
        }

        try {
            setIsLoading(true);
            await axios.delete(`/api/laptops/${list.id}`);

            const updatedLists = lists.filter(item => item.id !== list.id);
            setLists(updatedLists);

            toast.success('Laptop registration deleted');
            navigate('/list');
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete laptop');
        } finally {
            setIsLoading(false);
        }
    };

    // ================= Loading Screen =================
    if (loadingData) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto" />
                    <p className="mt-4 text-slate-600 font-medium">
                        Loading laptop details...
                    </p>
                </div>
            </div>
        );
    }

    // ================= UI =================
    return (
        <div className="min-h-screen  py-26 md:py-26 bg-green-100">
            {/* Header */}
            <div className='flex max-w-7xl mx-auto justify-between mb-8'>
                <div className="max-w-7xl  mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                        💻 Laptop Verification
                    </h1>
                    <p className="text-slate-600 mt-1">
                        Review and verify student laptop registrations
                    </p>
                </div>
                <div>
                      <img className='w-50 h-30 border' src="/laptop.png" alt="" />
                </div>
            </div>

            {list ? (
                <div className=" mx-auto bg-white rounded-2xl shadow-lg border border-slate-200">
                    {/* Card Header */}
                    <div className="px-6 md:px-8 py-6 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <h2 className="text-xl md:text-2xl font-semibold text-slate-800">
                            Student ID:
                            <span className="ml-2 px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold">
                                {list.studentId?.toUpperCase() || 'N/A'}
                            </span>
                        </h2>

                        <span
                            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold ${list.verified
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                                }`}
                        >
                            {list.verified ? 'Verified ✅' : 'Not Verified ❌'}
                        </span>
                    </div>

                    {/* Details */}
                    <div className="px-6 md:px-8 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            ['Student Name', list.studentName],
                            ['Student ID', list.studentId],
                            ['Serial Number', list.serialNumber],
                            ['MAC Address', list.macAddress],
                            ['Laptop Brand', list.laptopBrand],
                            ['Operating System', list.operatingSystem],
                            ['Phone', list.phone || 'N/A'],
                            ['Email', list.email || 'N/A'],
                            [
                                'Registered On',
                                list.createdAt
                                    ? new Date(list.createdAt).toLocaleDateString()
                                    : 'N/A',
                            ],
                        ].map(([label, value]) => (
                            <div
                                key={label}
                                className="bg-slate-50 rounded-xl p-4 border border-slate-200"
                            >
                                <p className="text-xs uppercase tracking-wide text-slate-500 font-medium">
                                    {label}
                                </p>
                                <p className="text-lg font-semibold text-slate-800 mt-1">
                                    {value}
                                </p>
                            </div>
                        ))}

                        {/* Antivirus */}
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                            <p className="text-xs uppercase tracking-wide text-slate-500 font-medium">
                                Antivirus Status
                            </p>
                            <p
                                className={`text-lg font-bold mt-1 ${list.antiVirusInstalled
                                        ? 'text-green-600'
                                        : 'text-red-600'
                                    }`}
                            >
                                {list.antiVirusInstalled
                                    ? 'Installed 🛡️'
                                    : 'Not Installed ⚠️'}
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="px-6 md:px-8 py-6 border-t bg-slate-50 flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => navigate('/list')}
                            disabled={isLoading}
                            className="flex-1 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold transition disabled:opacity-50"
                        >
                            ← Back to List
                        </button>

                        <button
                            onClick={handleDelete}
                            disabled={isLoading}
                            className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition disabled:opacity-50"
                        >
                            Delete
                        </button>

                        {!list.verified ? (
                            <button
                                onClick={handleVerify}
                                disabled={isLoading}
                                className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition disabled:opacity-50"
                            >
                                {isLoading ? 'Verifying...' : 'Verify Laptop'}
                            </button>
                        ) : (
                            <button
                                disabled
                                className="flex-1 py-3 rounded-xl bg-green-600 text-white font-semibold opacity-70 cursor-not-allowed"
                            >
                                Already Verified
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8 text-center border border-yellow-300">
                    <h2 className="text-2xl font-bold text-yellow-700 mb-2">
                        Laptop Not Found
                    </h2>
                    <p className="text-yellow-600 mb-6">
                        No laptop entry found with ID <strong>{id}</strong>
                    </p>
                    <button
                        onClick={() => navigate('/list')}
                        className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                    >
                        Back to List
                    </button>
                </div>
            )}
        </div>
    );
};

export default Verify;
