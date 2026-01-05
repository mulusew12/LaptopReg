import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../auth/Context';
import { useNavigate } from 'react-router-dom';
import {
  FaExclamation,
  FaSearch,
  FaCopy,
  FaCheck,
  FaDesktop,
  FaMobileAlt,
  FaUser,
  FaIdCard,
  FaShieldAlt,
  FaClock,
  FaWindows,
  FaApple,
  FaLinux,
  FaFilter,
  FaTimes,
  FaChevronDown,
  FaExternalLinkAlt,
  FaEdit,
  FaSave,
  FaTrash,
  FaTimesCircle,
  FaCheckCircle,
  FaTimes as FaTimesIcon,
  FaFileSignature,
  FaSun,
  FaMoon,
  FaArrowCircleLeft,
  FaArrowAltCircleLeft
} from 'react-icons/fa';
import {
  HiOutlineStatusOnline,
  HiOutlineStatusOffline
} from 'react-icons/hi';
import toast from 'react-hot-toast';

const Lists = () => {
  const navigate = useNavigate();
  const {
    lists,
    searchTerm,
    setSearchTerm,
    filteredLists,
    setSelectedBrand,
    setSelectedOS,
    selectedBrand,
    selectedOS,
    updateDevice,
    deleteDevice,
    fetchLaptopsFromBackend,
    showDel, setShowDel,
    isDarkMode, setIsDarkMode
  } = useAppContext();

  const [pcStatus, setPcStatus] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const [outShow, setOutShow] = useState(false);
  const [pendingToggle, setPendingToggle] = useState({ id: null, newStatus: null });
  const [copiedId, setCopiedId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const tableContainerRef = useRef(null);

  /* ===================== THEME CONFIGURATION ===================== */
  const theme = {
    bg: isDarkMode 
      ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900/50' 
      : 'bg-gradient-to-br from-gray-50 via-white to-gray-50/50',
    text: isDarkMode ? 'text-gray-100' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-400' : 'text-gray-600',
    border: isDarkMode ? 'border-gray-700' : 'border-gray-200',
    cardBg: isDarkMode ? 'bg-gray-800/95' : 'bg-white/95',
    inputBg: isDarkMode ? 'bg-gray-700/50' : 'bg-white/90',
    inputBorder: isDarkMode ? 'border-gray-600' : 'border-gray-300',
    hover: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
    shadow: isDarkMode ? 'shadow-xl shadow-black/30' : 'shadow-sm shadow-gray-200/50',
    tableHeaderBg: isDarkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-blue-950 to-blue-900',
    tableHeaderText: isDarkMode ? 'text-gray-300' : 'text-gray-100',
    tableRowHover: isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-blue-50/50',
    successBg: isDarkMode ? 'bg-green-900/30' : 'bg-emerald-50',
    successBorder: isDarkMode ? 'border-green-800' : 'border-emerald-200',
    errorBg: isDarkMode ? 'bg-red-900/30' : 'bg-red-50',
    errorBorder: isDarkMode ? 'border-red-800' : 'border-red-200',
    warningBg: isDarkMode ? 'bg-amber-900/30' : 'bg-amber-50',
    warningBorder: isDarkMode ? 'border-amber-800' : 'border-amber-200',
    infoBg: isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50',
    infoBorder: isDarkMode ? 'border-blue-800' : 'border-blue-200',
  };

  /* ===================== INIT ===================== */
  useEffect(() => {
    const savedStatus = JSON.parse(localStorage.getItem('pcStatus')) || {};
    setPcStatus(savedStatus);

    const checkScreenSize = () => setIsMobile(window.innerWidth < 1024);
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  /* ===================== TOAST THEME ===================== */
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

  /* ===================== HELPERS ===================== */
  const handleStatusToggle = (id, currentStatus, e) => {
    e.stopPropagation();
    const newStatus = currentStatus === 'out' ? 'in' : 'out';

    // Check if already in the desired state
    if (pcStatus[id] === newStatus) {
      showToast(`Laptop is already ${newStatus.toUpperCase()}`, 'info');
      return;
    }

    // Get user info for history
    const user = JSON.parse(localStorage.getItem('user')) || { username: 'Admin' };

    // Create history entry
    const newStatusEntry = {
      status: newStatus,
      timestamp: new Date().toISOString(),
      actionBy: 'Admin',
      deviceId: id,
      deviceName: lists.find(l => l.id === id)?.studentName || `Device ${id}`
    };

    // Load existing history
    const savedHistory = JSON.parse(localStorage.getItem(`pcHistory_${id}`)) || [];
    const updatedHistory = [...savedHistory, newStatusEntry];

    // Save history
    localStorage.setItem(`pcHistory_${id}`, JSON.stringify(updatedHistory));

    // Update status
    setPendingToggle({ id, newStatus });
    setOutShow(true);
  };

  const confirmStatusChange = () => {
    if (pendingToggle.id) {
      const updatedStatus = { ...pcStatus, [pendingToggle.id]: pendingToggle.newStatus };
      setPcStatus(updatedStatus);
      localStorage.setItem('pcStatus', JSON.stringify(updatedStatus));
      showToast(`Laptop marked as ${pendingToggle.newStatus.toUpperCase()} successfully!`);
    }
    setOutShow(false);
    setPendingToggle({ id: null, newStatus: null });
  };

  const cancelStatusChange = () => {
    setOutShow(false);
    setPendingToggle({ id: null, newStatus: null });
  };

  const copyToClipboard = async (text, id, e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getOSIcon = (os) => {
    switch (os?.toLowerCase()) {
      case 'windows': return <FaWindows className="w-4 h-4" />;
      case 'macos': return <FaApple className="w-4 h-4" />;
      case 'linux': return <FaLinux className="w-4 h-4" />;
      default: return <FaDesktop className="w-4 h-4" />;
    }
  };

  const getOSColor = (os) => {
    switch (os?.toLowerCase()) {
      case 'windows': 
        return isDarkMode 
          ? 'bg-blue-900/30 text-blue-300 border-blue-800' 
          : 'bg-blue-50 text-blue-700 border-blue-200';
      case 'macos': 
        return isDarkMode 
          ? 'bg-gray-900/30 text-gray-300 border-gray-800' 
          : 'bg-gray-50 text-gray-700 border-gray-200';
      case 'linux': 
        return isDarkMode 
          ? 'bg-orange-900/30 text-orange-300 border-orange-800' 
          : 'bg-orange-50 text-orange-700 border-orange-200';
      default: 
        return isDarkMode 
          ? 'bg-gray-900/30 text-gray-300 border-gray-800' 
          : 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    return status === 'out'
      ? isDarkMode 
        ? 'bg-red-900/30 text-red-300 border-red-800 hover:bg-red-800/50' 
        : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
      : isDarkMode 
        ? 'bg-emerald-900/30 text-emerald-300 border-emerald-800 hover:bg-emerald-800/50' 
        : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100';
  };

  const getVerificationColor = (verified) => {
    return verified
      ? isDarkMode 
        ? 'bg-emerald-900/30 text-emerald-300 border-emerald-800' 
        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : isDarkMode 
        ? 'bg-amber-900/30 text-amber-300 border-amber-800' 
        : 'bg-amber-50 text-amber-700 border-amber-200';
  };

  const getSecurityColor = (protectedStatus) => {
    return protectedStatus
      ? isDarkMode 
        ? 'bg-emerald-900/30 text-emerald-300 border-emerald-800' 
        : 'bg-emerald-100 text-emerald-700 border-emerald-200'
      : isDarkMode 
        ? 'bg-red-900/30 text-red-300 border-red-800' 
        : 'bg-red-100 text-red-700 border-red-200';
  };

  // Normalize device data for consistency
  const normalizeDeviceData = (device) => {
    if (!device) return device;
    return {
      ...device,
      studentId: device.studentId || device.studentID || '',
      verified: device.verified || device.Verified || false
    };
  };

  const uniqueBrands = ['All', ...new Set(lists.map(l => l?.laptopBrand).filter(Boolean))];
  const uniqueOS = ['All', ...new Set(lists.map(l => l?.operatingSystem).filter(Boolean))];

  /* ===================== EDIT FUNCTIONS ===================== */
  const startEditing = (device, e) => {
    e.stopPropagation();
    const normalizedDevice = normalizeDeviceData(device);
    setEditingId(device.id);
    setEditForm({
      studentName: normalizedDevice.studentName || '',
      studentId: normalizedDevice.studentId || '',
      serialNumber: normalizedDevice.serialNumber || '',
      laptopBrand: normalizedDevice.laptopBrand || '',
      operatingSystem: normalizedDevice.operatingSystem || '',
      phone: normalizedDevice.phone || '',
      antiVirusInstalled: normalizedDevice.antiVirusInstalled || false,
      verified: normalizedDevice.verified || false
    });
  };

  const cancelEditing = (e) => {
    e?.stopPropagation();
    setEditingId(null);
    setEditForm({});
  };

 const saveEditing = async (id, e) => {
  e.stopPropagation();

  try {
    // Validate required fields
    if (!editForm.studentName?.trim()) {
      showToast('Student name is required', 'error');
      return;
    }

    if (!editForm.studentId?.trim()) {
      showToast('Student ID is required', 'error');
      return;
    }

    if (!editForm.serialNumber?.trim()) {
      showToast('Serial number is required', 'error');
      return;
    }

    // Get the original device to preserve missing fields
    const originalDevice = lists.find(l => l.id === id);
    
    // Prepare data exactly as backend expects
    const formDataToSend = {
      studentName: editForm.studentName.trim(),
      studentId: editForm.studentId.trim(),
      serialNumber: editForm.serialNumber.trim(),
      laptopBrand: editForm.laptopBrand || originalDevice?.laptopBrand || "Unknown",
      operatingSystem: editForm.operatingSystem || originalDevice?.operatingSystem || "Unknown",
      phone: editForm.phone?.trim() || originalDevice?.phone || "",
      email: originalDevice?.email || "", // Preserve email
      macAddress: originalDevice?.macAddress || "", // Preserve macAddress
      antiVirusInstalled: editForm.antiVirusInstalled === true || editForm.antiVirusInstalled === 'true',
      verified: editForm.verified === true || editForm.verified === 'true' // Ensure boolean
    };

    console.log("📤 Sending update data:", formDataToSend);
    
    // Call update function from context
    const success = await updateDevice(id, formDataToSend);

    if (success) {
      setEditingId(null);
      setEditForm({});
    
      
      // Refresh data
      setTimeout(() => {
        if (fetchLaptopsFromBackend) {
          fetchLaptopsFromBackend();
        }
      }, 500);
    }
  } catch (error) {
    console.error('❌ Error in saveEditing:', error);
    showToast('An error occurred while updating the device', 'error');
  }
};

  const handleDelete = async (id, e) => {
    e.stopPropagation();

    try {
      const success = await deleteDevice(id);
      if (success) {
        if (fetchLaptopsFromBackend) {
          await fetchLaptopsFromBackend();
        }
      } else {
        showToast('Failed to delete device. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Failed to delete device:', error);
      showToast('Failed to delete device: ' + error.message, 'error');
    }
  };

  const handleEditChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Get student ID handling both cases
  const getStudentId = (list) => {
    return list.studentId || list.studentID || 'N/A';
  };

  // Get verification status handling both cases
  const isVerified = (list) => {
    return list.verified || list.Verified || false;
  };

  /* ===================== THEME TOGGLE COMPONENT ===================== */
  const ThemeToggle = () => (
    <button
      onClick={() => navigate('/')}
      className={`fixed top-18 right-0 z-50 p-2 cursor-pointer rounded-sm transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-800 to-gray-900  text-yellow-300 shadow-lg shadow-yellow-500/20' 
          : 'bg-gradient-to-br from-white to-gray-100 text-amber-600 shadow-lg shadow-gray-400/20'
      }`}
      
    >
 
        <div className="flex items-center justify-center px-4 gap-2">
          <FaArrowCircleLeft className=" " />
          <span className=" mt-1 font-medium">Back</span>
        </div>
    
    </button>
  );

  /* ===================== UI ===================== */
  return (
    <div className={`min-h-screen pt-18 pb-10 transition-colors duration-300 ${theme.bg}`}>
      <ThemeToggle />

      {/* ===================== HEADER ===================== */}
      <div className={`border-b px-6 py-4 sticky top-0  ${theme.border} ${theme.shadow} ${isDarkMode ? 'bg-gray-900/95' : 'bg-white/95'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className='flex justify-center flex-col text-center'>
              <h1 className={`text-4xl md:text-5xl font-bold mb-3 ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent' 
                  : 'bg-gradient-to-r from-indigo-700 to-blue-600 bg-clip-text text-transparent'
              }`}>
                Device Inventory
              </h1>
              <p className={`text-lg max-w-2xl mx-auto ${theme.textSecondary}`}>
                Manage and monitor all registered devices
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  {filteredLists.length}
                </div>
                <div className={`text-xs ${theme.textSecondary}`}>of {lists.length} devices</div>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`lg:hidden flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <FaFilter />
                Filters
              </button>
            </div>
          </div>

          {/* ===================== FILTERS DESKTOP ===================== */}
          <div className="hidden lg:grid grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              <input
                type="text"
                placeholder="Search devices, users, serial..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full rounded-xl pl-12 pr-4 py-3 transition-all ${theme.inputBg} ${theme.inputBorder} ${theme.text} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
            </div>

            {/* Brand Filter */}
            <div className="relative">
              <FaDesktop className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className={`w-full rounded-xl pl-12 pr-10 py-3 appearance-none transition-all ${theme.inputBg} ${theme.inputBorder} ${theme.text} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              >
                {uniqueBrands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              <FaChevronDown className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            </div>

            {/* OS Filter */}
            <div className="relative">
              <FaWindows className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              <select
                value={selectedOS}
                onChange={(e) => setSelectedOS(e.target.value)}
                className={`w-full rounded-xl pl-12 pr-10 py-3 appearance-none transition-all ${theme.inputBg} ${theme.inputBorder} ${theme.text} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              >
                {uniqueOS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              <FaChevronDown className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            </div>

            {/* Add Device Button */}
            <button
              onClick={() => navigate('/register')}
              className={`rounded-xl px-6 py-3 font-medium transition-all shadow-sm hover:shadow ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white' 
                  : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white'
              }`}
            >
              + Add Device
            </button>
          </div>
        </div>
      </div>

      {/* ===================== MOBILE FILTERS ===================== */}
      {showFilters && isMobile && (
        <div className={`lg:hidden border-b px-6 py-4 ${theme.border} ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-semibold ${theme.text}`}>Filters</h3>
            <button onClick={() => setShowFilters(false)} className={theme.textSecondary}>
              <FaTimes />
            </button>
          </div>
          <div className="space-y-4">
            <div className="relative">
              <FaSearch className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full rounded-lg pl-12 pr-4 py-2 ${theme.inputBg} ${theme.inputBorder} ${theme.text}`}
              />
            </div>

            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className={`w-full rounded-lg px-4 py-2 ${theme.inputBg} ${theme.inputBorder} ${theme.text}`}
            >
              {uniqueBrands.map(b => <option key={b} value={b}>{b}</option>)}
            </select>

            <select
              value={selectedOS}
              onChange={(e) => setSelectedOS(e.target.value)}
              className={`w-full rounded-lg px-4 py-2 ${theme.inputBg} ${theme.inputBorder} ${theme.text}`}
            >
              {uniqueOS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>
      )}

      {/* ===================== DESKTOP TABLE ===================== */}
      {!isMobile && (
        <div className="w-full mx-auto py-1 px-4">
          <div className={`border overflow-hidden ${theme.border} ${theme.shadow} ${theme.cardBg}`}>
            {/* Fixed Table Header */}
            <div className={`sticky top-0 z-10 border-b ${theme.border} ${theme.tableHeaderBg}`}>
              <div className={`grid grid-cols-10 gap-4 px-6 py-4 text-xs font-semibold uppercase tracking-wider ${theme.tableHeaderText}`}>
                <div className="flex items-center gap-2">
                  <FaUser className="w-3 h-3" />
                  User
                </div>
                <div className="flex items-center gap-2">
                  <FaIdCard className="w-3 h-3" />
                  ID
                </div>
                <div className="flex items-center gap-2">
                  Serial
                </div>
                <div className="flex items-center gap-2">
                  <FaDesktop className="w-3 h-3" />
                  Brand
                </div>
                <div className="flex items-center gap-2">
                  OS
                </div>
                <div className="flex items-center gap-2">
                  Contact
                </div>
                <div className="flex items-center gap-2">
                  <FaShieldAlt className="w-3 h-3" />
                  Security
                </div>
                <div className="flex items-center gap-2">
                  <HiOutlineStatusOnline className="w-3 h-3" />
                  Status
                </div>
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="w-3 h-3" />
                  Verified
                </div>
                <div className="flex items-center gap-2">
                  Actions
                </div>
              </div>
            </div>

            {/* Scrollable Table Body */}
            <div
              ref={tableContainerRef}
              className="overflow-y-auto max-h-[calc(100vh-270px)]"
            >
              <div className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-100'} min-w-full `}>
                {filteredLists.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(list => {
                  const normalizedList = normalizeDeviceData(list);
                  const isPcOut = pcStatus[list.id] === 'out';
                  const isEditing = editingId === list.id;
                  const studentId = getStudentId(list);
                  const verified = isVerified(list);
                  return (
                    <div
                      key={list.id}
                      className={`grid grid-cols-10 gap-4 px-6 py-4 transition-all duration-200 group ${theme.tableRowHover}`}
                    >
                      {/* User */}
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-semibold text-sm mr-3 ${
                          isDarkMode 
                            ? 'bg-gradient-to-br from-blue-600 to-blue-700' 
                            : 'bg-gradient-to-br from-blue-500 to-blue-600'
                        }`}>
                          {list.studentName?.charAt(0) || 'U'}
                        </div>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.studentName}
                            onChange={(e) => handleEditChange('studentName', e.target.value)}
                            className={`w-full rounded-lg px-3 py-2 text-sm ${theme.inputBg} ${theme.inputBorder} ${theme.text}`}
                            onClick={(e) => e.stopPropagation()}
                            placeholder="Student Name"
                          />
                        ) : (
                          <div className="cursor-pointer" onClick={() => navigate(`/verify/${list.id}`)}>
                            <div className={`${isDarkMode ? ' text-gray-300 hover:bg-gray-600' : ' text-gray-700 hover:bg-gray-200'}font-semibold group-hover:${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                              {list.studentName}
                            </div>
                            <div className="text-xs text-gray-500">Student</div>

                           
                          </div>
                        )}
                      </div>

                      {/* Student ID */}
                      <div className="flex items-center">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.studentId}
                            onChange={(e) => handleEditChange('studentId', e.target.value)}
                            className={`w-full rounded-lg px-3 py-2 text-sm font-mono ${theme.inputBg} ${theme.inputBorder} ${theme.text}`}
                            onClick={(e) => e.stopPropagation()}
                            placeholder="Student ID"
                          />
                        ) : (
                          <code
                            className={`font-mono text-sm px-3 py-1 rounded-lg cursor-pointer ${
                              isDarkMode 
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            onClick={() => navigate(`/verify/${list.id}`)}
                          >
                            {studentId}
                          </code>
                        )}
                      </div>

                      {/* Serial Number */}
                      <div className="flex items-center">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.serialNumber}
                            onChange={(e) => handleEditChange('serialNumber', e.target.value)}
                            className={`w-full rounded-lg px-3 py-2 text-sm font-mono ${theme.inputBg} ${theme.inputBorder} ${theme.text}`}
                            onClick={(e) => e.stopPropagation()}
                            placeholder="Serial Number"
                          />
                        ) : (
                          <code
                            className={`font-mono text-sm px-3 py-1 rounded-lg cursor-pointer ${
                              isDarkMode 
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            onClick={() => navigate(`/verify/${list.id}`)}
                          >
                            {list.serialNumber}
                          </code>
                        )}
                      </div>

                      {/* Brand */}
                      <div className="flex items-center">
                        {isEditing ? (
                          <select
                            value={editForm.laptopBrand}
                            onChange={(e) => handleEditChange('laptopBrand', e.target.value)}
                            className={`w-full rounded-lg px-3 py-2 text-sm ${theme.inputBg} ${theme.inputBorder} ${theme.text}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <option value="">Select Brand</option>
                            {uniqueBrands.filter(b => b !== 'All').map(brand => (
                              <option key={brand} value={brand}>{brand}</option>
                            ))}
                          </select>
                        ) : (
                          <div
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer ${
                              isDarkMode 
                                ? 'bg-blue-900/30 text-blue-300 border-blue-800 hover:bg-blue-800/50' 
                                : 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'
                            }`}
                            onClick={() => navigate(`/verify/${list.id}`)}
                          >
                            <FaDesktop className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
                            <span className="font-medium">
                              {list.laptopBrand || 'Unknown'}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* OS */}
                      <div className="flex items-center">
                        {isEditing ? (
                          <select
                            value={editForm.operatingSystem}
                            onChange={(e) => handleEditChange('operatingSystem', e.target.value)}
                            className={`w-full rounded-lg px-3 py-2 text-sm ${theme.inputBg} ${theme.inputBorder} ${theme.text}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <option value="">Select OS</option>
                            {uniqueOS.filter(os => os !== 'All').map(os => (
                              <option key={os} value={os}>{os}</option>
                            ))}
                          </select>
                        ) : (
                          <div
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer ${getOSColor(list.operatingSystem)}`}
                            onClick={() => navigate(`/verify/${list.id}`)}
                          >
                            {getOSIcon(list.operatingSystem)}
                            <span className="font-medium">
                              {list.operatingSystem || 'Unknown'}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Contact */}
                      <div className="flex items-center">
                        <div className="flex items-center gap-3">
                          {isEditing ? (
                            <input
                              type="tel"
                              value={editForm.phone}
                              onChange={(e) => handleEditChange('phone', e.target.value)}
                              className={`w-full rounded-lg px-3 py-2 text-sm font-mono ${theme.inputBg} ${theme.inputBorder} ${theme.text}`}
                              onClick={(e) => e.stopPropagation()}
                              placeholder="Phone Number"
                            />
                          ) : (
                            <code
                              className={`font-medium cursor-pointer ${theme.text}`}
                              onClick={() => navigate(`/verify/${list.id}`)}
                            >
                              {list.phone || 'N/A'}
                            </code>
                          )}
                        </div>
                      </div>

                      {/* Security */}
                      <div className="flex items-center">
                        {isEditing ? (
                          <select
                            value={editForm.antiVirusInstalled?.toString()}
                            onChange={(e) => handleEditChange('antiVirusInstalled', e.target.value === 'true')}
                            className={`w-full rounded-lg px-3 py-2 text-sm ${theme.inputBg} ${theme.inputBorder} ${theme.text}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <option value="true">Protected</option>
                            <option value="false">Unprotected</option>
                          </select>
                        ) : (
                          <span className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer ${getSecurityColor(list.antiVirusInstalled)}`}
                            onClick={() => navigate(`/verify/${list.id}`)}
                          >
                            {list.antiVirusInstalled ? '✓ Protected' : '✗ Unprotected'}
                          </span>
                        )}
                      </div>

                      {/* Status */}
                      <div className="flex items-center">
                        <button
                          onClick={(e) => handleStatusToggle(list.id, isPcOut ? 'out' : 'in', e)}
                          className={`px-4 py-1.5 rounded-full font-medium text-sm border transition-all ${getStatusColor(isPcOut ? 'out' : 'in')}`}
                        >
                          {isPcOut ? (
                            <span className="flex items-center gap-2">
                              <HiOutlineStatusOffline />
                              OUT
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <HiOutlineStatusOnline />
                              IN
                            </span>
                          )}
                        </button>
                      </div>

                      {/* Verified */}
                      <div className="flex items-center">
                        {isEditing ? (
                          <select
                            value={editForm.verified?.toString()}
                            onChange={(e) => handleEditChange('verified', e.target.value === 'true')}
                            className={`w-full rounded-lg px-3 py-2 text-sm ${theme.inputBg} ${theme.inputBorder} ${theme.text}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <option value="true">Verified</option>
                            <option value="false">Unverified</option>
                          </select>
                        ) : (
                          <span className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer ${getVerificationColor(verified)}`}
                            onClick={() => navigate(`/verify/${list.id}`)}
                          >
                            {verified ? (
                              <span className="flex items-center gap-1">
                                <FaCheckCircle className="w-3 h-3" />
                                Verified
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <FaTimesIcon className="w-3 h-3" />
                                Unverified
                              </span>
                            )}
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={(e) => saveEditing(list.id, e)}
                              className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-1"
                              title="Save"
                            >
                              <FaSave className="w-4 h-4" />
                              <span className="text-xs">Save</span>
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-1"
                              title="Cancel"
                            >
                              <FaTimesCircle className="w-4 h-4" />
                              <span className="text-xs">Cancel</span>
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={(e) => startEditing(list, e)}
                              className={`p-2 rounded-lg transition-colors ${
                                isDarkMode 
                                  ? 'text-blue-400 hover:bg-blue-900/50' 
                                  : 'text-blue-600 hover:bg-blue-50'
                              }`}
                              title="Edit"
                            >
                              <FaEdit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => setShowDel(true)}
                              className={`p-2 rounded-lg transition-colors ${
                                isDarkMode 
                                  ? 'text-red-400 hover:bg-red-900/50' 
                                  : 'text-red-600 hover:bg-red-50'
                              }`}
                              title="Delete"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => navigate(`/verify/${list.id}`)}
                              className={`p-2 rounded-lg transition-colors ${
                                isDarkMode 
                                  ? 'text-gray-400 hover:bg-gray-700' 
                                  : 'text-gray-600 hover:bg-gray-50'
                              }`}
                              title="View Details"
                            >
                              <FaExternalLinkAlt className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Empty State */}
              {filteredLists.length === 0 && (
                <div className="text-center py-12">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    <FaSearch className={`w-8 h-8 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  </div>
                  <h3 className={`text-lg font-semibold mb-2 ${theme.text}`}>No devices found</h3>
                  <p className={theme.textSecondary}>Try adjusting your search or filter criteria</p>
                  <button
                    onClick={() => navigate('/register')}
                    className={`mt-4 rounded-xl px-6 py-2 font-medium transition-all ${
                      isDarkMode 
                        ? 'bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white' 
                        : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white'
                    }`}
                  >
                    + Add First Device
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===================== MOBILE VIEW ===================== */}
      {isMobile && (
        <div className="p-4 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-lg font-semibold ${theme.text}`}>Devices ({filteredLists.length})</h2>
            <button
              onClick={() => navigate('/register')}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-blue-700 to-blue-600 text-white' 
                  : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white'
              }`}
            >
              + Add
            </button>
          </div>

          {filteredLists.map(list => {
            const normalizedList = normalizeDeviceData(list);
            const isPcOut = pcStatus[list.id] === 'out';
            const studentId = getStudentId(list);
            const verified = isVerified(list);

            return (
              <div
                key={list.id}
                className={`rounded-xl border p-4 hover:shadow-md transition-shadow cursor-pointer ${theme.border} ${theme.cardBg} ${theme.shadow}`}
                onClick={() => navigate(`/verify/${list.id}`)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold ${
                      isDarkMode 
                        ? 'bg-gradient-to-br from-blue-600 to-blue-700' 
                        : 'bg-gradient-to-br from-blue-500 to-blue-600'
                    }`}>
                      {list.studentName?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h3 className={`font-semibold ${theme.text}`}>{list.studentName}</h3>
                      <p className={`text-xs ${theme.textSecondary}`}>{studentId}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    verified 
                      ? isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800'
                      : isDarkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-800'
                  }`}>
                    {verified ? 'Verified' : 'Unverified'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className={theme.textSecondary}>
                    <span className={`font-medium ${theme.text}`}>{list.laptopBrand || 'Unknown'}</span>
                    <div className="text-xs text-gray-500">Brand</div>
                  </div>
                  <div className={theme.textSecondary}>
                    <span className={`font-medium ${theme.text}`}>{list.operatingSystem || 'Unknown'}</span>
                    <div className="text-xs text-gray-500">OS</div>
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusToggle(list.id, isPcOut ? 'out' : 'in', e);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      isPcOut
                        ? isDarkMode 
                          ? 'bg-red-900/30 text-red-300 border-red-800' 
                          : 'bg-red-100 text-red-700 border-red-200'
                        : isDarkMode 
                          ? 'bg-emerald-900/30 text-emerald-300 border-emerald-800' 
                          : 'bg-green-100 text-green-700 border-green-200'
                    }`}
                  >
                    {isPcOut ? 'OUT' : 'IN'}
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditing(list, e);
                      }}
                      className={`p-2 rounded-lg ${
                        isDarkMode 
                          ? 'text-blue-400 hover:bg-blue-900/50' 
                          : 'text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShowDel(true)}
                      className={`p-2 rounded-lg ${
                        isDarkMode 
                          ? 'text-red-400 hover:bg-red-900/50' 
                          : 'text-red-600 hover:bg-red-50'
                      }`}
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredLists.length === 0 && (
            <div className="text-center py-8">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <FaSearch className={`w-6 h-6 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              </div>
              <h3 className={`font-semibold mb-1 ${theme.text}`}>No devices found</h3>
              <p className={`text-sm mb-4 ${theme.textSecondary}`}>Try adjusting your search or filters</p>
              <button
                onClick={() => navigate('/register')}
                className={`rounded-lg px-4 py-2 text-sm font-medium ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-blue-700 to-blue-600 text-white' 
                    : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white'
                }`}
              >
                + Add First Device
              </button>
            </div>
          )}
        </div>
      )}

      {/* ===================== DELETE CONFIRMATION MODAL ===================== */}
      {showDel && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-1000">
          <div 
            className={`absolute inset-0 ${
              isDarkMode ? 'bg-black/70' : 'bg-black/40'
            } backdrop-blur-sm`}
            onClick={() => setShowDel(false)}
          />
          <div className={`relative rounded-2xl p-6 max-w-sm w-full shadow-2xl ${theme.cardBg} ${theme.border}`}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
              isDarkMode 
                ? 'bg-gradient-to-br from-amber-700 to-amber-800' 
                : 'bg-gradient-to-br from-amber-500 to-amber-600'
            }`}>
              <FaExclamation className="text-white text-xl" />
            </div>
            <h3 className={`text-xl font-bold text-center mb-2 ${theme.text}`}>
              Do you want to Delete?
            </h3>
            <p className={`text-center mb-6 ${theme.textSecondary}`}>
              This action cannot be undone.
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
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(list.id, e);
                  setShowDel(false);
                }}
                className={`flex-1 rounded-xl px-4 py-3 font-medium transition-all shadow-sm ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white' 
                    : 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== STATUS CHANGE MODAL ===================== */}
      {outShow && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-1000">
          <div 
            className={`absolute inset-0 ${
              isDarkMode ? 'bg-black/70' : 'bg-black/40'
            } backdrop-blur-sm`}
            onClick={cancelStatusChange}
          />
          <div className={`relative rounded-2xl p-6 max-w-sm w-full shadow-2xl ${theme.cardBg} ${theme.border}`}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
              isDarkMode 
                ? 'bg-gradient-to-br from-amber-700 to-amber-800' 
                : 'bg-gradient-to-br from-amber-500 to-amber-600'
            }`}>
              <FaExclamation className="text-white text-xl" />
            </div>
            <h3 className={`text-xl font-bold text-center mb-2 ${theme.text}`}>
              Confirm Status Change
            </h3>
            <p className={`text-center mb-6 ${theme.textSecondary}`}>
              Change status to <span className={`font-bold ${theme.text}`}>
                {pendingToggle.newStatus?.toUpperCase()}
              </span>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={cancelStatusChange}
                className={`flex-1 border rounded-xl px-4 py-3 font-medium transition-colors ${
                  isDarkMode 
                    ? 'border-gray-600 hover:bg-gray-700 text-gray-300' 
                    : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={confirmStatusChange}
                className={`flex-1 rounded-xl px-4 py-3 font-medium transition-all shadow-sm ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white' 
                    : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add custom animations */}
      <style>
        {`
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          .animate-spin-slow {
            animation: spin-slow 3s linear infinite;
          }
          
          /* Custom scrollbar for dark mode */
          .dark ::-webkit-scrollbar {
            width: 8px;
          }
          
          .dark ::-webkit-scrollbar-track {
            background: #374151;
            border-radius: 4px;
          }
          
          .dark ::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #4f46e5, #6366f1);
            border-radius: 4px;
          }
          
          .dark ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to bottom, #4338ca, #4f46e5);
          }
          
          /* Custom scrollbar for light mode */
          ::-webkit-scrollbar {
            width: 8px;
          }
          
          ::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
          }
          
          ::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #6366f1, #3b82f6);
            border-radius: 4px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to bottom, #4f46e5, #2563eb);
          }
          
          /* Smooth transitions */
          * {
            transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
          }
        `}
      </style>
    </div>
  );
};

export default Lists;