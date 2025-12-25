import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../auth/Context';
import toast from 'react-hot-toast';
import { 
  FaArrowLeft, FaEdit, FaTrash, FaCheckCircle, FaClock, FaHistory, 
  FaLaptop, FaUser, FaPhone, FaEnvelope, FaShieldAlt, FaCalendarAlt, 
  FaDownload, FaExclamation 
} from 'react-icons/fa';

const Verify = () => {
    const { lists, setLists, axios, updateDevice, deleteDevice, showDel, setShowDel, isDarkMode } = useAppContext();
    const { id } = useParams();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [list, setList] = useState(null);
    const [loadingData, setLoadingData] = useState(true);
    const [pcStatusHistory, setPcStatusHistory] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [more, setMore] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(null);
    const [confirm, setConfirm] = useState(false);
    const [confirmIn, setConfirmIn] = useState(false);

    // ================= THEME CONFIGURATION =================
    const theme = {
        bg: isDarkMode 
            ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900/50' 
            : 'bg-gradient-to-br from-gray-50 to-blue-50',
        text: isDarkMode ? 'text-gray-100' : 'text-gray-900',
        textSecondary: isDarkMode ? 'text-gray-400' : 'text-gray-600',
        border: isDarkMode ? 'border-gray-700' : 'border-gray-200',
        cardBg: isDarkMode ? 'bg-gray-800/95' : 'bg-white/95',
        inputBg: isDarkMode ? 'bg-gray-700/50' : 'bg-white/90',
        inputBorder: isDarkMode ? 'border-gray-600' : 'border-gray-300',
        hover: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
        shadow: isDarkMode ? 'shadow-xl shadow-black/30' : 'shadow-xl shadow-gray-200/50',
        successBg: isDarkMode ? 'bg-green-900/30' : 'bg-gradient-to-r from-green-50 to-emerald-50',
        successBorder: isDarkMode ? 'border-green-800' : 'border-green-200',
        errorBg: isDarkMode ? 'bg-red-900/30' : 'bg-gradient-to-r from-red-50 to-red-100',
        errorBorder: isDarkMode ? 'border-red-800' : 'border-red-200',
        warningBg: isDarkMode ? 'bg-amber-900/30' : 'bg-gradient-to-r from-amber-50 to-orange-50',
        warningBorder: isDarkMode ? 'border-amber-800' : 'border-amber-200',
        infoBg: isDarkMode ? 'bg-blue-900/30' : 'bg-gradient-to-r from-blue-50 to-indigo-50',
        infoBorder: isDarkMode ? 'border-blue-800' : 'border-blue-200',
        gradientHeader: isDarkMode 
            ? 'bg-gradient-to-r from-gray-800 to-gray-900' 
            : 'bg-gradient-to-r from-gray-50 to-blue-50',
        gradientPrimary: isDarkMode 
            ? 'bg-gradient-to-r from-blue-700 to-blue-600' 
            : 'bg-gradient-to-r from-blue-600 to-blue-500',
        gradientSuccess: isDarkMode 
            ? 'bg-gradient-to-r from-green-700 to-green-600' 
            : 'bg-gradient-to-r from-green-600 to-emerald-600',
        gradientDanger: isDarkMode 
            ? 'bg-gradient-to-r from-red-700 to-red-600' 
            : 'bg-gradient-to-r from-red-600 to-red-500',
        gradientWarning: isDarkMode 
            ? 'bg-gradient-to-r from-amber-700 to-amber-600' 
            : 'bg-gradient-to-r from-amber-500 to-amber-600',
    };

    // ================= Helper function to normalize data =================
    const normalizeDeviceData = (device) => {
        if (!device) return null;

        return {
            ...device,
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

    // ================= TOAST THEME =================
    const showToast = (message, type = 'success') => {
        const toastStyle = {
            style: {
                background: isDarkMode ? '#1f2937' : '#fff',
                color: isDarkMode ? '#fff' : '#000',
                border: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
            },
        };

        if (type === 'success') {
            toast.success(message, toastStyle);
        } else if (type === 'error') {
            toast.error(message, toastStyle);
        } else {
            toast(message, { ...toastStyle, icon: 'ℹ️' });
        }
    };

    // ================= Fetch Laptop Details =================
    useEffect(() => {
        const fetchLaptopDetails = async () => {
            try {
                setLoadingData(true);
                const numericId = Number(id);

                if (isNaN(numericId)) {
                    showToast('Invalid laptop ID', 'error');
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
                showToast('Failed to load laptop details', 'error');
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
            showToast(`Laptop is already ${newStatus.toUpperCase()}`, 'info');
            return;
        }

        // Check if we need to add IN before OUT (can't go OUT without being IN first)
        const lastEntry = pcStatusHistory[pcStatusHistory.length - 1];
        const needsInBeforeOut = newStatus === 'out' && (!lastEntry || lastEntry.status === 'out');

        if (needsInBeforeOut) {
            showToast('Cannot mark OUT without marking IN first', 'error');
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

        showToast(`Laptop marked as ${newStatus.toUpperCase()} successfully!`);
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

            showToast('Laptop verified successfully!');
        } catch (error) {
            console.error(error);
            showToast('Failed to verify laptop', 'error');
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

                showToast('Laptop deleted successfully');
                navigate('/list');
            } else {
                showToast('Failed to delete laptop', 'error');
            }
        } catch (error) {
            console.error(error);
            showToast('Failed to delete laptop', 'error');
        } finally {
            setIsLoading(false);
        }
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

        showToast('History exported successfully');
    };

    // ================= Loading Screen =================
    if (loadingData) {
        return (
            <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${theme.bg}`}>
                <div className="text-center">
                    <div className="relative">
                        <div className={`w-16 h-16 border-4 rounded-full ${
                            isDarkMode ? 'border-blue-800' : 'border-blue-200'
                        }`}></div>
                        <div className={`absolute top-0 left-0 w-16 h-16 border-4 border-t-transparent rounded-full animate-spin ${
                            isDarkMode ? 'border-blue-500' : 'border-blue-600'
                        }`}></div>
                    </div>
                    <p className={`mt-6 text-lg font-medium ${theme.text}`}>
                        Loading laptop details...
                    </p>
                    <p className={`text-sm mt-2 ${theme.textSecondary}`}>
                        ID: {id}
                    </p>
                </div>
            </div>
        );
    }

    const { lastIn, lastOut, registrationDate, firstIn } = getLatestStatusTimes();
    const status = getCurrentStatus();

    // Helper component for info items
    const InfoItem = ({ label, value, icon, highlight = false, fontMono = false }) => (
        <div className={`p-3 rounded-lg border ${
            highlight 
                ? isDarkMode 
                    ? 'border-blue-800 bg-blue-900/30' 
                    : 'border-blue-200 bg-blue-50'
                : isDarkMode 
                    ? 'border-gray-700 bg-gray-900/30' 
                    : 'border-gray-200 bg-gray-50'
        }`}>
            <div className={`text-xs font-medium mb-1 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>{label}</div>
            <div className={`flex items-center gap-2 ${fontMono ? 'font-mono' : ''}`}>
                {icon}
                <span className={`font-semibold truncate ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-900'
                }`}>{value || 'N/A'}</span>
            </div>
        </div>
    );

    return (
        <div className={`min-h-screen py-25 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${theme.bg}`}>
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                        <div>
                            <button
                                onClick={() => navigate('/list')}
                                className={`inline-flex items-center gap-2 font-medium mb-4 transition-colors group ${
                                    isDarkMode 
                                        ? 'text-blue-400 hover:text-blue-300' 
                                        : 'text-blue-600 hover:text-blue-700'
                                }`}
                            >
                                <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                                Back to List
                            </button>
                            <h1 className={`text-3xl md:text-4xl font-extrabold mb-2 ${
                                isDarkMode ? 'text-gray-100' : 'text-gray-900'
                            }`}>
                                Laptop Verification Details
                            </h1>
                            <p className={theme.textSecondary}>
                                Review, verify, and manage laptop registrations
                            </p>
                        </div>
                    </div>

                    {/* Status Badge */}
                    {list && (
                        <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-xl shadow-sm border ${
                            isDarkMode 
                                ? 'bg-gray-800/50 border-gray-700' 
                                : 'bg-white border-gray-200'
                        }`}>
                            <span className={`w-3 h-3 rounded-full ${
                                (list.verified || list.Verified) 
                                    ? 'bg-green-500 animate-pulse' 
                                    : 'bg-red-500'
                            }`}></span>
                            <span className={`font-semibold ${
                                (list.verified || list.Verified) 
                                    ? isDarkMode ? 'text-green-400' : 'text-green-700'
                                    : isDarkMode ? 'text-red-400' : 'text-red-700'
                            }`}>
                                {(list.verified || list.Verified) ? '✓ Verified' : '✗ Not Verified'}
                            </span>
                            <span className={isDarkMode ? 'text-gray-600' : 'text-gray-400'}>|</span>
                            <span className={theme.textSecondary}>
                                Student ID: <strong>{list.studentId || list.studentID}</strong>
                            </span>
                            <span className={isDarkMode ? 'text-gray-600' : 'text-gray-400'}>|</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                status === 'in' 
                                    ? isDarkMode 
                                        ? 'bg-green-900/30 text-green-300' 
                                        : 'bg-green-100 text-green-800'
                                    : isDarkMode 
                                        ? 'bg-red-900/30 text-red-300' 
                                        : 'bg-red-100 text-red-800'
                            }`}>
                                Status: {status.toUpperCase()}
                            </span>
                        </div>
                    )}
                </div>

                {list ? (
                    <div className="space-y-6">
                        {/* Main Card */}
                        <div className={`rounded-2xl border overflow-hidden ${theme.border} ${theme.shadow} ${theme.cardBg}`}>
                            {/* Card Header */}
                            <div className={`p-6 border-b ${theme.border} ${theme.gradientHeader}`}>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h2 className={`text-xl font-bold ${
                                            isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                        }`}>
                                            {list.studentName || 'Unknown User'}
                                        </h2>
                                        <p className={theme.textSecondary}>
                                            Laptop Registration Details
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={handleExportHistory}
                                            className={`flex items-center gap-2 px-4 py-2 border rounded-lg font-medium transition-colors ${
                                                isDarkMode 
                                                    ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-700 text-gray-300' 
                                                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700'
                                            }`}
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
                                    <h3 className={`text-lg font-semibold flex items-center gap-2 ${
                                        isDarkMode ? 'text-gray-200' : 'text-gray-800'
                                    }`}>
                                        <FaUser className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
                                        Student Information
                                    </h3>
                                    <div className="space-y-3">
                                        <InfoItem label="Full Name" value={list.studentName} />
                                        <InfoItem label="Student ID" value={list.studentId || list.studentID} />
                                        <InfoItem 
                                            label="Phone" 
                                            value={list.phone} 
                                            icon={<FaPhone className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />} 
                                        />
                                        <InfoItem 
                                            label="Email" 
                                            value={list.email} 
                                            icon={<FaEnvelope className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />} 
                                        />
                                    </div>
                                </div>

                                {/* Device Information */}
                                <div className="space-y-4">
                                    <h3 className={`text-lg font-semibold flex items-center gap-2 ${
                                        isDarkMode ? 'text-gray-200' : 'text-gray-800'
                                    }`}>
                                        <FaLaptop className={isDarkMode ? 'text-purple-400' : 'text-purple-600'} />
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
                                    <h3 className={`text-lg font-semibold flex items-center gap-2 ${
                                        isDarkMode ? 'text-gray-200' : 'text-gray-800'
                                    }`}>
                                        <FaShieldAlt className={isDarkMode ? 'text-green-400' : 'text-green-600'} />
                                        Status & Security
                                    </h3>
                                    <div className="space-y-3">
                                        <div className={`p-3 rounded-lg border ${
                                            isDarkMode 
                                                ? `${theme.infoBg} ${theme.infoBorder}` 
                                                : `${theme.infoBg} ${theme.infoBorder}`
                                        }`}>
                                            <div className="flex items-center justify-between">
                                                <span className={theme.textSecondary}>Verification Status</span>
                                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                                    (list.verified || list.Verified) 
                                                        ? isDarkMode 
                                                            ? 'bg-green-900/30 text-green-300' 
                                                            : 'bg-green-100 text-green-800'
                                                        : isDarkMode 
                                                            ? 'bg-red-900/30 text-red-300' 
                                                            : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {(list.verified || list.Verified) ? 'Verified' : 'Pending'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className={`p-3 rounded-lg border ${
                                            isDarkMode 
                                                ? `${theme.infoBg} ${theme.infoBorder}` 
                                                : `${theme.infoBg} ${theme.infoBorder}`
                                        }`}>
                                            <div className="flex items-center justify-between">
                                                <span className={theme.textSecondary}>Antivirus</span>
                                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                                    list.antiVirusInstalled 
                                                        ? isDarkMode 
                                                            ? 'bg-green-900/30 text-green-300' 
                                                            : 'bg-green-100 text-green-800'
                                                        : isDarkMode 
                                                            ? 'bg-red-900/30 text-red-300' 
                                                            : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {list.antiVirusInstalled ? 'Protected' : 'Unprotected'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className={`p-3 rounded-lg border ${
                                            isDarkMode 
                                                ? `${theme.infoBg} ${theme.infoBorder}` 
                                                : `${theme.infoBg} ${theme.infoBorder}`
                                        }`}>
                                            <div className="flex items-center justify-between">
                                                <span className={theme.textSecondary}>Registration Date</span>
                                                <span className={`font-medium flex items-center gap-1 ${
                                                    isDarkMode ? 'text-gray-200' : 'text-gray-900'
                                                }`}>
                                                    <FaCalendarAlt className={isDarkMode ? 'text-gray-500' : 'text-gray-500'} />
                                                    {formatRegistrationDate(list.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* IN/OUT Tracking Section */}
                        <div className={`rounded-2xl border overflow-hidden ${theme.border} ${theme.shadow} ${theme.cardBg}`}>
                            <div className={`p-6 border-b ${theme.border} ${theme.gradientHeader}`}>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h3 className={`text-xl font-bold flex items-center gap-2 ${
                                            isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                        }`}>
                                            <FaHistory className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
                                            Device Tracking History
                                        </h3>
                                        <p className={theme.textSecondary}>
                                            Track when the laptop was checked IN/OUT. Status: 
                                            <span className={`font-semibold ml-1 ${
                                                status === 'in' 
                                                    ? isDarkMode ? 'text-green-400' : 'text-green-600'
                                                    : isDarkMode ? 'text-red-400' : 'text-red-600'
                                            }`}>
                                                {status.toUpperCase()}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="mt-2 md:mt-0">
                                        <div className={`text-sm ${theme.textSecondary}`}>
                                            Registered: 
                                            <span className={`font-medium ml-1 ${
                                                isDarkMode ? 'text-gray-300' : 'text-gray-900'
                                            }`}>
                                                {formatRegistrationDate(registrationDate)}
                                            </span>
                                        </div>
                                        {firstIn && (
                                            <div className={`text-sm mt-1 ${theme.textSecondary}`}>
                                                First IN: 
                                                <span className={`font-medium ml-1 ${
                                                    isDarkMode ? 'text-gray-300' : 'text-gray-900'
                                                }`}>
                                                    {formatDateTime(firstIn)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 pb-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    {/* IN Status Card */}
                                    <div className={`p-5 rounded-xl border ${
                                        status === 'in' 
                                            ? isDarkMode 
                                                ? 'border-green-700 bg-gradient-to-r from-green-900/30 to-emerald-900/30 ring-2 ring-green-800' 
                                                : 'border-green-300 bg-gradient-to-r from-green-50 to-emerald-50 ring-2 ring-green-200'
                                            : isDarkMode 
                                                ? 'border-gray-700 bg-gray-900/30' 
                                                : 'border-gray-200 bg-gray-50'
                                    }`}>
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className={`font-semibold ${
                                                isDarkMode ? 'text-gray-200' : 'text-gray-800'
                                            }`}>
                                                Mark as IN
                                            </h4>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                                                    isDarkMode 
                                                        ? 'bg-green-900/30 text-green-300' 
                                                        : 'bg-green-100 text-green-800'
                                                }`}>
                                                    IN
                                                </span>
                                                {status === 'in' && (
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                        isDarkMode 
                                                            ? 'bg-green-600 text-white' 
                                                            : 'bg-green-500 text-white'
                                                    }`}>
                                                        Current
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                                isDarkMode 
                                                    ? 'bg-gradient-to-r from-green-900/30 to-green-800/30' 
                                                    : 'bg-gradient-to-r from-green-100 to-green-50'
                                            }`}>
                                                <FaClock className={isDarkMode ? 'text-green-400' : 'text-green-600 text-xl'} />
                                            </div>
                                            <div>
                                                <div className={`text-2xl font-bold ${
                                                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                                }`}>
                                                    {lastIn ? formatDateTime(lastIn).split(' ')[1] : '--:--'}
                                                </div>
                                                <div className={`text-sm ${theme.textSecondary}`}>
                                                    {lastIn ? formatDateTime(lastIn).split(' ')[0] : 'No IN record yet'}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setConfirmIn(true)}
                                            disabled={status === 'in'}
                                            className={`w-full py-2.5 rounded-lg font-medium transition-all shadow-sm hover:shadow ${
                                                status === 'in'
                                                    ? isDarkMode 
                                                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                                                        : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                                    : isDarkMode 
                                                        ? 'bg-gradient-to-r from-green-700 to-green-600 hover:from-green-600 hover:to-green-500 text-white' 
                                                        : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                                            }`}
                                        >
                                            {status === 'in' ? 'Currently IN' : 'Mark as IN'}
                                        </button>
                                        <p className={`text-xs mt-2 text-center ${
                                            isDarkMode ? 'text-gray-500' : 'text-gray-500'
                                        }`}>
                                            {status === 'in'
                                                ? 'Laptop is currently available'
                                                : 'Mark laptop as returned/available'}
                                        </p>
                                    </div>

                                    {/* OUT Status Card */}
                                    <div className={`p-5 rounded-xl border ${
                                        status === 'out' 
                                            ? isDarkMode 
                                                ? 'border-red-700 bg-gradient-to-r from-red-900/30 to-orange-900/30 ring-2 ring-red-800' 
                                                : 'border-red-300 bg-gradient-to-r from-red-50 to-orange-50 ring-2 ring-red-200'
                                            : isDarkMode 
                                                ? 'border-gray-700 bg-gray-900/30' 
                                                : 'border-gray-200 bg-gray-50'
                                    }`}>
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className={`font-semibold ${
                                                isDarkMode ? 'text-gray-200' : 'text-gray-800'
                                            }`}>
                                                Mark as OUT
                                            </h4>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                                                    isDarkMode 
                                                        ? 'bg-red-900/30 text-red-300' 
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    OUT
                                                </span>
                                                {status === 'out' && (
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                        isDarkMode 
                                                            ? 'bg-red-600 text-white' 
                                                            : 'bg-red-500 text-white'
                                                    }`}>
                                                        Current
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                                isDarkMode 
                                                    ? 'bg-gradient-to-r from-red-900/30 to-red-800/30' 
                                                    : 'bg-gradient-to-r from-red-100 to-red-50'
                                            }`}>
                                                <FaClock className={isDarkMode ? 'text-red-400' : 'text-red-600 text-xl'} />
                                            </div>
                                            <div>
                                                <div className={`text-2xl font-bold ${
                                                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                                }`}>
                                                    {lastOut ? formatDateTime(lastOut).split(' ')[1] : '--:--'}
                                                </div>
                                                <div className={`text-sm ${theme.textSecondary}`}>
                                                    {lastOut ? formatDateTime(lastOut).split(' ')[0] : 'No OUT record yet'}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setConfirm(true)}
                                            disabled={status === 'out'}
                                            className={`w-full py-2.5 rounded-lg font-medium transition-all shadow-sm hover:shadow ${
                                                status === 'out'
                                                    ? isDarkMode 
                                                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                                                        : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                                    : isDarkMode 
                                                        ? 'bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white' 
                                                        : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white'
                                            }`}
                                        >
                                            {status === 'out' ? 'Currently OUT' : 'Mark as OUT'}
                                        </button>
                                        <p className={`text-xs mt-2 text-center ${
                                            isDarkMode ? 'text-gray-500' : 'text-gray-500'
                                        }`}>
                                            {status === 'out'
                                                ? 'Laptop is currently checked out'
                                                : 'Mark laptop as checked out/taken'}
                                        </p>
                                    </div>
                                </div>

                                {/* Registration Info Card */}
                                {registrationDate && (
                                    <div className={`mb-6 p-4 rounded-xl border ${
                                        isDarkMode 
                                            ? `${theme.infoBg} ${theme.infoBorder}` 
                                            : `${theme.infoBg} ${theme.infoBorder}`
                                    }`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                                isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'
                                            }`}>
                                                <FaCalendarAlt className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
                                            </div>
                                            <div>
                                                <h4 className={`font-semibold ${
                                                    isDarkMode ? 'text-blue-300' : 'text-blue-800'
                                                }`}>
                                                    Registration Information
                                                </h4>
                                                <p className={`text-sm ${
                                                    isDarkMode ? 'text-blue-400' : 'text-blue-600'
                                                }`}>
                                                    This device was registered on <span className="font-bold">
                                                        {formatRegistrationDate(registrationDate)}
                                                    </span>
                                                    {firstIn && ` and automatically marked as IN at that time.`}
                                                </p>
                                                <p className={`text-xs mt-1 ${
                                                    isDarkMode ? 'text-blue-500' : 'text-blue-500'
                                                }`}>
                                                    Student Name: {list.studentName}  |  Student ID: {list.studentId}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* History Table */}
                                {pcStatusHistory.length > 0 && (
                                    <div className={`border-t pb-6 pt-6 relative ${
                                        isDarkMode ? 'border-gray-700' : 'border-gray-200'
                                    }`}>
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className={`font-semibold ${
                                                isDarkMode ? 'text-gray-200' : 'text-gray-800'
                                            }`}>
                                                Status History
                                            </h4>
                                            <div className={`text-sm ${theme.textSecondary}`}>
                                                Total entries: {pcStatusHistory.length}
                                            </div>
                                        </div>
                                        <div className="overflow-hidden rounded-lg border">
                                            <table className="min-w-full divide-y">
                                                <thead className={isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}>
                                                    <tr>
                                                        <th className={`px-4 py-3 text-left text-xs font-medium uppercase ${
                                                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                                        }`}>
                                                            Status
                                                        </th>
                                                        <th className={`px-4 py-3 text-left text-xs font-medium uppercase ${
                                                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                                        }`}>
                                                            Timestamp
                                                        </th>
                                                        <th className={`px-4 py-3 text-left text-xs font-medium uppercase ${
                                                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                                        }`}>
                                                            Action By
                                                        </th>
                                                        <th className={`px-4 py-3 text-left text-xs font-medium uppercase ${
                                                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                                        }`}>
                                                            Time Ago
                                                        </th>
                                                    </tr>
                                                </thead>

                                                {more ? (
                                                    <tbody className={isDarkMode ? 'bg-gray-800/50 divide-gray-700' : 'bg-white divide-gray-200'}>
                                                        {[...pcStatusHistory].reverse().map((entry, index) => (
                                                            <tr key={index} className={isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}>
                                                                <td className="px-4 py-3">
                                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                                        entry.status === 'in' 
                                                                            ? isDarkMode 
                                                                                ? 'bg-green-900/30 text-green-300' 
                                                                                : 'bg-green-100 text-green-800'
                                                                            : isDarkMode 
                                                                                ? 'bg-red-900/30 text-red-300' 
                                                                                : 'bg-red-100 text-red-800'
                                                                    }`}>
                                                                        {entry.status.toUpperCase()}
                                                                    </span>
                                                                    {index === pcStatusHistory.length - 1 && entry.note === 'Initial registration - Device marked as IN' && (
                                                                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                                                                            isDarkMode 
                                                                                ? 'bg-blue-900/30 text-blue-300' 
                                                                                : 'bg-blue-100 text-blue-800'
                                                                        }`}>
                                                                            Initial
                                                                        </span>
                                                                    )}
                                                                </td>
                                                                <td className={`px-4 py-3 text-sm ${
                                                                    isDarkMode ? 'text-gray-300' : 'text-gray-900'
                                                                }`}>
                                                                    {formatDateTime(entry.timestamp)}
                                                                </td>
                                                                <td className={`px-4 py-3 text-sm ${
                                                                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                                                }`}>
                                                                    {entry.actionBy}
                                                                </td>
                                                                <td className={`px-4 py-3 text-sm ${
                                                                    isDarkMode ? 'text-gray-500' : 'text-gray-500'
                                                                }`}>
                                                                    {getTimeAgo(entry.timestamp)}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                ) : (
                                                    <tbody className={isDarkMode ? 'bg-gray-800/50 divide-gray-700' : 'bg-white divide-gray-200'}>
                                                        {[...pcStatusHistory].slice(-5).reverse().map((entry, index) => (
                                                            <tr key={index} className={isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}>
                                                                <td className="px-4 py-3">
                                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                                        entry.status === 'in' 
                                                                            ? isDarkMode 
                                                                                ? 'bg-green-900/30 text-green-300' 
                                                                                : 'bg-green-100 text-green-800'
                                                                            : isDarkMode 
                                                                                ? 'bg-red-900/30 text-red-300' 
                                                                                : 'bg-red-100 text-red-800'
                                                                    }`}>
                                                                        {entry.status.toUpperCase()}
                                                                    </span>
                                                                    {index === 0 && entry.note === 'Initial registration - Device marked as IN' && (
                                                                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                                                                            isDarkMode 
                                                                                ? 'bg-blue-900/30 text-blue-300' 
                                                                                : 'bg-blue-100 text-blue-800'
                                                                        }`}>
                                                                            Initial
                                                                        </span>
                                                                    )}
                                                                </td>
                                                                <td className={`px-4 py-3 text-sm ${
                                                                    isDarkMode ? 'text-gray-300' : 'text-gray-900'
                                                                }`}>
                                                                    {formatDateTime(entry.timestamp)}
                                                                </td>
                                                                <td className={`px-4 py-3 text-sm ${
                                                                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                                                }`}>
                                                                    {entry.actionBy}
                                                                </td>
                                                                <td className={`px-4 py-3 text-sm ${
                                                                    isDarkMode ? 'text-gray-500' : 'text-gray-500'
                                                                }`}>
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
                                                        className={`py-2 px-6 rounded-lg font-medium transition-colors ${
                                                            isDarkMode 
                                                                ? 'bg-blue-700 hover:bg-blue-600 text-white' 
                                                                : 'bg-blue-700 hover:bg-blue-800 text-white'
                                                        }`}
                                                    >
                                                        Show Less
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => { setMore(true) }}
                                                        className={`py-2 px-6 rounded-lg font-medium transition-colors ${
                                                            isDarkMode 
                                                                ? 'bg-blue-700 hover:bg-blue-600 text-white' 
                                                                : 'bg-blue-700 hover:bg-blue-800 text-white'
                                                        }`}
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
                                    <div className={`text-center py-8 border-t ${
                                        isDarkMode ? 'border-gray-700' : 'border-gray-200'
                                    }`}>
                                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                                            isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                                        }`}>
                                            <FaHistory className={`w-8 h-8 ${
                                                isDarkMode ? 'text-gray-500' : 'text-gray-400'
                                            }`} />
                                        </div>
                                        <h4 className={`font-semibold mb-2 ${
                                            isDarkMode ? 'text-gray-200' : 'text-gray-800'
                                        }`}>
                                            No Status History Yet
                                        </h4>
                                        <p className={`mb-4 ${theme.textSecondary}`}>
                                            This device was registered on 
                                            <span className="font-semibold"> {formatRegistrationDate(registrationDate)}</span>.
                                            Mark the laptop as IN or OUT to start tracking.
                                        </p>
                                        <div className="flex justify-center gap-4">
                                            <button
                                                onClick={() => updatePCStatus('in')}
                                                className={`px-4 py-2 rounded-lg font-medium ${
                                                    isDarkMode 
                                                        ? 'bg-green-600 hover:bg-green-500 text-white' 
                                                        : 'bg-green-600 hover:bg-green-700 text-white'
                                                }`}
                                            >
                                                Mark as IN
                                            </button>
                                            <button
                                                onClick={() => updatePCStatus('out')}
                                                className={`px-4 py-2 rounded-lg font-medium ${
                                                    isDarkMode 
                                                        ? 'bg-red-600 hover:bg-red-500 text-white' 
                                                        : 'bg-red-600 hover:bg-red-700 text-white'
                                                }`}
                                            >
                                                Mark as OUT
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className={`rounded-2xl border p-6 ${theme.border} ${theme.shadow} ${theme.cardBg}`}>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => navigate('/list')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 font-semibold rounded-xl transition-all shadow-sm hover:shadow ${
                                        isDarkMode 
                                            ? 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-gray-300' 
                                            : 'bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800'
                                    }`}
                                >
                                    <FaArrowLeft />
                                    Back to List
                                </button>

                                <button
                                    onClick={() => setShowDel(true)}
                                    disabled={isLoading}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 font-semibold rounded-xl transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed ${
                                        isDarkMode 
                                            ? 'bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white' 
                                            : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white'
                                    }`}
                                >
                                    <FaTrash />
                                    Delete Registration
                                </button>

                                {!(list.verified || list.Verified) ? (
                                    <button
                                        onClick={handleVerify}
                                        disabled={isLoading}
                                        className={`flex-1 flex items-center justify-center gap-2 py-3.5 font-semibold rounded-xl transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed ${
                                            isDarkMode 
                                                ? 'bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white' 
                                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                                        }`}
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className={`w-5 h-5 border-2 border-t-transparent rounded-full animate-spin ${
                                                    isDarkMode ? 'border-white' : 'border-white'
                                                }`}></div>
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
                                        className={`flex-1 flex items-center justify-center gap-2 py-3.5 font-semibold rounded-xl opacity-70 cursor-not-allowed ${
                                            isDarkMode 
                                                ? 'bg-gradient-to-r from-green-700 to-emerald-700 text-white' 
                                                : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                                        }`}
                                    >
                                        <FaCheckCircle />
                                        Already Verified
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={`rounded-2xl p-8 text-center border max-w-2xl mx-auto ${
                        isDarkMode 
                            ? `${theme.cardBg} ${theme.border} border-yellow-700` 
                            : 'bg-white border-yellow-300 shadow-xl'
                    }`}>
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                            isDarkMode 
                                ? 'bg-gradient-to-r from-yellow-900/30 to-yellow-800/30' 
                                : 'bg-gradient-to-r from-yellow-100 to-yellow-50'
                        }`}>
                            <svg className={`w-8 h-8 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h2 className={`text-2xl font-bold mb-2 ${
                            isDarkMode ? 'text-yellow-400' : 'text-yellow-700'
                        }`}>
                            Laptop Not Found
                        </h2>
                        <p className={`mb-6 ${
                            isDarkMode ? 'text-yellow-300' : 'text-yellow-600'
                        }`}>
                            No laptop entry found with ID 
                            <strong className={`px-2 py-1 rounded ml-1 ${
                                isDarkMode ? 'bg-yellow-900/30' : 'bg-yellow-100'
                            }`}>
                                {id}
                            </strong>
                        </p>
                        <button
                            onClick={() => navigate('/list')}
                            className={`w-full py-3.5 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg ${
                                isDarkMode 
                                    ? 'bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white' 
                                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                            }`}
                        >
                            Back to List
                        </button>
                    </div>
                )}

                {/* Confirmation Modal for IN */}
                {confirmIn && (
                    <div className="fixed inset-0 flex items-center justify-center p-4 z-1000">
                        <div 
                            className={`absolute inset-0 ${
                                isDarkMode ? 'bg-black/70' : 'bg-black/40'
                            } backdrop-blur-sm`}
                            onClick={() => setConfirmIn(false)}
                        />
                        <div className={`relative rounded-xl shadow-xl max-w-sm w-full border overflow-hidden ${
                            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                        }`}>
                            <div className={`h-2 ${
                                isDarkMode 
                                    ? 'bg-gradient-to-r from-green-600 to-green-500' 
                                    : 'bg-gradient-to-r from-green-500 to-orange-500'
                            }`}></div>
                            <div className="p-6">
                                <div className="flex justify-center mb-4">
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                                        isDarkMode 
                                            ? 'bg-gradient-to-br from-green-900/30 to-emerald-900/30' 
                                            : 'bg-gradient-to-br from-red-50 to-orange-50'
                                    }`}>
                                        <svg className={`w-8 h-8 ${isDarkMode ? 'text-green-400' : 'text-green-500'}`} fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                <h3 className={`text-lg font-semibold text-center mb-2 ${
                                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                }`}>
                                    Update Status
                                </h3>
                                <p className={`text-center mb-6 ${
                                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                    Change status to 
                                    <span className={`font-medium ml-1 ${
                                        isDarkMode ? 'text-green-300' : 'text-green-600'
                                    }`}>
                                        "In"
                                    </span>?
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setConfirmIn(false)}
                                        className={`flex-1 py-2.5 px-4 font-medium rounded-lg transition-colors duration-150 ${
                                            isDarkMode 
                                                ? 'text-gray-300 bg-gray-700 hover:bg-gray-600' 
                                                : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                                        }`}
                                    >
                                        Go Back
                                    </button>
                                    <button
                                        onClick={() => { updatePCStatus('in'); setConfirmIn(false); }}
                                        className={`flex-1 py-2.5 px-4 text-white font-medium rounded-lg transition-colors duration-150 shadow-sm hover:shadow ${
                                            isDarkMode 
                                                ? 'bg-green-600 hover:bg-green-500' 
                                                : 'bg-green-500 hover:bg-green-600'
                                        }`}
                                    >
                                        Yes, Update
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Confirmation Modal for OUT */}
                {confirm && (
                    <div className="fixed inset-0 flex items-center justify-center p-4 z-1000">
                        <div 
                            className={`absolute inset-0 ${
                                isDarkMode ? 'bg-black/70' : 'bg-black/40'
                            } backdrop-blur-sm`}
                            onClick={() => setConfirm(false)}
                        />
                        <div className={`relative rounded-xl shadow-xl max-w-sm w-full border overflow-hidden ${
                            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                        }`}>
                            <div className={`h-2 ${
                                isDarkMode 
                                    ? 'bg-gradient-to-r from-red-600 to-red-500' 
                                    : 'bg-gradient-to-r from-red-500 to-orange-500'
                            }`}></div>
                            <div className="p-6">
                                <div className="flex justify-center mb-4">
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                                        isDarkMode 
                                            ? 'bg-gradient-to-br from-red-900/30 to-orange-900/30' 
                                            : 'bg-gradient-to-br from-red-50 to-orange-50'
                                    }`}>
                                        <svg className={`w-8 h-8 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                <h3 className={`text-lg font-semibold text-center mb-2 ${
                                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                }`}>
                                    Update Status
                                </h3>
                                <p className={`text-center mb-6 ${
                                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                    Change status to 
                                    <span className={`font-medium ml-1 ${
                                        isDarkMode ? 'text-red-300' : 'text-red-600'
                                    }`}>
                                        "Out"
                                    </span>?
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setConfirm(false)}
                                        className={`flex-1 py-2.5 px-4 font-medium rounded-lg transition-colors duration-150 ${
                                            isDarkMode 
                                                ? 'text-gray-300 bg-gray-700 hover:bg-gray-600' 
                                                : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                                        }`}
                                    >
                                        Go Back
                                    </button>
                                    <button
                                        onClick={() => { updatePCStatus('out'); setConfirm(false); }}
                                        className={`flex-1 py-2.5 px-4 text-white font-medium rounded-lg transition-colors duration-150 shadow-sm hover:shadow ${
                                            isDarkMode 
                                                ? 'bg-red-600 hover:bg-red-500' 
                                                : 'bg-red-500 hover:bg-red-600'
                                        }`}
                                    >
                                        Yes, Update
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDel && (
                    <div className="fixed inset-0 flex items-center justify-center p-4 z-1000">
                        <div 
                            className={`absolute inset-0 ${
                                isDarkMode ? 'bg-black/70' : 'bg-black/40'
                            } backdrop-blur-sm`}
                            onClick={() => setShowDel(false)}
                        />
                        <div className={`relative rounded-2xl p-6 max-w-sm w-full shadow-2xl border ${
                            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                        }`}>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
                                isDarkMode 
                                    ? 'bg-gradient-to-br from-amber-700 to-amber-800' 
                                    : 'bg-gradient-to-br from-amber-500 to-amber-600'
                            }`}>
                                <FaExclamation className="text-white text-xl" />
                            </div>
                            <h3 className={`text-xl font-bold text-center mb-2 ${
                                isDarkMode ? 'text-gray-100' : 'text-gray-900'
                            }`}>
                                Do you want to Delete?
                            </h3>
                            <p className={`text-center mb-4 ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                                This will permanently delete {list?.studentName}'s laptop registration.
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDel(false)}
                                    className={`flex-1 border rounded-xl px-4 py-3 font-medium transition-colors ${
                                        isDarkMode 
                                            ? 'border-gray-600 hover:bg-gray-700 text-gray-300' 
                                            : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                                    }`}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        handleDelete();
                                        setShowDel(false);
                                    }}
                                    className={`flex-1 rounded-xl px-4 py-3 font-medium transition-all shadow-sm hover:shadow ${
                                        isDarkMode 
                                            ? 'bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white' 
                                            : 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white'
                                    }`}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

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