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
  FaFileSignature
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
    showDel, setShowDel
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


  /* ===================== INIT ===================== */
  useEffect(() => {
    const savedStatus = JSON.parse(localStorage.getItem('pcStatus')) || {};
    setPcStatus(savedStatus);

    const checkScreenSize = () => setIsMobile(window.innerWidth < 1024);
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Debug useEffect
  useEffect(() => {
    console.log('Current editing state:', {
      editingId,
      editForm,
      hasUpdateDevice: typeof updateDevice === 'function',
      listsCount: lists.length,
      filteredCount: filteredLists.length,
      firstList: lists[0]
    });
  }, [editingId, editForm, updateDevice, lists, filteredLists]);

  /* ===================== HELPERS ===================== */
  const handleStatusToggle = (id, currentStatus, e) => {
    e.stopPropagation();
    const newStatus = currentStatus === 'out' ? 'in' : 'out';

    // Check if already in the desired state
    if (pcStatus[id] === newStatus) {
      toast(`Laptop is already ${newStatus.toUpperCase()}`, {
        icon: 'ℹ️',
        duration: 2000
      });
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

      toast.success(`Laptop marked as ${pendingToggle.newStatus.toUpperCase()} successfully!`);
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
      case 'windows': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'macos': return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'linux': return 'bg-orange-50 text-orange-700 border-orange-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    return status === 'out'
      ? 'bg-red-50 text-red-700 border-red-200'
      : 'bg-emerald-50 text-emerald-700 border-emerald-200';
  };

  const getVerificationColor = (verified) => {
    return verified
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : 'bg-amber-50 text-amber-700 border-amber-200';
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
    console.log('Starting edit for device:', device);
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
      console.log('💾 Save Editing - Device ID:', id);
      console.log('📝 Edit Form Data:', editForm);

      // Validate required fields
      if (!editForm.studentName?.trim()) {
        toast.error('Student name is required');
        return;
      }

      if (!editForm.studentId?.trim()) {
        toast.error('Student ID is required');
        return;
      }

      if (!editForm.serialNumber?.trim()) {
        toast.error('Serial number is required');
        return;
      }

      // Prepare data exactly as backend expects
      const formDataToSend = {
        studentName: editForm.studentName.trim(),
        studentId: editForm.studentId.trim(), // lowercase for backend
        serialNumber: editForm.serialNumber.trim(),
        laptopBrand: editForm.laptopBrand,
        operatingSystem: editForm.operatingSystem,
        phone: editForm.phone?.trim() || '',
        antiVirusInstalled: editForm.antiVirusInstalled === true || editForm.antiVirusInstalled === 'true',
        verified: editForm.verified === true || editForm.verified === 'true' // lowercase for backend
      };

      console.log('📤 Sending to backend:', formDataToSend);

      // Call update function from context
      const success = await updateDevice(id, formDataToSend);

      if (success) {
        // Exit edit mode
        setEditingId(null);
        setEditForm({});

        // Refresh data after a short delay
        setTimeout(() => {
          fetchLaptopsFromBackend();
        }, 1000);
      }
    } catch (error) {
      console.error('❌ Error in saveEditing:', error);
      toast.error('An error occurred while updating the device');
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();

    try {
      console.log('Deleting device ID:', id);
      const success = await deleteDevice(id);
      if (success) {

        if (fetchLaptopsFromBackend) {
          await fetchLaptopsFromBackend();
        }
      } else {
        toast.error('Failed to delete device. Please try again.');
      }
    } catch (error) {
      console.error('Failed to delete device:', error);
      toast.error('Failed to delete device: ' + error.message);
    }

  };

  const handleEditChange = (field, value) => {
    console.log(`Editing ${field}:`, value);
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

  /* ===================== UI ===================== */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50">

      {/* ===================== HEADER ===================== */}
      <div className="bg-white border-b border-gray-200/80 px-6 py-4 shadow-sm sticky top-0 z-1000">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className='flex justify-center  flex-col text-center'>
                  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-700 to-blue-600 bg-clip-text text-transparent mb-3">
                        Device Inventory
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                      Manage and monitor all registered devices
                    </p>
            
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{filteredLists.length}</div>
                <div className="text-xs text-gray-500">of {lists.length} devices</div>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <FaFilter />
                Filters
              </button>
            </div>
          </div>

          {/* ===================== FILTERS DESKTOP ===================== */}
          <div className="hidden lg:grid grid-cols-4 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search devices, users, serial..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="relative">
              <FaDesktop className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full border border-gray-300 rounded-xl pl-12 pr-10 py-3 appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                {uniqueBrands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              <FaChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            <div className="relative">
              <FaWindows className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={selectedOS}
                onChange={(e) => setSelectedOS(e.target.value)}
                className="w-full border border-gray-300 rounded-xl pl-12 pr-10 py-3 appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                {uniqueOS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              <FaChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            <button
              onClick={() => navigate('/register')}
              className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl px-6 py-3 font-medium hover:from-blue-700 hover:to-blue-600 transition-all shadow-sm hover:shadow"
            >
              + Add Device
            </button>
          </div>
        </div>
      </div>

      {/* ===================== MOBILE FILTERS ===================== */}
      {showFilters && isMobile && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Filters</h3>
            <button onClick={() => setShowFilters(false)} className="text-gray-500">
              <FaTimes />
            </button>
          </div>
          <div className="space-y-4">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-lg pl-12 pr-4 py-2"
              />
            </div>

            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            >
              {uniqueBrands.map(b => <option key={b} value={b}>{b}</option>)}
            </select>

            <select
              value={selectedOS}
              onChange={(e) => setSelectedOS(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            >
              {uniqueOS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>
      )}

      {/* ===================== DESKTOP TABLE ===================== */}
      {!isMobile && (
        <div className="w-full mx-auto py-1">
          <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
            {/* Fixed Table Header */}
            <div className="sticky top-0 z-30 bg-blue-950 border-b border-gray-200">
              <div className="grid grid-cols-10 gap-4 px-6 py-4 text-xs font-semibold text-gray-100 uppercase tracking-wider">
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
              className="overflow-y-auto max-h-[calc(100vh-280px)]"
            >
              <div className="divide-y divide-gray-100 min-w-full">
                {filteredLists.map(list => {
                  const normalizedList = normalizeDeviceData(list);
                  const isPcOut = pcStatus[list.id] === 'out';
                  const isEditing = editingId === list.id;
                  const studentId = getStudentId(list);
                  const verified = isVerified(list);

                  return (
                    <div
                      key={list.id}
                      className="grid grid-cols-10 gap-4 px-6 py-4 hover:bg-blue-50/50 transition-all duration-200 group"
                    >
                      {/* User */}
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm mr-3">
                          {list.studentName?.charAt(0) || 'U'}
                        </div>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.studentName}
                            onChange={(e) => handleEditChange('studentName', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            onClick={(e) => e.stopPropagation()}
                            placeholder="Student Name"
                          />
                        ) : (
                          <div className="cursor-pointer" onClick={() => navigate(`/verify/${list.id}`)}>
                            <div className="font-semibold text-gray-900 group-hover:text-blue-700">
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
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono"
                            onClick={(e) => e.stopPropagation()}
                            placeholder="Student ID"
                          />
                        ) : (
                          <code
                            className="font-mono text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-lg cursor-pointer"
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
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono"
                            onClick={(e) => e.stopPropagation()}
                            placeholder="Serial Number"
                          />
                        ) : (
                          <code
                            className="font-mono text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-lg cursor-pointer"
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
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <option value="">Select Brand</option>
                            {uniqueBrands.filter(b => b !== 'All').map(brand => (
                              <option key={brand} value={brand}>{brand}</option>
                            ))}
                          </select>
                        ) : (
                          <div
                            className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-2 rounded-lg cursor-pointer"
                            onClick={() => navigate(`/verify/${list.id}`)}
                          >
                            <FaDesktop className="text-blue-600" />
                            <span className="font-medium text-blue-800">
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
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <option value="">Select OS</option>
                            {uniqueOS.filter(os => os !== 'All').map(os => (
                              <option key={os} value={os}>{os}</option>
                            ))}
                          </select>
                        ) : (
                          <div
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${getOSColor(list.operatingSystem)} cursor-pointer`}
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
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono"
                              onClick={(e) => e.stopPropagation()}
                              placeholder="Phone Number"
                            />
                          ) : (
                            <>
                              <code
                                className="font-medium text-gray-700 cursor-pointer"
                                onClick={() => navigate(`/verify/${list.id}`)}
                              >
                                {list.phone || 'N/A'}
                              </code>

                            </>
                          )}
                        </div>
                      </div>

                      {/* Security */}
                      <div className="flex items-center">
                        {isEditing ? (
                          <select
                            value={editForm.antiVirusInstalled?.toString()}
                            onChange={(e) => handleEditChange('antiVirusInstalled', e.target.value === 'true')}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <option value="true">Protected</option>
                            <option value="false">Unprotected</option>
                          </select>
                        ) : (
                          <span className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer ${list.antiVirusInstalled
                              ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                              : 'bg-red-100 text-red-700 border border-red-200'
                            }`}
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
                          className={`px-4 py-1.5 rounded-full font-medium text-sm border transition-all ${isPcOut
                              ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            }`}
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
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
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
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <FaEdit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => setShowDel(true)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => navigate(`/verify/${list.id}`)}
                              className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <FaExternalLinkAlt className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>



                      {showDel && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-1000 ">
                          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                              <FaExclamation className="text-white text-xl" />
                            </div>
                            <h3 className="text-xl font-bold text-center mb-2">Do you want to Delete?</h3>

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
                                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl px-4 py-3 font-medium hover:from-blue-700 hover:to-blue-600 transition-all shadow-sm"
                              >
                                Confirm
                              </button>
                            </div>
                          </div>


                        </div>)
                      }
                    </div>
                  );
                })}
              </div>

              {/* Empty State */}
              {filteredLists.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaSearch className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No devices found</h3>
                  <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                  <button
                    onClick={() => navigate('/register')}
                    className="mt-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl px-6 py-2 font-medium hover:from-blue-700 hover:to-blue-600 transition-all"
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
            <h2 className="text-lg font-semibold text-gray-900">Devices ({filteredLists.length})</h2>
            <button
              onClick={() => navigate('/register')}
              className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg px-4 py-2 text-sm font-medium"
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
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/verify/${list.id}`)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-semibold">
                      {list.studentName?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{list.studentName}</h3>
                      <p className="text-xs text-gray-500">{studentId}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${verified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {verified ? 'Verified' : 'Unverified'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="text-gray-600">
                    <span className="font-medium text-gray-900">{list.laptopBrand || 'Unknown'}</span>
                    <div className="text-xs text-gray-500">Brand</div>
                  </div>
                  <div className="text-gray-600">
                    <span className="font-medium text-gray-900">{list.operatingSystem || 'Unknown'}</span>
                    <div className="text-xs text-gray-500">OS</div>
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusToggle(list.id, isPcOut ? 'out' : 'in', e);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${isPcOut
                        ? 'bg-red-100 text-red-700 border border-red-200'
                        : 'bg-green-100 text-green-700 border border-green-200'
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
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShowDel(true)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {showDel && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaExclamation className="text-white text-xl" />
                      </div>
                      <h3 className="text-xl font-bold text-center mb-2">Do you want to Delete?</h3>

                      <div className="flex gap-3">
                        <button

                          className="flex-1 border border-gray-300 rounded-xl px-4 py-3 font-medium hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(list.id, e);
                          }}
                          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl px-4 py-3 font-medium hover:from-blue-700 hover:to-blue-600 transition-all shadow-sm"
                        >
                          Confirm
                        </button>
                      </div>
                    </div>


                  </div>)
                }

              </div>
            );
          })}

          {filteredLists.length === 0 && (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaSearch className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">No devices found</h3>
              <p className="text-sm text-gray-500 mb-4">Try adjusting your search or filters</p>
              <button
                onClick={() => navigate('/register')}
                className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg px-4 py-2 text-sm font-medium"
              >
                + Add First Device
              </button>
            </div>
          )}
        </div>
      )}

      {/* ===================== CONFIRM MODAL ===================== */}
      {outShow && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-1000 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaExclamation className="text-white text-xl" />
            </div>
            <h3 className="text-xl font-bold text-center mb-2">Confirm Status Change</h3>
            <p className="text-gray-600 text-center mb-6">
              Change status to <span className="font-bold text-gray-900">{pendingToggle.newStatus?.toUpperCase()}</span>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={cancelStatusChange}
                className="flex-1 border border-gray-300 rounded-xl px-4 py-3 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmStatusChange}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl px-4 py-3 font-medium hover:from-blue-700 hover:to-blue-600 transition-all shadow-sm"
              >
                Confirm
              </button>
            </div>
          </div>

        </div>
      )}



    </div>
  );
};

export default Lists;