import React, { useState, useEffect } from 'react';
import { useAppContext } from '../auth/Context';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Success from '../shared/Success';

const Registration = () => {
    // ** Unchanged Functional Arrays **
    const operatingSystems = ['Windows', 'Linux', 'MacOS', 'Other'];
    const laptopBrands = ['Dell', 'HP', 'Lenovo', 'Apple', 'Acer', 'Asus', 'Other'];
    const { user, formData, lists, setLists } = useAppContext()
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

    // ** Generate unique ID for new laptop **
    const generateUniqueId = () => {
        if (lists && lists.length > 0) {
            const maxId = Math.max(...lists.map(item => item._id || 0));
            return maxId + 1;
        }
        return lists.length + 1;
    };

    // ** Updated Submit Handler with validation checks **
    const handleSubmit = (e) => {
        e.preventDefault();

        // Final check before submission
        if (existingRecords.studentIdExists) {
            setErrors(prev => ({
                ...prev,
                studentId: 'This student already has a registered laptop'
            }));
            return;
        }

        if (existingRecords.serialNumberExists) {
            setErrors(prev => ({
                ...prev,
                serialNumber: 'This laptop is already registered'
            }));
            return;
        }

        if (existingRecords.macAddressExists) {
            setErrors(prev => ({
                ...prev,
                macAddress: 'This MAC Address is already registered'
            }));
            return;
        }

        if (validateForm()) {
            // Create new laptop object with unique ID
            const newLaptop = {
                _id: generateUniqueId(),
                ...laptopData,
                verified: false,
                createdAt: new Date().toISOString(),
            };

         

            console.log('Form submitted successfully:', newLaptop);
             toast.success('Registered successfully')
            // Add to context
            setLists(prev => [...prev, newLaptop]);

            setTimeout(()=>{
                   navigate('/success')
            }, 2000)

            // NOTE: API call placeholder is preserved
        
            setIsSubmitted(true);

            // Reset form after 3 seconds
            setTimeout(() => {
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
                    verified: false,
                });
                setExistingRecords({
                    studentIdExists: false,
                    serialNumberExists: false,
                    macAddressExists: false,
                });
                setIsSubmitted(false);

            }, 100);
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
        <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="w-full mx-auto">

                {/* --- Main Card with Enhanced Shadow and Border --- */}
                <div className="bg-white shadow-2xl rounded-xl p-8 md:p-12 border-t-8 border-indigo-600">

                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
                            🖥️ Laptop Registration Form
                        </h1>
                        <p className="text-lg text-gray-600">
                            Please provide the necessary technical details for your device.
                        </p>

                        {/* Validation Rules Display */}
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <h3 className="text-lg font-semibold text-blue-800 mb-2">📋 Registration Rules:</h3>
                            <ul className="text-sm text-blue-700 text-left space-y-1">
                                <li className="flex items-center">
                                    <svg className="w-4 h-4 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <span className="font-medium">1 student = 1 laptop</span>
                                </li>
                                <li className="flex items-center">
                                    <svg className="w-4 h-4 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <span className="font-medium">1 laptop cannot be registered multiple times</span>
                                </li>
                                <li className="flex items-center">
                                    <svg className="w-4 h-4 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <span className="font-medium">Duplicate MAC addresses are not allowed</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* --- Submission Success Alert --- */}
                    {isSubmitted && (
                        <div className="mb-8 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg shadow-md">
                            <div className="flex items-center">
                                <svg className="w-6 h-6 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-green-800 font-semibold">
                                    Laptop Registered Successfully!
                                </span>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* --- Student Information Section --- */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6 border-gray-200">
                            <h2 className="col-span-full text-xl font-bold text-indigo-700">Student Information</h2>

                            {/* Student Name Field */}
                            <div className="space-y-2">
                                <label htmlFor="studentName" className="block text-sm font-semibold text-gray-700">
                                    Student Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="studentName"
                                    name="studentName"
                                    value={laptopData.studentName}
                                    onChange={handleChange}
                                    placeholder="Jane Doe"
                                    className={`w-full px-4 py-2.5 border rounded-lg transition-all shadow-sm ${errors.studentName
                                        ? 'border-red-500 ring-1 ring-red-500 bg-red-50'
                                        : 'border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                                        }`}
                                />
                                {errors.studentName && (
                                    <p className="text-xs text-red-600 flex items-center mt-1">
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                        {errors.studentName}
                                    </p>
                                )}
                            </div>

                            {/* Student ID Field with real-time validation */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label htmlFor="studentId" className="block text-sm font-semibold text-gray-700">
                                        Student ID <span className="text-red-500">*</span>
                                    </label>
                                    {laptopData.studentId && (
                                        <div className="flex items-center">
                                            {existingRecords.studentIdExists ? (
                                                <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded flex items-center">
                                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                    </svg>
                                                    Already registered
                                                </span>
                                            ) : (
                                                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded flex items-center">
                                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    Available
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="text"
                                    id="studentId"
                                    name="studentId"
                                    value={laptopData.studentId}
                                    onChange={handleChange}
                                    placeholder="S12345678"
                                    className={`w-full px-4 py-2.5 border rounded-lg transition-all shadow-sm ${errors.studentId || existingRecords.studentIdExists
                                        ? 'border-red-500 ring-1 ring-red-500 bg-red-50'
                                        : existingRecords.studentIdExists === false && laptopData.studentId
                                            ? 'border-green-500 ring-1 ring-green-500 bg-green-50'
                                            : 'border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                                        }`}
                                />
                                {errors.studentId && (
                                    <p className="text-xs text-red-600 flex items-center mt-1">
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                        {errors.studentId}
                                    </p>
                                )}
                                {laptopData.studentId && existingRecords.studentIdExists && !errors.studentId && (
                                    <p className="text-xs text-red-600 flex items-center mt-1">
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        This student already has a registered laptop
                                    </p>
                                )}
                            </div>
                       {/*  phone*/}

                                 <div className="space-y-2">
                                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="phone"
                                    id="phone"
                                    name="phone"
                                    value={laptopData.phone}
                                    onChange={handleChange}
                                    placeholder="+251900----"
                                    className={`w-full px-4 py-2.5 border rounded-lg transition-all shadow-sm ${errors.phone
                                        ? 'border-red-500 ring-1 ring-red-500 bg-red-50'
                                        : 'border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                                        }`}
                                />
                                {errors.phone && (
                                    <p className="text-xs text-red-600 flex items-center mt-1">
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                        {errors.phone}
                                    </p>
                                )}
                            </div>
                            {/* --- email --- */}
                                 <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={laptopData.email}
                                    onChange={handleChange}
                                    placeholder="abc12@gmail.com"
                                    className={`w-full px-4 py-2.5 border rounded-lg transition-all shadow-sm ${errors.email
                                        ? 'border-red-500 ring-1 ring-red-500 bg-red-50'
                                        : 'border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                                        }`}
                                />
                                {errors.email && (
                                    <p className="text-xs text-red-600 flex items-center mt-1">
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                        {errors.email}
                                    </p>
                                )}
                            </div>
                        </div>

                        
                        {/* --- Laptop Technical Details Section --- */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6 border-gray-200">
                            <h2 className="col-span-full text-xl font-bold text-indigo-700">Device Details</h2>

                            {/* Serial Number Field with real-time validation */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label htmlFor="serialNumber" className="block text-sm font-semibold text-gray-700">
                                        Serial Number <span className="text-red-500">*</span>
                                    </label>
                                    {laptopData.serialNumber && (
                                        <div className="flex items-center">
                                            {existingRecords.serialNumberExists ? (
                                                <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded flex items-center">
                                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                    </svg>
                                                    Already registered
                                                </span>
                                            ) : (
                                                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded flex items-center">
                                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    Available
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="text"
                                    id="serialNumber"
                                    name="serialNumber"
                                    value={laptopData.serialNumber}
                                    onChange={handleChange}
                                    placeholder="ABC-12345678"
                                    className={`w-full px-4 py-2.5 border rounded-lg transition-all shadow-sm ${errors.serialNumber || existingRecords.serialNumberExists
                                        ? 'border-red-500 ring-1 ring-red-500 bg-red-50'
                                        : existingRecords.serialNumberExists === false && laptopData.serialNumber
                                            ? 'border-green-500 ring-1 ring-green-500 bg-green-50'
                                            : 'border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                                        }`}
                                />
                                {errors.serialNumber && (
                                    <p className="text-xs text-red-600 flex items-center mt-1">
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                        {errors.serialNumber}
                                    </p>
                                )}
                            </div>

                            {/* MAC Address Field with real-time validation */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label htmlFor="macAddress" className="block text-sm font-semibold text-gray-700">
                                        MAC Address <span className="text-red-500">*</span>
                                    </label>
                                    {laptopData.macAddress && (
                                        <div className="flex items-center">
                                            {existingRecords.macAddressExists ? (
                                                <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded flex items-center">
                                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                    </svg>
                                                    Already registered
                                                </span>
                                            ) : (
                                                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded flex items-center">
                                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    Available
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="text"
                                    id="macAddress"
                                    name="macAddress"
                                    value={laptopData.macAddress}
                                    onChange={handleMacAddressChange}
                                    placeholder="XX:XX:XX:XX:XX:XX"
                                    maxLength="17"
                                    className={`w-full px-4 py-2.5 border rounded-lg transition-all font-mono shadow-sm ${errors.macAddress || existingRecords.macAddressExists
                                        ? 'border-red-500 ring-1 ring-red-500 bg-red-50'
                                        : existingRecords.macAddressExists === false && laptopData.macAddress
                                            ? 'border-green-500 ring-1 ring-green-500 bg-green-50'
                                            : 'border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                                        }`}
                                />
                                {errors.macAddress && (
                                    <p className="text-xs text-red-600 flex items-center mt-1">
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                        {errors.macAddress}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                    Format: XX:XX:XX:XX:XX:XX (Physical Address of your Wi-Fi adapter)
                                </p>
                            </div>

                            {/* Operating System Dropdown */}
                            <div className="space-y-2">
                                <label htmlFor="operatingSystem" className="block text-sm font-semibold text-gray-700">
                                    Operating System <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="operatingSystem"
                                    name="operatingSystem"
                                    value={laptopData.operatingSystem}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2.5 border rounded-lg bg-white appearance-none cursor-pointer transition-all shadow-sm ${errors.operatingSystem
                                        ? 'border-red-500 ring-1 ring-red-500 bg-red-50'
                                        : 'border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                                        }`}
                                >
                                    <option value="" disabled>Select an OS</option>
                                    {operatingSystems.map((os, index) => (
                                        <option key={index} value={os}>{os}</option>
                                    ))}
                                </select>
                                {errors.operatingSystem && (
                                    <p className="text-xs text-red-600 flex items-center mt-1">
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                        {errors.operatingSystem}
                                    </p>
                                )}
                            </div>

                            {/* Laptop Brand Dropdown */}
                            <div className="space-y-2">
                                <label htmlFor="laptopBrand" className="block text-sm font-semibold text-gray-700">
                                    Laptop Brand <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="laptopBrand"
                                    name="laptopBrand"
                                    value={laptopData.laptopBrand}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2.5 border rounded-lg bg-white appearance-none cursor-pointer transition-all shadow-sm ${errors.laptopBrand
                                        ? 'border-red-500 ring-1 ring-red-500 bg-red-50'
                                        : 'border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                                        }`}
                                >
                                    <option value="" disabled>Select a brand</option>
                                    {laptopBrands.map((brand, index) => (
                                        <option key={brand} value={brand}>{brand}</option>
                                    ))}
                                </select>
                                {errors.laptopBrand && (
                                    <p className="text-xs text-red-600 flex items-center mt-1">
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                        {errors.laptopBrand}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* --- Security Checkbox --- */}
                        <div className="space-y-3">
                            <h2 className="text-xl font-bold text-indigo-700 border-b pb-3">Security Check</h2>
                            <div className="flex items-start">
                                <div className="flex items-center h-5 mt-1">
                                    <input
                                        type="checkbox"
                                        id="antiVirusInstalled"
                                        name="antiVirusInstalled"
                                        checked={laptopData.antiVirusInstalled}
                                        onChange={handleChange}
                                        className="h-5 w-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 cursor-pointer"
                                    />
                                </div>
                                <label htmlFor="antiVirusInstalled" className="ml-3 text-base font-semibold text-gray-700 cursor-pointer">
                                    Is Anti-Virus Software Currently Installed and Active?
                                </label>
                            </div>
                            <p className="text-sm text-gray-500 ml-8">
                                Checking this box confirms that your laptop is protected by current antivirus software. This is a security requirement.
                            </p>
                        </div>

                        {/* --- Form Buttons with validation state --- */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                            <button
                                type="submit"
                                disabled={
                                    existingRecords.studentIdExists ||
                                    existingRecords.serialNumberExists ||
                                    existingRecords.macAddressExists
                                }
                                className={`flex-1 flex items-center justify-center font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-offset-2 ${existingRecords.studentIdExists ||
                                    existingRecords.serialNumberExists ||
                                    existingRecords.macAddressExists
                                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                    : 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500'
                                    }`}
                            >
                                {existingRecords.studentIdExists ||
                                    existingRecords.serialNumberExists ||
                                    existingRecords.macAddressExists ? (
                                    <>
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        Duplicate Detected
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Register Laptop
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={handleReset}
                                className="flex-1 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 0012 4.94M12 20.94a8.001 8.001 0 007.41-11.85m-5.877 2.11L12 9.22 17.653 3.5" />
                                </svg>
                                Reset Form
                            </button>
                        </div>
                    </form>

                    {/* --- Information / Help Section --- */}
                    <div className="mt-10 pt-6 border-t-2 border-dashed border-gray-200">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Need Help Finding Your Info?</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
                            <div className="p-4 bg-indigo-50 rounded-lg shadow-inner">
                                <h4 className="font-bold text-indigo-700 mb-2">📡 Finding MAC Address</h4>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>**Windows:** Open Command Prompt, type <code className="bg-indigo-100 px-1 rounded font-mono">ipconfig /all</code> (Look for 'Physical Address').</li>
                                    <li>**Mac:** System Settings → Network → Advanced.</li>
                                    <li>**Linux:** Terminal, type <code className="bg-indigo-100 px-1 rounded font-mono">ifconfig</code> or <code className="bg-indigo-100 px-1 rounded font-mono">ip a</code>.</li>
                                </ul>
                            </div>
                            <div className="p-4 bg-indigo-50 rounded-lg shadow-inner">
                                <h4 className="font-bold text-indigo-700 mb-2">🏷️ Serial Number Location</h4>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Sticker/Engraving on the **bottom** of the laptop.</li>
                                    <li>Inside **BIOS/UEFI** settings.</li>
                                    <li>Original **packaging** or **receipt**.</li>
                                    <li>Windows Command: <code className="bg-indigo-100 px-1 rounded font-mono">wmic bios get serialnumber</code></li>
                                </ul>
                            </div>
                            <div className="p-4 bg-indigo-50 rounded-lg shadow-inner">
                                <h4 className="font-bold text-indigo-700 mb-2">❓ General Support</h4>
                                <p>If you cannot locate any required information, please contact the **IT Support Desk** immediately.</p>
                                <p className="text-xs mt-3 italic">
                                    All fields marked with an asterisk <span className="text-red-500">*</span> are mandatory for successful registration.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* --- Validation Summary --- */}
                    {(existingRecords.studentIdExists || existingRecords.serialNumberExists || existingRecords.macAddressExists) && (
                        <div className="mt-8 p-6 bg-red-50 rounded-lg border border-red-200">
                            <h3 className="text-lg font-bold text-red-800 mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                Duplicate Detection
                            </h3>
                            <ul className="text-sm text-red-700 space-y-2">
                                {existingRecords.studentIdExists && (
                                    <li className="flex items-center">
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        <span className="font-medium">Student ID "{laptopData.studentId}"</span> is already registered to another laptop
                                    </li>
                                )}
                                {existingRecords.serialNumberExists && (
                                    <li className="flex items-center">
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        <span className="font-medium">Serial Number "{laptopData.serialNumber}"</span> is already registered
                                    </li>
                                )}
                                {existingRecords.macAddressExists && (
                                    <li className="flex items-center">
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        <span className="font-medium">MAC Address "{laptopData.macAddress}"</span> is already registered
                                    </li>
                                )}
                            </ul>
                            <p className="text-sm text-red-600 mt-3">
                                Please correct these issues before submitting the form.
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <div onClick={()=>navigate('/')} className='fixed top-10 z-100 cursor-pointer py-1 bg-white border px-5 left-2'>
                 <button className='cursor-pointer '>Back</button>
            </div>
              <div onClick={()=>navigate('/list')} className='fixed top-10 z-100 cursor-pointer py-1 bg-white border px-5 right-2'>
                 <button className='cursor-pointer '>List</button>
            </div>
        </div>
    );
}
export default Registration;