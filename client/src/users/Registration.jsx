import { useAppContext } from '../auth/Context';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { FaArrowCircleLeft, FaCheckCircle, FaList, FaLaptop, FaUser, FaShieldAlt, FaInfoCircle, FaTimes, FaSpinner } from 'react-icons/fa';

const Registration = () => {
    // ** Unchanged Functional Arrays **
    const operatingSystems = ['Windows', 'Linux', 'MacOS', 'Other'];
    const laptopBrands = ['Dell', 'HP', 'Lenovo', 'Apple', 'Acer', 'Asus', 'Other'];
    const { user, formData, lists, setLists, axios } = useAppContext()
    const [showSuccess, setShowSuccess] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const navigate = useNavigate();

    // ** Unchanged State **
    const [laptopData, setLaptopData] = useState({
        studentName: '',
        studentId: '',
        phone: '',
        email: '',
        serialNumber: '',
        macAddress: '',
        operatingSystem: '',
        laptopBrand: '',
        antiVirusInstalled: false,
        verified: false,
    });
    const [errors, setErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [existingRecords, setExistingRecords] = useState({
        studentIdExists: false,
        serialNumberExists: false,
        macAddressExists: false,
    });

    // ** Check for existing records whenever studentId, serialNumber, or macAddress changes **
    useEffect(() => {
        if (lists && lists.length > 0) {
            const checkExisting = {
                studentIdExists: false,
                serialNumberExists: false,
                macAddressExists: false,
            };

            if (laptopData.studentId.trim()) {
                const studentCount = lists.filter(item =>
                    item.studentId === laptopData.studentId.trim()
                ).length;
                checkExisting.studentIdExists = studentCount > 0;
            }

            if (laptopData.serialNumber.trim()) {
                checkExisting.serialNumberExists = lists.some(item =>
                    item.serialNumber === laptopData.serialNumber.trim()
                );
            }

            if (laptopData.macAddress.trim()) {
                checkExisting.macAddressExists = lists.some(item =>
                    item.macAddress === laptopData.macAddress.trim()
                );
            }

            setExistingRecords(checkExisting);
        }
    }, [laptopData.studentId, laptopData.serialNumber, laptopData.macAddress, lists]);

    // ** Updated Validation Logic **
    const validateForm = () => {
        const newErrors = {};

        // Basic required field validation
        if (!laptopData.serialNumber.trim()) {
            newErrors.serialNumber = 'Serial Number is required';
        } else if (existingRecords.serialNumberExists) {
            newErrors.serialNumber = 'This laptop is already registered';
        }

        if (!laptopData.studentName.trim()) {
            newErrors.studentName = 'Student Name is required';
        }
         if (!laptopData.phone.trim()) {
            newErrors.phone = 'Student Phone number is required';
        }
         if (!laptopData.email.trim()) {
            newErrors.email = 'Student Email is required';
        }
        if (!laptopData.studentId.trim()) {
            newErrors.studentId = 'Student ID is required';
        } else if (existingRecords.studentIdExists) {
            newErrors.studentId = 'This student already has a registered laptop';
        }

        if (!laptopData.macAddress.trim()) {
            newErrors.macAddress = 'MAC Address is required';
        } else if (existingRecords.macAddressExists) {
            newErrors.macAddress = 'This MAC Address is already registered';
        }

        if (!laptopData.operatingSystem) {
            newErrors.operatingSystem = 'Please select an operating system';
        }

        if (!laptopData.laptopBrand) {
            newErrors.laptopBrand = 'Please select a laptop brand';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ** Unchanged Change Handler **
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setLaptopData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));

        if (errors[name]) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: '',
            }));
        }
    };

    // ** Updated Submit Handler with loading state **
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            setIsSubmitting(true);
            try {
                // Send to backend
                const response = await axios.post('/api/laptops/register', laptopData);
                
                console.log('Laptop registered successfully:', response.data);
                toast.success('Registered successfully');
                
                // Add to local state
                setLists(prev => [...prev, response.data]);
                setShowSuccess(true);
                setIsSubmitted(true);
               
                
                // Reset form
                setLaptopData({
                    studentName: '',
                    studentId: '',
                    phone: '',
                    email: '',
                    serialNumber: '',
                    macAddress: '',
                    operatingSystem: '',
                    laptopBrand: '',
                    antiVirusInstalled: false,
                });

                setTimeout(() => {
                    setShowSuccess(false)
                     navigate('/list')
                }, 3000);
                
            } catch (error) {
                console.error('Registration failed:', error);
                
                // Handle backend validation errors
                if (error.response && error.response.data) {
                    const backendErrors = error.response.data;
                    setErrors(backendErrors);
                    toast.error('Registration failed. Please check errors.');
                } else {
                    toast.error('Registration failed. Please try again.');
                }
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    // ** Updated Reset Handler **
    const handleReset = () => {
        setLaptopData({
            studentName: '',
            studentId: '',
            phone: '',
            email: '',
            serialNumber: '',
            macAddress: '',
            operatingSystem: '',
            laptopBrand: '',
            antiVirusInstalled: false,
        });
        setErrors({});
        setExistingRecords({
            studentIdExists: false,
            serialNumberExists: false,
            macAddressExists: false,
        });
        setIsSubmitted(false);
    };

    // ** Unchanged MAC Address Formatting Logic **
    const handleMacAddressChange = (e) => {
        let value = e.target.value.toUpperCase();
        value = value.replace(/[^0-9A-F]/g, '');
        if (value.length > 2) value = value.match(/.{1,2}/g).join(':');
        if (value.length > 17) value = value.substring(0, 17);

        setLaptopData(prev => ({ ...prev, macAddress: value }));

        if (errors.macAddress) {
            setErrors(prev => ({ ...prev, macAddress: '' }));
        }
    };

    // ** RENDER START **
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-25 pb-10 ">
            {/* Success Overlay */}
            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-gradient-to-br from-white to-emerald-50 rounded-2xl shadow-2xl p-8 md:p-12 max-w-md mx-4 transform animate-scaleIn">
                        {/* Animated Success Icon */}
                        <div className="relative mb-8 flex justify-center">
                            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-ping opacity-20"></div>
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 flex items-center justify-center shadow-lg">
                                    <FaCheckCircle className="text-green-500 text-6xl animate-bounce" />
                                </div>
                                <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center animate-pulse">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        
                        {/* Success Text */}
                        <div className="text-center">
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
                                Registration Successful!
                            </h1>
                            <p className="text-gray-600 mb-6">
                                Your laptop has been registered successfully and added to the system.
                            </p>
                            
                            {/* Progress bar */}
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
                                <div className="h-full bg-gradient-to-r from-green-400 via-emerald-500 to-green-400 animate-progressBar"></div>
                            </div>
                            
                            <p className="text-gray-500 text-sm">
                                Closing in 3 seconds...
                            </p>
                            
                            {/* Manual Close Button */}
                            <button
                                onClick={() => setShowSuccess(false)}
                                className="mt-6 px-6 py-2.5 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="w-full">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-2xl shadow-lg mb-6">
                        <FaLaptop className="text-indigo-600 text-3xl" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-700 to-blue-600 bg-clip-text text-transparent mb-3">
                        Laptop Registration
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Register your laptop with the university system for tracking and management
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-white/20">
                    {/* Gradient Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 md:p-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">Registration Form</h2>
                                <p className="text-indigo-100">Fill in all required details to register your device</p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => navigate('/')}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl font-medium transition-all backdrop-blur-sm"
                                >
                                    <FaArrowCircleLeft />
                                    <span className="hidden sm:inline">Dashboard</span>
                                </button>
                                <button
                                    onClick={() => navigate('/list')}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl font-medium transition-all backdrop-blur-sm"
                                >
                                    <FaList />
                                    <span className="hidden sm:inline">View List</span>
                                </button>
                            </div>
                        </div>
                        
                        {/* Quick Stats */}
                        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                                <div className="text-sm text-indigo-200 mb-1">Total Registered</div>
                                <div className="text-2xl font-bold text-white">{lists?.length || 0}</div>
                            </div>
                            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                                <div className="text-sm text-indigo-200 mb-1">Available IDs</div>
                                <div className="text-2xl font-bold text-green-300">∞</div>
                            </div>
                            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                                <div className="text-sm text-indigo-200 mb-1">Status</div>
                                <div className="text-2xl font-bold text-yellow-300">Active</div>
                            </div>
                            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                                <div className="text-sm text-indigo-200 mb-1">Security</div>
                                <div className="text-2xl font-bold text-emerald-300">Required</div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 md:p-8">
                        {/* Validation Rules Card */}
                        <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6 shadow-inner">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-gradient-to-r from-red-100 to-red-50 rounded-xl flex items-center justify-center">
                                        <FaShieldAlt className="text-red-500 text-xl" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-blue-800 mb-3">Registration Requirements</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                                <span className="font-semibold text-gray-800">One Student Policy</span>
                                            </div>
                                            <p className="text-sm text-gray-600">Each student can register only one laptop</p>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                                <span className="font-semibold text-gray-800">Unique Laptop</span>
                                            </div>
                                            <p className="text-sm text-gray-600">Each laptop can be registered only once</p>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                                <span className="font-semibold text-gray-800">MAC Address</span>
                                            </div>
                                            <p className="text-sm text-gray-600">Duplicate MAC addresses are prohibited</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Success Alert */}
                        {isSubmitted && !showSuccess && (
                            <div className="mb-8 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-green-800">Registration submitted successfully!</p>
                                        <p className="text-sm text-green-600">Your laptop is now pending verification</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Main Form */}
                        <form onSubmit={handleSubmit} className="space-y-8 border-3 rounded-2xl border-blue-200 p-6">
                            {/* Student Information Section */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-100 to-blue-100 rounded-xl flex items-center justify-center">
                                        <FaUser className="text-indigo-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800">Student Information</h3>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Student Name */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            <span className="flex items-center gap-1">
                                                <span>Full Name</span>
                                                <span className="text-red-500">*</span>
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            name="studentName"
                                            value={laptopData.studentName}
                                            onChange={handleChange}
                                            placeholder="John Doe"
                                            className={`w-full px-4 py-3 rounded-xl border transition-all bg-white/50 backdrop-blur-sm ${
                                                errors.studentName 
                                                    ? 'border-red-500 focus:ring-2 focus:ring-red-500/20' 
                                                    : 'border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                                            }`}
                                        />
                                        {errors.studentName && (
                                            <div className="flex items-center gap-2 mt-1">
                                                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-sm text-red-600">{errors.studentName}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Student ID with validation */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="block text-sm font-semibold text-gray-700">
                                                <span className="flex items-center gap-1">
                                                    <span>Student ID</span>
                                                    <span className="text-red-500">*</span>
                                                </span>
                                            </label>
                                            {laptopData.studentId && (
                                                <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                                                    existingRecords.studentIdExists 
                                                        ? 'bg-red-100 text-red-800' 
                                                        : 'bg-green-100 text-green-800'
                                                }`}>
                                                    {existingRecords.studentIdExists ? 'Already Registered' : 'Available'}
                                                </div>
                                            )}
                                        </div>
                                        <input
                                            type="text"
                                            name="studentId"
                                            value={laptopData.studentId}
                                            onChange={handleChange}
                                            placeholder="S12345678"
                                            className={`w-full px-4 py-3 rounded-xl border transition-all bg-white/50 backdrop-blur-sm ${
                                                errors.studentId || existingRecords.studentIdExists
                                                    ? 'border-red-500 focus:ring-2 focus:ring-red-500/20' 
                                                    : laptopData.studentId && !existingRecords.studentIdExists
                                                        ? 'border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20'
                                                        : 'border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                                            }`}
                                        />
                                        {errors.studentId && (
                                            <div className="flex items-center gap-2 mt-1">
                                                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-sm text-red-600">{errors.studentId}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Phone Number */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            <span className="flex items-center gap-1">
                                                <span>Phone Number</span>
                                                <span className="text-red-500">*</span>
                                            </span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={laptopData.phone}
                                            onChange={handleChange}
                                            placeholder="+251 900 000 000"
                                            className={`w-full px-4 py-3 rounded-xl border transition-all bg-white/50 backdrop-blur-sm ${
                                                errors.phone 
                                                    ? 'border-red-500 focus:ring-2 focus:ring-red-500/20' 
                                                    : 'border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                                            }`}
                                        />
                                        {errors.phone && (
                                            <div className="flex items-center gap-2 mt-1">
                                                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-sm text-red-600">{errors.phone}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            <span className="flex items-center gap-1">
                                                <span>Email Address</span>
                                                <span className="text-red-500">*</span>
                                            </span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={laptopData.email}
                                            onChange={handleChange}
                                            placeholder="student@aastu.edu.et"
                                            className={`w-full px-4 py-3 rounded-xl border transition-all bg-white/50 backdrop-blur-sm ${
                                                errors.email 
                                                    ? 'border-red-500 focus:ring-2 focus:ring-red-500/20' 
                                                    : 'border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                                            }`}
                                        />
                                        {errors.email && (
                                            <div className="flex items-center gap-2 mt-1">
                                                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-sm text-red-600">{errors.email}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Device Details Section */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                                        <FaLaptop className="text-blue-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800">Device Details</h3>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Serial Number */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="block text-sm font-semibold text-gray-700">
                                                <span className="flex items-center gap-1">
                                                    <span>Serial Number</span>
                                                    <span className="text-red-500">*</span>
                                                </span>
                                            </label>
                                            {laptopData.serialNumber && (
                                                <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                                                    existingRecords.serialNumberExists 
                                                        ? 'bg-red-100 text-red-800' 
                                                        : 'bg-green-100 text-green-800'
                                                }`}>
                                                    {existingRecords.serialNumberExists ? 'Already Registered' : 'Available'}
                                                </div>
                                            )}
                                        </div>
                                        <input
                                            type="text"
                                            name="serialNumber"
                                            value={laptopData.serialNumber}
                                            onChange={handleChange}
                                            placeholder="ABC-12345678"
                                            className={`w-full px-4 py-3 rounded-xl border transition-all bg-white/50 backdrop-blur-sm ${
                                                errors.serialNumber || existingRecords.serialNumberExists
                                                    ? 'border-red-500 focus:ring-2 focus:ring-red-500/20' 
                                                    : laptopData.serialNumber && !existingRecords.serialNumberExists
                                                        ? 'border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20'
                                                        : 'border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                                            }`}
                                        />
                                        {errors.serialNumber && (
                                            <div className="flex items-center gap-2 mt-1">
                                                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-sm text-red-600">{errors.serialNumber}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* MAC Address */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="block text-sm font-semibold text-gray-700">
                                                <span className="flex items-center gap-1">
                                                    <span>MAC Address</span>
                                                    <span className="text-red-500">*</span>
                                                </span>
                                            </label>
                                            {laptopData.macAddress && (
                                                <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                                                    existingRecords.macAddressExists 
                                                        ? 'bg-red-100 text-red-800' 
                                                        : 'bg-green-100 text-green-800'
                                                }`}>
                                                    {existingRecords.macAddressExists ? 'Already Registered' : 'Available'}
                                                </div>
                                            )}
                                        </div>
                                        <input
                                            type="text"
                                            name="macAddress"
                                            value={laptopData.macAddress}
                                            onChange={handleMacAddressChange}
                                            placeholder="XX:XX:XX:XX:XX:XX"
                                            maxLength="17"
                                            className={`w-full px-4 py-3 rounded-xl border transition-all bg-white/50 backdrop-blur-sm font-mono ${
                                                errors.macAddress || existingRecords.macAddressExists
                                                    ? 'border-red-500 focus:ring-2 focus:ring-red-500/20' 
                                                    : laptopData.macAddress && !existingRecords.macAddressExists
                                                        ? 'border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20'
                                                        : 'border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                                            }`}
                                        />
                                        {errors.macAddress && (
                                            <div className="flex items-center gap-2 mt-1">
                                                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-sm text-red-600">{errors.macAddress}</span>
                                            </div>
                                        )}
                                        <p className="text-xs text-gray-500 mt-1">
                                            Physical address of your Wi-Fi adapter
                                        </p>
                                    </div>

                                    {/* Operating System */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            <span className="flex items-center gap-1">
                                                <span>Operating System</span>
                                                <span className="text-red-500">*</span>
                                            </span>
                                        </label>
                                        <select
                                            name="operatingSystem"
                                            value={laptopData.operatingSystem}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 rounded-xl border transition-all bg-white/50 backdrop-blur-sm appearance-none cursor-pointer ${
                                                errors.operatingSystem 
                                                    ? 'border-red-500 focus:ring-2 focus:ring-red-500/20' 
                                                    : 'border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                                            }`}
                                        >
                                            <option value="">Select Operating System</option>
                                            {operatingSystems.map((os, index) => (
                                                <option key={index} value={os}>{os}</option>
                                            ))}
                                        </select>
                                        {errors.operatingSystem && (
                                            <div className="flex items-center gap-2 mt-1">
                                                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-sm text-red-600">{errors.operatingSystem}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Laptop Brand */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            <span className="flex items-center gap-1">
                                                <span>Laptop Brand</span>
                                                <span className="text-red-500">*</span>
                                            </span>
                                        </label>
                                        <select
                                            name="laptopBrand"
                                            value={laptopData.laptopBrand}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 rounded-xl border transition-all bg-white/50 backdrop-blur-sm appearance-none cursor-pointer ${
                                                errors.laptopBrand 
                                                    ? 'border-red-500 focus:ring-2 focus:ring-red-500/20' 
                                                    : 'border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                                            }`}
                                        >
                                            <option value="">Select Laptop Brand</option>
                                            {laptopBrands.map((brand) => (
                                                <option key={brand} value={brand}>{brand}</option>
                                            ))}
                                        </select>
                                        {errors.laptopBrand && (
                                            <div className="flex items-center gap-2 mt-1">
                                                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-sm text-red-600">{errors.laptopBrand}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Security Check */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-100 to-green-100 rounded-xl flex items-center justify-center">
                                        <FaShieldAlt className="text-emerald-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800">Security Verification</h3>
                                </div>
                                
                                <div className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 mt-1">
                                            <input
                                                type="checkbox"
                                                id="antiVirusInstalled"
                                                name="antiVirusInstalled"
                                                checked={laptopData.antiVirusInstalled}
                                                onChange={handleChange}
                                                className="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500 cursor-pointer"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="antiVirusInstalled" className="text-lg font-semibold text-gray-800 cursor-pointer block mb-2">
                                                Anti-Virus Software Installed
                                            </label>
                                            <p className="text-gray-600">
                                                Confirm that your laptop has active anti-virus protection. This is required for network security compliance.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="pt-8 border-t border-gray-200">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        type="submit"
                                        disabled={
                                            existingRecords.studentIdExists ||
                                            existingRecords.serialNumberExists ||
                                            existingRecords.macAddressExists ||
                                            isSubmitting
                                        }
                                        className={`flex-1 flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-offset-2 ${
                                            existingRecords.studentIdExists ||
                                            existingRecords.serialNumberExists ||
                                            existingRecords.macAddressExists ||
                                            isSubmitting
                                                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white focus:ring-indigo-500/20'
                                        }`}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <FaSpinner className="animate-spin" />
                                                <span>Processing...</span>
                                            </>
                                        ) : existingRecords.studentIdExists ||
                                          existingRecords.serialNumberExists ||
                                          existingRecords.macAddressExists ? (
                                            <>
                                                <FaTimes />
                                                <span>Duplicate Detected</span>
                                            </>
                                        ) : (
                                            <>
                                                <FaCheckCircle />
                                                <span>Register Laptop</span>
                                            </>
                                        )}
                                    </button>
                                    
                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        className="flex-1 flex items-center justify-center gap-3 py-3.5 px-6 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 font-semibold rounded-xl transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-gray-400/20 focus:ring-offset-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 0012 4.94M12 20.94a8.001 8.001 0 007.41-11.85m-5.877 2.11L12 9.22 17.653 3.5" />
                                        </svg>
                                        <span>Reset Form</span>
                                    </button>
                                </div>
                            </div>
                        </form>

                        {/* Help Section */}
                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl flex items-center justify-center">
                                    <FaInfoCircle className="text-amber-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Finding Your Information</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                                    <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                                        <span className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">📡</span>
                                        MAC Address
                                    </h4>
                                    <ul className="space-y-2 text-sm text-gray-700">
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-600 mt-1">•</span>
                                            <span><strong>Windows:</strong> Command Prompt → <code className="bg-blue-100 px-1 rounded">ipconfig /all</code></span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-600 mt-1">•</span>
                                            <span><strong>Mac:</strong> System Settings → Network → Advanced</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-600 mt-1">•</span>
                                            <span><strong>Linux:</strong> Terminal → <code className="bg-blue-100 px-1 rounded">ifconfig</code></span>
                                        </li>
                                    </ul>
                                </div>
                                
                                <div className="p-6 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
                                    <h4 className="font-bold text-emerald-800 mb-3 flex items-center gap-2">
                                        <span className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center">🏷️</span>
                                        Serial Number
                                    </h4>
                                    <ul className="space-y-2 text-sm text-gray-700">
                                        <li className="flex items-start gap-2">
                                            <span className="text-emerald-600 mt-1">•</span>
                                            <span>Check sticker on the <strong>bottom</strong> of laptop</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-emerald-600 mt-1">•</span>
                                            <span>BIOS/UEFI settings menu</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-emerald-600 mt-1">•</span>
                                            <span>Original packaging or receipt</span>
                                        </li>
                                    </ul>
                                </div>
                                
                                <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                                    <h4 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
                                        <span className="w-6 h-6 bg-amber-100 rounded-lg flex items-center justify-center">❓</span>
                                        Need Help?
                                    </h4>
                                    <p className="text-sm text-gray-700 mb-4">
                                        Contact the IT Support Desk for assistance with registration or locating required information.
                                    </p>
                                    <div className="text-xs text-gray-500 italic">
                                        All fields marked with <span className="text-red-500">*</span> are mandatory for successful registration.
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Duplicate Detection Alert */}
                        {(existingRecords.studentIdExists || existingRecords.serialNumberExists || existingRecords.macAddressExists) && (
                            <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-xl border border-red-200">
                                <h3 className="text-lg font-bold text-red-800 mb-4 flex items-center gap-2">
                                    <FaTimes className="text-red-600" />
                                    Duplicate Records Detected
                                </h3>
                                <ul className="space-y-2 text-sm text-red-700">
                                    {existingRecords.studentIdExists && (
                                        <li className="flex items-center gap-2">
                                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                            <span>Student ID <strong>"{laptopData.studentId}"</strong> is already registered</span>
                                        </li>
                                    )}
                                    {existingRecords.serialNumberExists && (
                                        <li className="flex items-center gap-2">
                                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                            <span>Serial Number <strong>"{laptopData.serialNumber}"</strong> is already registered</span>
                                        </li>
                                    )}
                                    {existingRecords.macAddressExists && (
                                        <li className="flex items-center gap-2">
                                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                            <span>MAC Address <strong>"{laptopData.macAddress}"</strong> is already registered</span>
                                        </li>
                                    )}
                                </ul>
                                <p className="text-sm text-red-600 mt-3 font-medium">
                                    Please correct these issues before submitting.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add animations */}
            <style>
                {`
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    
                    @keyframes scaleIn {
                        from { transform: scale(0.9); opacity: 0; }
                        to { transform: scale(1); opacity: 1; }
                    }
                    
                    @keyframes progressBar {
                        from { width: 0%; }
                        to { width: 100%; }
                    }
                    
                    .animate-fadeIn {
                        animation: fadeIn 0.3s ease-out;
                    }
                    
                    .animate-scaleIn {
                        animation: scaleIn 0.3s ease-out;
                    }
                    
                    .animate-progressBar {
                        animation: progressBar 3s linear;
                    }
                    
                    /* Custom scrollbar */
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
                `}
            </style>
        </div>
    );
}
export default Registration;