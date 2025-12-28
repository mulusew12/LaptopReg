import { useAppContext } from '../auth/Context';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { FaArrowCircleLeft, FaCheckCircle, FaList, FaLaptop, FaUser, FaShieldAlt, FaInfoCircle, FaTimes, FaSpinner, FaSun, FaMoon } from 'react-icons/fa';
import NavBar from '../admin/NavBar';

const Registration = () => {
    const operatingSystems = ['Windows', 'Linux', 'MacOS', 'Other'];
    const laptopBrands = ['Dell', 'HP', 'Lenovo', 'Apple', 'Acer', 'Asus', 'Other'];
    const { user, formData, lists, setLists, axios, isDarkMode, setIsDarkMode } = useAppContext()
    const [showSuccess, setShowSuccess] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const navigate = useNavigate();

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

    // Theme configuration
    const theme = {
        bg: isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-blue-50',
        cardBg: isDarkMode ? 'bg-gray-800/95' : 'bg-white/95',
        text: isDarkMode ? 'text-gray-100' : 'text-gray-900',
        textSecondary: isDarkMode ? 'text-gray-400' : 'text-gray-600',
        border: isDarkMode ? 'border-gray-700' : 'border-gray-200',
        inputBg: isDarkMode ? 'bg-gray-700/50' : 'bg-white/80',
        inputBorder: isDarkMode ? 'border-gray-600' : 'border-gray-300',
        successBg: isDarkMode ? 'bg-green-900/20' : 'bg-gradient-to-r from-green-50 to-emerald-50',
        successBorder: isDarkMode ? 'border-green-800' : 'border-green-200',
        errorBg: isDarkMode ? 'bg-red-900/20' : 'bg-gradient-to-r from-red-50 to-red-100',
        errorBorder: isDarkMode ? 'border-red-800' : 'border-red-200',
        infoBg: isDarkMode ? 'bg-blue-900/20' : 'bg-gradient-to-r from-blue-50 to-indigo-50',
        infoBorder: isDarkMode ? 'border-blue-800' : 'border-blue-100',
        warningBg: isDarkMode ? 'bg-amber-900/20' : 'bg-gradient-to-r from-amber-50 to-orange-50',
        warningBorder: isDarkMode ? 'border-amber-800' : 'border-amber-100',
        gradient: isDarkMode 
            ? 'from-gray-800 via-gray-900 to-gray-800' 
            : 'from-white via-gray-50 to-white',
        shadow: isDarkMode ? 'shadow-xl shadow-black/20' : 'shadow-2xl shadow-gray-200/50',
        hover: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
    };

    // Check for existing records
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

    const validateForm = () => {
        const newErrors = {};

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            setIsSubmitting(true);
            try {
                const response = await axios.post('/api/laptops/register', laptopData);
                
                console.log('Laptop registered successfully:', response.data);
                toast.success('Registered successfully', {
                    style: {
                        background: isDarkMode ? '#1f2937' : '#fff',
                        color: isDarkMode ? '#fff' : '#000',
                        border: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                    },
                });
                
                setLists(prev => [...prev, response.data]);
                setShowSuccess(true);
                setIsSubmitted(true);
               
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
                
                if (error.response && error.response.data) {
                    const backendErrors = error.response.data;
                    setErrors(backendErrors);
                    toast.error('Registration failed. Please check errors.', {
                        style: {
                            background: isDarkMode ? '#1f2937' : '#fff',
                            color: isDarkMode ? '#fff' : '#000',
                            border: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                        },
                    });
                } else {
                    toast.error('Registration failed. Please try again.', {
                        style: {
                            background: isDarkMode ? '#1f2937' : '#fff',
                            color: isDarkMode ? '#fff' : '#000',
                            border: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                        },
                    });
                }
            } finally {
                setIsSubmitting(false);
            }
        }
    };

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

    // Theme Toggle Button Component
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

    return (
        <div className={`min-h-screen pt-23 pb-10 transition-colors duration-300 ${theme.bg}`}>
<NavBar/>
            <ThemeToggle />


            {/* Success Overlay */}
            {showSuccess && (
                <div className={`fixed inset-0 z-50 flex items-center justify-center ${
                    isDarkMode ? 'bg-black/80' : 'bg-black/50'
                } backdrop-blur-sm animate-fadeIn`}>
                    <div className={`rounded-2xl ${theme.shadow} p-8 md:p-12 max-w-md mx-4 transform animate-scaleIn ${
                        isDarkMode 
                            ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
                            : 'bg-gradient-to-br from-white to-emerald-50'
                    }`}>
                        <div className="relative mb-8 flex justify-center">
                            <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${
                                isDarkMode ? 'bg-green-700' : 'bg-green-400'
                            }`}></div>
                            <div className="relative">
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg ${
                                    isDarkMode 
                                        ? 'bg-gradient-to-r from-green-900/30 to-emerald-900/30' 
                                        : 'bg-gradient-to-r from-green-100 to-emerald-100'
                                }`}>
                                    <FaCheckCircle className={`${
                                        isDarkMode ? 'text-green-400' : 'text-green-500'
                                    } text-6xl animate-bounce`} />
                                </div>
                                <div className={`absolute -top-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center animate-pulse ${
                                    isDarkMode 
                                        ? 'bg-gradient-to-r from-emerald-700 to-green-700' 
                                        : 'bg-gradient-to-r from-emerald-500 to-green-500'
                                }`}>
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        
                        <div className="text-center">
                            <h1 className={`text-3xl font-bold mb-4 ${
                                isDarkMode 
                                    ? 'bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent' 
                                    : 'bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent'
                            }`}>
                                Registration Successful!
                            </h1>
                            <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                Your laptop has been registered successfully and added to the system.
                            </p>
                            
                            <div className="w-full h-2 mb-4 rounded-full overflow-hidden">
                                <div className={`h-full animate-progressBar ${
                                    isDarkMode 
                                        ? 'bg-gradient-to-r from-green-600 via-emerald-500 to-green-600' 
                                        : 'bg-gradient-to-r from-green-400 via-emerald-500 to-green-400'
                                }`}></div>
                            </div>
                            
                            <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Closing in 3 seconds...
                            </p>
                            
                            <button
                                onClick={() => setShowSuccess(false)}
                                className={`px-6 py-2.5 rounded-lg font-medium transition-all shadow-md hover:shadow-lg ${
                                    isDarkMode 
                                        ? 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white' 
                                        : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white'
                                }`}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="w-full px-4">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl shadow-lg mb-6 ${
                        isDarkMode 
                            ? 'bg-gradient-to-br from-indigo-900/30 to-blue-900/30' 
                            : 'bg-gradient-to-br from-indigo-100 to-blue-100'
                    }`}>
                        <FaLaptop className={`text-3xl ${
                            isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
                        }`} />
                    </div>
                    <h1 className={`text-4xl md:text-5xl font-bold mb-3 ${
                        isDarkMode 
                            ? 'bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent' 
                            : 'bg-gradient-to-r from-indigo-700 to-blue-600 bg-clip-text text-transparent'
                    }`}>
                        Laptop Registration
                    </h1>
                    <p className={`text-lg max-w-2xl mx-auto ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                        Register your laptop with the university system for tracking and management
                    </p>
                </div>

                {/* Main Card */}
                <div className={`rounded-2xl ${theme.shadow} overflow-hidden backdrop-blur-sm border ${
                    isDarkMode ? 'border-gray-700/50' : 'border-white/20'
                } ${theme.cardBg}`}>
                    <div className="p-6 md:p-8">
                        {/* Validation Rules Card */}
                        <div className={`mb-8 rounded-xl border p-6 shadow-inner ${
                            isDarkMode 
                                ? `${theme.infoBg} ${theme.infoBorder}` 
                                : `${theme.infoBg} ${theme.infoBorder}`
                        }`}>
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                        isDarkMode 
                                            ? 'bg-gradient-to-r from-red-900/20 to-red-800/20' 
                                            : 'bg-gradient-to-r from-red-100 to-red-50'
                                    }`}>
                                        <FaShieldAlt className={`${
                                            isDarkMode ? 'text-red-400' : 'text-red-500'
                                        } text-xl`} />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className={`text-lg font-bold mb-3 ${
                                        isDarkMode ? 'text-blue-300' : 'text-blue-800'
                                    }`}>
                                        Registration Requirements
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {[
                                            {
                                                title: 'One Student Policy',
                                                desc: 'Each student can register only one laptop',
                                                color: isDarkMode ? 'bg-red-400' : 'bg-red-500'
                                            },
                                            {
                                                title: 'Unique Laptop',
                                                desc: 'Each laptop can be registered only once',
                                                color: isDarkMode ? 'bg-red-400' : 'bg-red-500'
                                            },
                                            {
                                                title: 'MAC Address',
                                                desc: 'Duplicate MAC addresses are prohibited',
                                                color: isDarkMode ? 'bg-red-400' : 'bg-red-500'
                                            }
                                        ].map((item, index) => (
                                            <div key={index} className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                                                    <span className={`font-semibold ${
                                                        isDarkMode ? 'text-gray-200' : 'text-gray-800'
                                                    }`}>
                                                        {item.title}
                                                    </span>
                                                </div>
                                                <p className={`text-sm ${
                                                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                                }`}>
                                                    {item.desc}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Success Alert */}
                        {isSubmitted && !showSuccess && (
                            <div className={`mb-8 p-4 rounded-xl border shadow-sm ${
                                isDarkMode 
                                    ? `${theme.successBg} ${theme.successBorder}` 
                                    : `${theme.successBg} ${theme.successBorder}`
                            }`}>
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                        isDarkMode 
                                            ? 'bg-gradient-to-r from-green-900/30 to-emerald-900/30' 
                                            : 'bg-gradient-to-r from-green-100 to-emerald-100'
                                    }`}>
                                        <svg className={`w-5 h-5 ${
                                            isDarkMode ? 'text-green-400' : 'text-green-600'
                                        }`} fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <p className={`font-semibold ${
                                            isDarkMode ? 'text-green-300' : 'text-green-800'
                                        }`}>
                                            Registration submitted successfully!
                                        </p>
                                        <p className={`text-sm ${
                                            isDarkMode ? 'text-green-400' : 'text-green-600'
                                        }`}>
                                            Your laptop is now pending verification
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Main Form */}
                        <form onSubmit={handleSubmit} className={`space-y-8 rounded-2xl border p-6 ${
                            isDarkMode 
                                ? 'border-gray-700/50' 
                                : 'border-blue-200'
                        }`}>
                            {/* Student Information Section */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                        isDarkMode 
                                            ? 'bg-gradient-to-r from-indigo-900/30 to-blue-900/30' 
                                            : 'bg-gradient-to-r from-indigo-100 to-blue-100'
                                    }`}>
                                        <FaUser className={isDarkMode ? 'text-indigo-400' : 'text-indigo-600'} />
                                    </div>
                                    <h3 className={`text-xl font-bold ${
                                        isDarkMode ? 'text-gray-200' : 'text-gray-800'
                                    }`}>
                                        Student Information
                                    </h3>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[
                                        {
                                            name: 'studentName',
                                            label: 'Full Name',
                                            type: 'text',
                                            placeholder: 'John Doe'
                                        },
                                        {
                                            name: 'studentId',
                                            label: 'Student ID',
                                            type: 'text',
                                            placeholder: 'S12345678',
                                            showStatus: true
                                        },
                                        {
                                            name: 'phone',
                                            label: 'Phone Number',
                                            type: 'tel',
                                            placeholder: '+251 900 000 000'
                                        },
                                        {
                                            name: 'email',
                                            label: 'Email Address',
                                            type: 'email',
                                            placeholder: 'student@aastu.edu.et'
                                        }
                                    ].map((field) => (
                                        <div key={field.name} className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <label className={`block text-sm font-semibold ${
                                                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                    <span className="flex items-center gap-1">
                                                        <span>{field.label}</span>
                                                        <span className="text-red-500">*</span>
                                                    </span>
                                                </label>
                                                {field.showStatus && laptopData[field.name] && (
                                                    <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                                                        existingRecords[`${field.name}Exists`]
                                                            ? 'bg-red-100 text-red-800' 
                                                            : 'bg-green-100 text-green-800'
                                                    }`}>
                                                        {existingRecords[`${field.name}Exists`] ? 'Already Registered' : 'Available'}
                                                    </div>
                                                )}
                                            </div>
                                            <input
                                                type={field.type}
                                                name={field.name}
                                                value={laptopData[field.name]}
                                                onChange={handleChange}
                                                placeholder={field.placeholder}
                                                className={`w-full px-4 py-3 rounded-xl border transition-all backdrop-blur-sm ${
                                                    errors[field.name] || (field.showStatus && existingRecords[`${field.name}Exists`])
                                                        ? 'border-red-500 focus:ring-2 focus:ring-red-500/20' 
                                                        : laptopData[field.name] && field.showStatus && !existingRecords[`${field.name}Exists`]
                                                            ? 'border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20'
                                                            : `${theme.inputBorder} focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20`
                                                } ${theme.inputBg} ${theme.text}`}
                                            />
                                            {errors[field.name] && (
                                                <div className="flex items-center gap-2 mt-1">
                                                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className={`text-sm ${
                                                        isDarkMode ? 'text-red-400' : 'text-red-600'
                                                    }`}>
                                                        {errors[field.name]}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Device Details Section */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                        isDarkMode 
                                            ? 'bg-gradient-to-r from-blue-900/30 to-indigo-900/30' 
                                            : 'bg-gradient-to-r from-blue-100 to-indigo-100'
                                    }`}>
                                        <FaLaptop className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
                                    </div>
                                    <h3 className={`text-xl font-bold ${
                                        isDarkMode ? 'text-gray-200' : 'text-gray-800'
                                    }`}>
                                        Device Details
                                    </h3>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[
                                        {
                                            name: 'serialNumber',
                                            label: 'Serial Number',
                                            type: 'text',
                                            placeholder: 'ABC-12345678',
                                            showStatus: true
                                        },
                                        {
                                            name: 'macAddress',
                                            label: 'MAC Address',
                                            type: 'text',
                                            placeholder: 'XX:XX:XX:XX:XX:XX',
                                            showStatus: true,
                                            customChange: handleMacAddressChange
                                        },
                                        {
                                            name: 'operatingSystem',
                                            label: 'Operating System',
                                            type: 'select',
                                            options: operatingSystems
                                        },
                                        {
                                            name: 'laptopBrand',
                                            label: 'Laptop Brand',
                                            type: 'select',
                                            options: laptopBrands
                                        }
                                    ].map((field) => (
                                        <div key={field.name} className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <label className={`block text-sm font-semibold ${
                                                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                    <span className="flex items-center gap-1">
                                                        <span>{field.label}</span>
                                                        <span className="text-red-500">*</span>
                                                    </span>
                                                </label>
                                                {field.showStatus && laptopData[field.name] && (
                                                    <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                                                        existingRecords[`${field.name}Exists`]
                                                            ? 'bg-red-100 text-red-800' 
                                                            : 'bg-green-100 text-green-800'
                                                    }`}>
                                                        {existingRecords[`${field.name}Exists`] ? 'Already Registered' : 'Available'}
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {field.type === 'select' ? (
                                                <select
                                                    name={field.name}
                                                    value={laptopData[field.name]}
                                                    onChange={handleChange}
                                                    className={`w-full px-4 py-3 rounded-xl border transition-all backdrop-blur-sm appearance-none cursor-pointer ${
                                                        errors[field.name] 
                                                            ? 'border-red-500 focus:ring-2 focus:ring-red-500/20' 
                                                            : `${theme.inputBorder} focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20`
                                                    } ${theme.inputBg} ${theme.text}`}
                                                >
                                                    <option value="">Select {field.label}</option>
                                                    {field.options.map((option) => (
                                                        <option key={option} value={option}>{option}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <input
                                                    type={field.type}
                                                    name={field.name}
                                                    value={laptopData[field.name]}
                                                    onChange={field.customChange || handleChange}
                                                    placeholder={field.placeholder}
                                                    maxLength={field.name === 'macAddress' ? "17" : undefined}
                                                    className={`w-full px-4 py-3 rounded-xl border transition-all backdrop-blur-sm ${
                                                        errors[field.name] || (field.showStatus && existingRecords[`${field.name}Exists`])
                                                            ? 'border-red-500 focus:ring-2 focus:ring-red-500/20' 
                                                            : laptopData[field.name] && field.showStatus && !existingRecords[`${field.name}Exists`]
                                                                ? 'border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20'
                                                                : `${theme.inputBorder} focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20`
                                                    } ${theme.inputBg} ${theme.text} ${field.name === 'macAddress' ? 'font-mono' : ''}`}
                                                />
                                            )}
                                            
                                            {errors[field.name] && (
                                                <div className="flex items-center gap-2 mt-1">
                                                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className={`text-sm ${
                                                        isDarkMode ? 'text-red-400' : 'text-red-600'
                                                    }`}>
                                                        {errors[field.name]}
                                                    </span>
                                                </div>
                                            )}
                                            
                                            {field.name === 'macAddress' && (
                                                <p className={`text-xs mt-1 ${
                                                    isDarkMode ? 'text-gray-500' : 'text-gray-500'
                                                }`}>
                                                    Physical address of your Wi-Fi adapter
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Security Check */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                        isDarkMode 
                                            ? 'bg-gradient-to-r from-emerald-900/30 to-green-900/30' 
                                            : 'bg-gradient-to-r from-emerald-100 to-green-100'
                                    }`}>
                                        <FaShieldAlt className={isDarkMode ? 'text-emerald-400' : 'text-emerald-600'} />
                                    </div>
                                    <h3 className={`text-xl font-bold ${
                                        isDarkMode ? 'text-gray-200' : 'text-gray-800'
                                    }`}>
                                        Security Verification
                                    </h3>
                                </div>
                                
                                <div className={`p-6 rounded-xl border ${
                                    isDarkMode 
                                        ? `${theme.successBg} ${theme.successBorder}` 
                                        : `${theme.successBg} ${theme.successBorder}`
                                }`}>
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 mt-1">
                                            <input
                                                type="checkbox"
                                                id="antiVirusInstalled"
                                                name="antiVirusInstalled"
                                                checked={laptopData.antiVirusInstalled}
                                                onChange={handleChange}
                                                className={`w-5 h-5 rounded border cursor-pointer ${
                                                    isDarkMode 
                                                        ? 'text-emerald-400 bg-gray-700 border-gray-600 focus:ring-emerald-500' 
                                                        : 'text-emerald-600 border-gray-300 focus:ring-emerald-500'
                                                }`}
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="antiVirusInstalled" className={`text-lg font-semibold cursor-pointer block mb-2 ${
                                                isDarkMode ? 'text-gray-200' : 'text-gray-800'
                                            }`}>
                                                Anti-Virus Software Installed
                                            </label>
                                            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                                                Confirm that your laptop has active anti-virus protection. This is required for network security compliance.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
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
                                                ? isDarkMode 
                                                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                                                    : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                                : isDarkMode 
                                                    ? 'bg-gradient-to-r from-indigo-700 to-blue-700 hover:from-indigo-600 hover:to-blue-600 text-white focus:ring-indigo-500/20' 
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
                                        className={`flex-1 flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-offset-2 ${
                                            isDarkMode 
                                                ? 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-gray-200 focus:ring-gray-400/20' 
                                                : 'bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 focus:ring-gray-400/20'
                                        }`}
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
                        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3 mb-6">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                    isDarkMode 
                                        ? 'bg-gradient-to-r from-amber-900/30 to-orange-900/30' 
                                        : 'bg-gradient-to-r from-amber-100 to-orange-100'
                                }`}>
                                    <FaInfoCircle className={isDarkMode ? 'text-amber-400' : 'text-amber-600'} />
                                </div>
                                <h3 className={`text-xl font-bold ${
                                    isDarkMode ? 'text-gray-200' : 'text-gray-800'
                                }`}>
                                    Finding Your Information
                                </h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    {
                                        title: 'MAC Address',
                                        icon: '📡',
                                        color: isDarkMode ? 'from-blue-900/20 to-indigo-900/20' : 'from-blue-50 to-indigo-50',
                                        border: isDarkMode ? 'border-blue-800' : 'border-blue-100',
                                        textColor: isDarkMode ? 'text-blue-300' : 'text-blue-800',
                                        items: [
                                            { os: 'Windows', cmd: 'Command Prompt → ipconfig /all' },
                                            { os: 'Mac', cmd: 'System Settings → Network → Advanced' },
                                            { os: 'Linux', cmd: 'Terminal → ifconfig' }
                                        ]
                                    },
                                    {
                                        title: 'Serial Number',
                                        icon: '🏷️',
                                        color: isDarkMode ? 'from-emerald-900/20 to-green-900/20' : 'from-emerald-50 to-green-50',
                                        border: isDarkMode ? 'border-emerald-800' : 'border-emerald-100',
                                        textColor: isDarkMode ? 'text-emerald-300' : 'text-emerald-800',
                                        items: [
                                            { os: 'Location', cmd: 'Check sticker on the bottom of laptop' },
                                            { os: 'BIOS/UEFI', cmd: 'BIOS/UEFI settings menu' },
                                            { os: 'Packaging', cmd: 'Original packaging or receipt' }
                                        ]
                                    },
                                    {
                                        title: 'Need Help?',
                                        icon: '❓',
                                        color: isDarkMode ? 'from-amber-900/20 to-orange-900/20' : 'from-amber-50 to-orange-50',
                                        border: isDarkMode ? 'border-amber-800' : 'border-amber-100',
                                        textColor: isDarkMode ? 'text-amber-300' : 'text-amber-800',
                                        note: 'Contact the IT Support Desk for assistance with registration or locating required information.',
                                        footer: 'All fields marked with * are mandatory for successful registration.'
                                    }
                                ].map((section, index) => (
                                    <div key={index} className={`p-6 rounded-xl border ${section.color} ${section.border}`}>
                                        <h4 className={`font-bold mb-3 flex items-center gap-2 ${section.textColor}`}>
                                            <span className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                                                isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'
                                            }`}>
                                                {section.icon}
                                            </span>
                                            {section.title}
                                        </h4>
                                        {section.items ? (
                                            <ul className="space-y-2 text-sm">
                                                {section.items.map((item, idx) => (
                                                    <li key={idx} className={`flex items-start gap-2 ${
                                                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                                    }`}>
                                                        <span className={`mt-1 ${
                                                            isDarkMode ? 'text-blue-400' : 'text-blue-600'
                                                        }`}>•</span>
                                                        <span>
                                                            <strong>{item.os}:</strong> {item.cmd}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <>
                                                <p className={`text-sm mb-4 ${
                                                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                    {section.note}
                                                </p>
                                                <div className={`text-xs italic ${
                                                    isDarkMode ? 'text-gray-500' : 'text-gray-500'
                                                }`}>
                                                    {section.footer}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Duplicate Detection Alert */}
                        {(existingRecords.studentIdExists || existingRecords.serialNumberExists || existingRecords.macAddressExists) && (
                            <div className={`mt-8 p-6 rounded-xl border ${
                                isDarkMode 
                                    ? `${theme.errorBg} ${theme.errorBorder}` 
                                    : `${theme.errorBg} ${theme.errorBorder}`
                            }`}>
                                <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${
                                    isDarkMode ? 'text-red-300' : 'text-red-800'
                                }`}>
                                    <FaTimes className={isDarkMode ? 'text-red-400' : 'text-red-600'} />
                                    Duplicate Records Detected
                                </h3>
                                <ul className="space-y-2 text-sm">
                                    {existingRecords.studentIdExists && (
                                        <li className={`flex items-center gap-2 ${
                                            isDarkMode ? 'text-red-300' : 'text-red-700'
                                        }`}>
                                            <span className={`w-2 h-2 rounded-full ${
                                                isDarkMode ? 'bg-red-400' : 'bg-red-500'
                                            }`}></span>
                                            <span>Student ID <strong>"{laptopData.studentId}"</strong> is already registered</span>
                                        </li>
                                    )}
                                    {existingRecords.serialNumberExists && (
                                        <li className={`flex items-center gap-2 ${
                                            isDarkMode ? 'text-red-300' : 'text-red-700'
                                        }`}>
                                            <span className={`w-2 h-2 rounded-full ${
                                                isDarkMode ? 'bg-red-400' : 'bg-red-500'
                                            }`}></span>
                                            <span>Serial Number <strong>"{laptopData.serialNumber}"</strong> is already registered</span>
                                        </li>
                                    )}
                                    {existingRecords.macAddressExists && (
                                        <li className={`flex items-center gap-2 ${
                                            isDarkMode ? 'text-red-300' : 'text-red-700'
                                        }`}>
                                            <span className={`w-2 h-2 rounded-full ${
                                                isDarkMode ? 'bg-red-400' : 'bg-red-500'
                                            }`}></span>
                                            <span>MAC Address <strong>"{laptopData.macAddress}"</strong> is already registered</span>
                                        </li>
                                    )}
                                </ul>
                                <p className={`text-sm mt-3 font-medium ${
                                    isDarkMode ? 'text-red-400' : 'text-red-600'
                                }`}>
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
                    
                    @keyframes spin-slow {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
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
}
export default Registration;