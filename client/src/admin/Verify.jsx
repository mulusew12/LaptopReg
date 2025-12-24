import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../auth/Context';
import toast from 'react-hot-toast';
import { FaArrowLeft, FaEdit, FaTrash, FaCheckCircle, FaClock, FaHistory, FaLaptop, FaUser, FaPhone, FaEnvelope, FaShieldAlt, FaCalendarAlt, FaDownload, FaExclamation } from 'react-icons/fa';

const Verify = () => {
    const { lists, setLists, axios, updateDevice, deleteDevice, showDel, setShowDel } = useAppContext();
    const { id } = useParams();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [list, setList] = useState(null);
    const [loadingData, setLoadingData] = useState(true);
    const [pcStatusHistory, setPcStatusHistory] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [more, setMore] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(null);

    // ================= Helper function to normalize data =================
    const normalizeDeviceData = (device) => {
        if (!device) return null;

        return {
            ...device,
            // Ensure both forms exist for compatibility
            studentId: device.studentId || device.studentID || '',
            verified: device.verified || device.Verified || false,
            studentID: device.studentID || device.studentId || '',
            Verified: device.Verified || device.verified || false
        };
    };

    // ================= Format registration date =================
    const formatRegistrationDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        } catch (error) {
            return 'N/A';
        }
    };

    // ================= Initialize first IN status =================
    const initializeFirstInStatus = (device) => {
        if (!device) return;
        
        const numericId = Number(device.id);
        const savedHistory = JSON.parse(localStorage.getItem(`pcHistory_${numericId}`)) || [];
        
        // If no history exists, create initial IN status using registration date
        if (savedHistory.length === 0 && device.createdAt) {
            const firstInEntry = {
                status: 'in',
                timestamp: device.createdAt,
                actionBy: 'System',
                deviceId: numericId,
                deviceName: device.studentName || `Device ${device.id}`,
                note: 'Initial registration - Device marked as IN'
            };
            
            const initialHistory = [firstInEntry];
            setPcStatusHistory(initialHistory);
            localStorage.setItem(`pcHistory_${numericId}`, JSON.stringify(initialHistory));
            
            // Also update main PC status
            const pcStatus = JSON.parse(localStorage.getItem('pcStatus')) || {};
            pcStatus[numericId] = 'in';
            localStorage.setItem('pcStatus', JSON.stringify(pcStatus));
            
            setCurrentStatus('in');
            console.log('✅ Created initial IN status from registration date');
        } else if (savedHistory.length > 0) {
            setPcStatusHistory(savedHistory);
            
            // Get current status from the last entry
            const lastEntry = savedHistory[savedHistory.length - 1];
            setCurrentStatus(lastEntry?.status || 'in');
        }
    };

    // ================= Load PC Status from localStorage =================
    const loadPCStatus = () => {
        try {
            const pcStatus = JSON.parse(localStorage.getItem('pcStatus')) || {};
            return pcStatus;
        } catch (error) {
            console.error('Error loading PC status:', error);
            return {};
        }
    };

    // ================= Fetch Laptop Details =================
    useEffect(() => {
        const fetchLaptopDetails = async () => {
            try {
                setLoadingData(true);
                const numericId = Number(id);

                if (isNaN(numericId)) {
                    toast.error('Invalid laptop ID');
                    return;
                }

                // Try to fetch from backend first
                try {
                    const response = await axios.get(`/api/laptops/${numericId}`);
                    const normalizedData = normalizeDeviceData(response.data);
                    setList(normalizedData);
                    
                    // Initialize first IN status after setting list
                    setTimeout(() => {
                        initializeFirstInStatus(normalizedData);
                    }, 100);
                    
                } catch (apiError) {
                    console.log('API fetch failed, trying context data:', apiError);
                    // Fallback to context data
                    const deviceFromContext = lists.find(device => device.id === numericId);
                    if (deviceFromContext) {
                        const normalizedDevice = normalizeDeviceData(deviceFromContext);
                        setList(normalizedDevice);
                        
                        // Initialize first IN status after setting list
                        setTimeout(() => {
                            initializeFirstInStatus(normalizedDevice);
                        }, 100);
                    } else {
                        setList(null);
                    }
                }

            } catch (error) {
                console.error(error);
                toast.error('Failed to load laptop details');
            } finally {
                setLoadingData(false);
            }
        };

        if (id) fetchLaptopDetails();
    }, [id, axios, lists]);

    // ================= Update PC Status =================
    const updatePCStatus = (newStatus) => {
        if (!list) return;

        const numericId = Number(list.id);

        // Get current status
        const pcStatus = loadPCStatus();
        const currentStatus = pcStatus[numericId] || 'in';

        // Check if status is already the same
        if (currentStatus === newStatus) {
            toast(`Laptop is already ${newStatus.toUpperCase()}`, {
                icon: 'ℹ️',
                duration: 2000
            });
            return;
        }

        // Check if we need to add IN before OUT (can't go OUT without being IN first)
        const lastEntry = pcStatusHistory[pcStatusHistory.length - 1];
        const needsInBeforeOut = newStatus === 'out' && (!lastEntry || lastEntry.status === 'out');

        if (needsInBeforeOut) {
            toast.error('Cannot mark OUT without marking IN first');
            return;
        }

        // Create new status entry
        const newStatusEntry = {
            status: newStatus,
            timestamp: new Date().toISOString(),
            actionBy: 'Admin',
            deviceId: numericId,
            deviceName: list.studentName || `Device ${list.id}`,
            note: `Manually changed to ${newStatus.toUpperCase()}`
        };

        const updatedHistory = [...pcStatusHistory, newStatusEntry];
        setPcStatusHistory(updatedHistory);

        // Save history to localStorage
        localStorage.setItem(`pcHistory_${numericId}`, JSON.stringify(updatedHistory));

        // Update main PC status
        pcStatus[numericId] = newStatus;
        localStorage.setItem('pcStatus', JSON.stringify(pcStatus));

        // Update current status state
        setCurrentStatus(newStatus);

        toast.success(`Laptop marked as ${newStatus.toUpperCase()} successfully!`);
    };

    // ================= Get Latest Status Times =================
    const getLatestStatusTimes = () => {
        if (pcStatusHistory.length === 0) return { lastIn: null, lastOut: null, registrationDate: list?.createdAt || null };

        let lastIn = null;
        let lastOut = null;

        // Find the most recent IN and OUT entries
        pcStatusHistory.forEach(entry => {
            if (entry.status === 'in') {
                lastIn = entry.timestamp;
            } else if (entry.status === 'out') {
                lastOut = entry.timestamp;
            }
        });

        return { 
            lastIn, 
            lastOut, 
            registrationDate: list?.createdAt || null,
            firstIn: pcStatusHistory.length > 0 ? pcStatusHistory[0]?.timestamp : null
        };
    };

    // ================= Get Current Status =================
    const getCurrentStatus = () => {
        if (pcStatusHistory.length === 0) return 'in'; // Default to IN

        const lastEntry = pcStatusHistory[pcStatusHistory.length - 1];
        return lastEntry?.status || 'in';
    };

    // ================= Format Date =================
    const formatDateTime = (timestamp) => {
        if (!timestamp) return 'Never';
        try {
            const date = new Date(timestamp);
            return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        } catch (error) {
            return 'Invalid Date';
        }
    };

    // ================= Verify Laptop =================
    const handleVerify = async () => {
        if (!list) return;

        try {
            setIsLoading(true);
            const response = await axios.put(`/api/laptops/${list.id}/verify`);

            const normalizedDevice = normalizeDeviceData(response.data);

            const updatedLists = lists.map(item =>
                item.id === list.id ? normalizedDevice : item
            );

            setLists(updatedLists);
            setList(normalizedDevice);

            toast.success('Laptop verified successfully!');
        } catch (error) {
            console.error(error);
            toast.error('Failed to verify laptop');
        } finally {
            setIsLoading(false);
        }
    };

    // ================= Delete Laptop =================
    const handleDelete = async () => {
        if (!list) return;

        try {
            setIsLoading(true);
            // Use the deleteDevice function from context
            const success = await deleteDevice(list.id);

            if (success) {
                // Clean up localStorage
                localStorage.removeItem(`pcHistory_${list.id}`);
                const pcStatus = JSON.parse(localStorage.getItem('pcStatus')) || {};
                delete pcStatus[list.id];
                localStorage.setItem('pcStatus', JSON.stringify(pcStatus));

                toast.success('Laptop registration deleted successfully');
                navigate('/list');
            } else {
                toast.error('Failed to delete laptop');
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete laptop');
        } finally {
            setIsLoading(false);
        }
    };

    // ================= Edit Info =================
    const handleEditInfo = () => {
        // Navigate to edit page with the current device data
        navigate(`/edit/${list.id}`, { state: { device: list } });
    };

    // ================= Export History =================
    const handleExportHistory = () => {
        if (!list) return;

        const historyData = {
            laptop: list,
            statusHistory: pcStatusHistory,
            currentStatus: getCurrentStatus(),
            summary: {
                totalEntries: pcStatusHistory.length,
                registrationDate: list.createdAt,
                firstIn: pcStatusHistory.length > 0 ? pcStatusHistory[0]?.timestamp : null,
                lastIn: getLatestStatusTimes().lastIn,
                lastOut: getLatestStatusTimes().lastOut,
                generatedAt: new Date().toISOString(),
            }
        };

        const blob = new Blob([JSON.stringify(historyData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `laptop-${list.studentId || list.studentID}-history.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast.success('History exported successfully');
    };

    // ================= Loading Screen =================
    if (loadingData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
                        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="mt-6 text-lg font-medium text-gray-700">
                        Loading laptop details...
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        ID: {id}
                    </p>
                </div>
            </div>
        );
    }

    const { lastIn, lastOut, registrationDate, firstIn } = getLatestStatusTimes();
    const status = getCurrentStatus();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-25 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                        <div>
                            <button
                                onClick={() => navigate('/list')}
                                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4 transition-colors group"
                            >
                                <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                                Back to List
                            </button>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                                Laptop Verification Details
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Review, verify, and manage laptop registrations
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleEditInfo}
                                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
                            >
                                <FaEdit />
                                Edit Info
                            </button>
                            <div className="w-20 h-20 rounded-xl overflow-hidden border-4 border-white shadow-lg">
                                <img
                                    className="w-full h-full object-cover"
                                    src="/laptop.png"
                                    alt="Laptop"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Status Badge */}
                    {list && (
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-200">
                            <span className={`w-3 h-3 rounded-full ${(list.verified || list.Verified) ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                            <span className={`font-semibold ${(list.verified || list.Verified) ? 'text-green-700' : 'text-red-700'}`}>
                                {(list.verified || list.Verified) ? '✓ Verified' : '✗ Not Verified'}
                            </span>
                            <span className="text-gray-400">|</span>
                            <span className="text-gray-600">Student ID: <strong>{list.studentId || list.studentID}</strong></span>
                            <span className="text-gray-400">|</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${status === 'in' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                Status: {status.toUpperCase()}
                            </span>
                        </div>
                    )}
                </div>

                {list ? (
                    <div className="space-y-6">
                        {/* Main Card */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                            {/* Card Header */}
                            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">
                                            {list.studentName || 'Unknown User'}
                                        </h2>
                                        <p className="text-gray-600 mt-1">
                                            Laptop Registration Details
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={handleExportHistory}
                                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors"
                                        >
                                            <FaDownload />
                                            Export History
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Student Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                        <FaUser className="text-blue-600" />
                                        Student Information
                                    </h3>
                                    <div className="space-y-3">
                                        <InfoItem label="Full Name" value={list.studentName} />
                                        <InfoItem label="Student ID" value={list.studentId || list.studentID} />
                                        <InfoItem label="Phone" value={list.phone} icon={<FaPhone />} />
                                        <InfoItem label="Email" value={list.email} icon={<FaEnvelope />} />
                                    </div>
                                </div>

                                {/* Device Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                        <FaLaptop className="text-purple-600" />
                                        Device Information
                                    </h3>
                                    <div className="space-y-3">
                                        <InfoItem label="Serial Number" value={list.serialNumber} highlight />
                                        <InfoItem label="MAC Address" value={list.macAddress} highlight fontMono />
                                        <InfoItem label="Brand" value={list.laptopBrand} />
                                        <InfoItem label="Operating System" value={list.operatingSystem} />
                                    </div>
                                </div>

                                {/* Status & Security */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                        <FaShieldAlt className="text-green-600" />
                                        Status & Security
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-700">Verification Status</span>
                                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${(list.verified || list.Verified) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {(list.verified || list.Verified) ? 'Verified' : 'Pending'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-700">Antivirus</span>
                                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${list.antiVirusInstalled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {list.antiVirusInstalled ? 'Protected' : 'Unprotected'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-700">Registration Date</span>
                                                <span className="text-gray-900 font-medium flex items-center gap-1">
                                                    <FaCalendarAlt className="text-gray-500" />
                                                    {formatRegistrationDate(list.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* IN/OUT Tracking Section */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                            <FaHistory className="text-blue-600" />
                                            Device Tracking History
                                        </h3>
                                        <p className="text-gray-600 mt-1">
                                            Track when the laptop was checked IN/OUT. Status: <span className={`font-semibold ${status === 'in' ? 'text-green-600' : 'text-red-600'}`}>{status.toUpperCase()}</span>
                                        </p>
                                    </div>
                                    <div className="mt-2 md:mt-0">
                                        <div className="text-sm text-gray-600">
                                            Registered: <span className="font-medium">{formatRegistrationDate(registrationDate)}</span>
                                        </div>
                                        {firstIn && (
                                            <div className="text-sm text-gray-600 mt-1">
                                                First IN: <span className="font-medium">{formatDateTime(firstIn)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 pb-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    {/* IN Status Card */}
                                    <div className={`p-5 rounded-xl border ${status === 'in' ? 'border-green-300 bg-gradient-to-r from-green-50 to-emerald-50 ring-2 ring-green-200' : 'border-gray-200 bg-gray-50'}`}>
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-semibold text-gray-800">Mark as IN</h4>
                                            <div className="flex items-center gap-2">
                                                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                                                    IN
                                                </span>
                                                {status === 'in' && (
                                                    <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                                                        Current
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-green-50 rounded-lg flex items-center justify-center">
                                                <FaClock className="text-green-600 text-xl" />
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold text-gray-900">
                                                    {lastIn ? formatDateTime(lastIn).split(' ')[1] : '--:--'}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {lastIn ? formatDateTime(lastIn).split(' ')[0] : 'No IN record yet'}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => updatePCStatus('in')}
                                            disabled={status === 'in'}
                                            className={`w-full py-2.5 rounded-lg font-medium transition-all shadow-sm hover:shadow ${status === 'in'
                                                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                                    : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                                                }`}
                                        >
                                            {status === 'in' ? 'Currently IN' : 'Mark as IN'}
                                        </button>
                                        <p className="text-xs text-gray-500 mt-2 text-center">
                                            {status === 'in'
                                                ? 'Laptop is currently available'
                                                : 'Mark laptop as returned/available'}
                                        </p>
                                    </div>

                                    {/* OUT Status Card */}
                                    <div className={`p-5 rounded-xl border ${status === 'out' ? 'border-red-300 bg-gradient-to-r from-red-50 to-orange-50 ring-2 ring-red-200' : 'border-gray-200 bg-gray-50'}`}>
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-semibold text-gray-800">Mark as OUT</h4>
                                            <div className="flex items-center gap-2">
                                                <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                                                    OUT
                                                </span>
                                                {status === 'out' && (
                                                    <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                                                        Current
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-12 h-12 bg-gradient-to-r from-red-100 to-red-50 rounded-lg flex items-center justify-center">
                                                <FaClock className="text-red-600 text-xl" />
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold text-gray-900">
                                                    {lastOut ? formatDateTime(lastOut).split(' ')[1] : '--:--'}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {lastOut ? formatDateTime(lastOut).split(' ')[0] : 'No OUT record yet'}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => updatePCStatus('out')}
                                            disabled={status === 'out'}
                                            className={`w-full py-2.5 rounded-lg font-medium transition-all shadow-sm hover:shadow ${status === 'out'
                                                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                                    : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white'
                                                }`}
                                        >
                                            {status === 'out' ? 'Currently OUT' : 'Mark as OUT'}
                                        </button>
                                        <p className="text-xs text-gray-500 mt-2 text-center">
                                            {status === 'out'
                                                ? 'Laptop is currently checked out'
                                                : 'Mark laptop as checked out/taken'}
                                        </p>
                                    </div>
                                </div>

                                {/* Registration Info Card */}
                                {registrationDate && (
                                    <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <FaCalendarAlt className="text-blue-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-blue-800">Registration Information</h4>
                                                <p className="text-sm text-blue-600">
                                                    This device was registered on <span className="font-bold">{formatRegistrationDate(registrationDate)}</span>
                                                    {firstIn && ` and automatically marked as IN at that time.`}
                                                </p>
                                                <p className="text-xs text-blue-500 mt-1">
                                                   Student Name: {list.studentName}  |  Student ID: {list.studentId}  
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* History Table */}
                                {pcStatusHistory.length > 0 && (
                                    <div className="border-t border-gray-200 pb-6 pt-6 relative">
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="font-semibold text-gray-800">Status History</h4>
                                            <div className="text-sm text-gray-600">
                                                Total entries: {pcStatusHistory.length}
                                            </div>
                                        </div>
                                        <div className="overflow-hidden rounded-lg border border-gray-200">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action By</th>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time Ago</th>
                                                    </tr>
                                                </thead>

                                                {more ? (
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {[...pcStatusHistory].reverse().map((entry, index) => (
                                                            <tr key={index} className="hover:bg-gray-50">
                                                             
                                                                <td className="px-4 py-3">
                                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${entry.status === 'in' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                                        {entry.status.toUpperCase()}
                                                                    </span>
                                                                    {index === pcStatusHistory.length - 1 && entry.note === 'Initial registration - Device marked as IN' && (
                                                                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                                            Initial
                                                                        </span>
                                                                    )}
                                                                </td>
                                                                <td className="px-4 py-3 text-sm text-gray-900">
                                                                    {formatDateTime(entry.timestamp)}
                                                                </td>
                                                                <td className="px-4 py-3 text-sm text-gray-600">
                                                                    {entry.actionBy}
                                                                </td>
                                                                <td className="px-4 py-3 text-sm text-gray-500">
                                                                    {getTimeAgo(entry.timestamp)}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                ) : (
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {[...pcStatusHistory].slice(-5).reverse().map((entry, index) => (
                                                            <tr key={index} className="hover:bg-gray-50">
                                                              
                                                                <td className="px-4 py-3">
                                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${entry.status === 'in' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                                        {entry.status.toUpperCase()}
                                                                    </span>
                                                                    {index === 0 && entry.note === 'Initial registration - Device marked as IN' && (
                                                                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                                            Initial
                                                                        </span>
                                                                    )}
                                                                </td>
                                                                <td className="px-4 py-3 text-sm text-gray-900">
                                                                    {formatDateTime(entry.timestamp)}
                                                                </td>
                                                                <td className="px-4 py-3 text-sm text-gray-600">
                                                                    {entry.actionBy}
                                                                </td>
                                                                <td className="px-4 py-3 text-sm text-gray-500">
                                                                    {getTimeAgo(entry.timestamp)}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                )}
                                            </table>
                                        </div>
                                        {pcStatusHistory.length > 5 && (
                                            <div className='flex items-center justify-center mt-4 p-3'>
                                                {more ? (
                                                    <button
                                                        onClick={() => { setMore(false) }}
                                                        className='bg-blue-700 cursor-pointer transition hover:bg-blue-800 text-white py-2 px-6 rounded-lg font-medium'
                                                    >
                                                        Show Less
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => { setMore(true) }}
                                                        className='cursor-pointer hover:bg-blue-800 bg-blue-700 text-white py-2 px-6 rounded-lg font-medium'
                                                    >
                                                        Show All History ({pcStatusHistory.length} entries)
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Empty History State */}
                                {pcStatusHistory.length === 0 && (
                                    <div className="text-center py-8 border-t border-gray-200">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <FaHistory className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <h4 className="font-semibold text-gray-800 mb-2">No Status History Yet</h4>
                                        <p className="text-gray-600 mb-4">
                                            This device was registered on <span className="font-semibold">{formatRegistrationDate(registrationDate)}</span>.
                                            Mark the laptop as IN or OUT to start tracking.
                                        </p>
                                        <div className="flex justify-center gap-4">
                                            <button
                                                onClick={() => updatePCStatus('in')}
                                                className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                                            >
                                                Mark as IN
                                            </button>
                                            <button
                                                onClick={() => updatePCStatus('out')}
                                                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
                                            >
                                                Mark as OUT
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => navigate('/list')}
                                    className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 font-semibold rounded-xl transition-all shadow-sm hover:shadow"
                                >
                                    <FaArrowLeft />
                                    Back to List
                                </button>

                                <button
                                    onClick={()=>setShowDel(true)}
                                    disabled={isLoading}
                                    className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FaTrash />
                                    Delete Registration
                                </button>

                                {!(list.verified || list.Verified) ? (
                                    <button
                                        onClick={handleVerify}
                                        disabled={isLoading}
                                        className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Verifying...
                                            </>
                                        ) : (
                                            <>
                                                <FaCheckCircle />
                                                Verify Laptop
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <button
                                        disabled
                                        className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl opacity-70 cursor-not-allowed"
                                    >
                                        <FaCheckCircle />
                                        Already Verified
                                    </button>
                                )}
                            </div>

                            {showDel && (
                                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-1000 ">
                                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
                                        <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <FaExclamation className="text-white text-xl" />
                                        </div>
                                        <h3 className="text-xl font-bold text-center mb-2">Do you want to Delete?</h3>
                                        <p className="text-gray-600 text-center mb-4">
                                            This will permanently delete {list.studentName}'s laptop registration.
                                        </p>

                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => setShowDel(false)}
                                                className="flex-1 border border-gray-300 rounded-xl px-4 py-3 font-medium hover:bg-gray-50 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(list.id, e);
                                                    setShowDel(false)
                                                }}
                                                className="flex-1 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl px-4 py-3 font-medium hover:from-red-700 hover:to-red-600 transition-all shadow-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-yellow-300 max-w-2xl mx-auto">
                        <div className="w-16 h-16 bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-yellow-700 mb-2">
                            Laptop Not Found
                        </h2>
                        <p className="text-yellow-600 mb-6">
                            No laptop entry found with ID <strong className="bg-yellow-100 px-2 py-1 rounded">{id}</strong>
                        </p>
                        <button
                            onClick={() => navigate('/list')}
                            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold transition-all shadow-md hover:shadow-lg"
                        >
                            Back to List
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// Helper component for info items
const InfoItem = ({ label, value, icon, highlight = false, fontMono = false }) => (
    <div className={`p-3 rounded-lg border ${highlight ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
        <div className="text-xs text-gray-500 font-medium mb-1">{label}</div>
        <div className={`flex items-center gap-2 ${fontMono ? 'font-mono' : ''}`}>
            {icon}
            <span className="font-semibold text-gray-900 truncate">{value || 'N/A'}</span>
        </div>
    </div>
);

// Helper function to get time ago
const getTimeAgo = (timestamp) => {
    if (!timestamp) return '';

    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffMins > 0) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    return 'Just now';
};

export default Verify;