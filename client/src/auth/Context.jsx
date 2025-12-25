import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { dummyLaptopData } from "../assets/assets";
import axios from "axios"
import toast from "react-hot-toast";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

export const AppContext = createContext();

export const AppProvider = ({children}) => {
    const stu = true;

    // ✅ Load user from localStorage on initial render
    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem('user');
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (error) {
            console.error("Error loading user from localStorage:", error);
            return null;
        }
    });
    
    const [lists, setLists] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('All');
    const [selectedOS, setSelectedOS] = useState('All');
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

      const [showDel, setShowDel] = useState(false)
       const [isDarkMode, setIsDarkMode] = useState(true) 
    
    // ✅ Logout function
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        toast.success('Logged out successfully');
    };

    const axiosInstance = axios.create({
        baseURL: BACKEND_URL,
        headers: {
            'Content-Type': 'application/json',
        },
        timeout: 10000 // 10 second timeout
    });
    
    const [form, setForm] = useState({
        password: '',
        confirmPassword: '',
    });
    
    const [error, setError] = useState('');
    const [show, setShow] = useState(false);
    
    // ✅ Transform frontend data to backend format
    const transformToBackendFormat = (device) => {
        return {
            studentName: device.studentName || '',
            studentId: device.studentId || device.studentID || '',
            phone: device.phone || '',
            email: device.email || '',
            serialNumber: device.serialNumber || '',
            macAddress: device.macAddress || '',
            operatingSystem: device.operatingSystem || '',
            laptopBrand: device.laptopBrand || '',
            antiVirusInstalled: Boolean(device.antiVirusInstalled),
            verified: Boolean(device.verified || device.Verified)
        };
    };
    
    // ✅ Transform backend data to frontend format
    const transformToFrontendFormat = (device) => {
        return {
            id: device.id, // Keep as number
            studentName: device.studentName || '',
            studentId: device.studentId || '', // lowercase for frontend
            studentID: device.studentId || '', // uppercase for compatibility
            phone: device.phone || '',
            email: device.email || '',
            serialNumber: device.serialNumber || '',
            macAddress: device.macAddress || '',
            operatingSystem: device.operatingSystem || '',
            laptopBrand: device.laptopBrand || '',
            antiVirusInstalled: Boolean(device.antiVirusInstalled),
            verified: Boolean(device.verified), // lowercase for frontend
            Verified: Boolean(device.verified), // uppercase for compatibility
            createdAt: device.createdAt,
            updatedAt: device.updatedAt
        };
    };

    // ✅ Single function to fetch laptops from backend
    const fetchLaptopsFromBackend = async () => {
        try {
            setIsLoading(true);
            console.log("🌐 Fetching laptops from backend...");
            const response = await axiosInstance.get('/api/laptops');
            
            if (response.data && Array.isArray(response.data)) {
                const transformedData = response.data.map(device => transformToFrontendFormat(device));
                setLists(transformedData);
                
                // Save to localStorage as backup
                localStorage.setItem('laptopsData', JSON.stringify(transformedData));
                console.log("✅ Fetched laptops from backend:", transformedData.length);
                return transformedData;
            }
            return [];
        } catch (error) {
            console.error("❌ Failed to fetch laptops from backend:", error);
            
            // Fallback to localStorage
            try {
                const savedData = localStorage.getItem('laptopsData');
                if (savedData) {
                    const parsedData = JSON.parse(savedData);
                    setLists(parsedData);
                    console.log("📂 Loaded from localStorage:", parsedData.length);
                    return parsedData;
                }
            } catch (localError) {
                console.error("Failed to load from localStorage:", localError);
            }
            
            // Final fallback to dummy data
            const transformedData = dummyLaptopData.map(device => transformToFrontendFormat(device));
            setLists(transformedData);
            console.log("🎭 Loaded from dummy data:", transformedData.length);
            return transformedData;
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ UPDATE DEVICE FUNCTION - Fixed for Spring Boot
    const updateDevice = async (id, updatedData) => {
        try {
            console.log("🔄 Updating device ID:", id);
            console.log("📝 Updated data:", updatedData);
            
            // Convert ID to number (Spring expects Long)
            const deviceId = parseInt(id);
            
            // Transform data to backend format
            const backendData = transformToBackendFormat(updatedData);
            console.log("📤 Backend data:", backendData);
            
            try {
                // Update via API
                const response = await axiosInstance.put(`/api/laptops/${deviceId}`, backendData);
                console.log("✅ API response:", response.data);
                
                // Transform response to frontend format
                const transformedDevice = transformToFrontendFormat(response.data);
                
                // Update local state
                setLists(prevLists => {
                    const updatedLists = prevLists.map(device => 
                        device.id === deviceId ? transformedDevice : device
                    );
                    console.log("✅ Local state updated");
                    return updatedLists;
                });
                
                // Update localStorage
                try {
                    const savedData = localStorage.getItem('laptopsData');
                    if (savedData) {
                        const parsedData = JSON.parse(savedData);
                        const updatedStorageLists = parsedData.map(device => 
                            device.id === deviceId ? transformedDevice : device
                        );
                        localStorage.setItem('laptopsData', JSON.stringify(updatedStorageLists));
                        console.log("💾 localStorage updated");
                    }
                } catch (storageError) {
                    console.error("Error updating localStorage:", storageError);
                }
                
                toast.success('Device updated successfully!');
                return true;
                
            } catch (apiError) {
                console.error("❌ API update failed:", apiError);
                
                // Create transformed device for local update
                const transformedDevice = {
                    id: deviceId,
                    ...transformToFrontendFormat(backendData),
                    updatedAt: new Date().toISOString()
                };
                
                // Find existing device to preserve timestamps
                const existingDevice = lists.find(device => device.id === deviceId);
                if (existingDevice) {
                    transformedDevice.createdAt = existingDevice.createdAt;
                    transformedDevice.email = existingDevice.email || '';
                    transformedDevice.macAddress = existingDevice.macAddress || '';
                }
                
                // Update local state as fallback
                setLists(prevLists => {
                    const updatedLists = prevLists.map(device => 
                        device.id === deviceId ? transformedDevice : device
                    );
                    return updatedLists;
                });
                
                // Update localStorage
                try {
                    const savedData = localStorage.getItem('laptopsData');
                    if (savedData) {
                        const parsedData = JSON.parse(savedData);
                        const updatedStorageLists = parsedData.map(device => 
                            device.id === deviceId ? transformedDevice : device
                        );
                        localStorage.setItem('laptopsData', JSON.stringify(updatedStorageLists));
                    }
                } catch (storageError) {
                    console.error("Error updating localStorage:", storageError);
                }
                
                toast.success('Device updated locally (backend unavailable)!');
                return true;
            }
            
        } catch (error) {
            console.error("❌ Failed to update device:", error);
            toast.error('Failed to update device: ' + (error.response?.data?.message || error.message));
            return false;
        }
    };

    // ✅ DELETE DEVICE FUNCTION
    const deleteDevice = async (id) => {
        try {
            console.log("🗑️ Deleting device ID:", id);
            const deviceId = parseInt(id);
            
            try {
                // Delete from API
                await axiosInstance.delete(`/api/laptops/${deviceId}`);
                console.log("✅ Backend deletion successful");
            } catch (apiError) {
                console.warn("⚠️ Backend delete failed, proceeding with local delete");
            }
            
            // Update local state
            setLists(prevLists => {
                const filteredLists = prevLists.filter(device => device.id !== deviceId);
                console.log("✅ Local state updated, remaining:", filteredLists.length);
                return filteredLists;
            });
            
            // Update localStorage
            try {
                const savedData = localStorage.getItem('laptopsData');
                if (savedData) {
                    const parsedData = JSON.parse(savedData);
                    const filteredStorageLists = parsedData.filter(device => device.id !== deviceId);
                    localStorage.setItem('laptopsData', JSON.stringify(filteredStorageLists));
                    console.log("💾 localStorage updated");
                }
            } catch (storageError) {
                console.error("Error updating localStorage:", storageError);
            }
            
            toast.success('Device deleted successfully!');
            return true;
        } catch (error) {
            console.error("Failed to delete device:", error);
            toast.error('Failed to delete device');
            return false;
        }
    };

    // ✅ ADD DEVICE FUNCTION
    const addDevice = async (deviceData) => {
        try {
            console.log("➕ Adding new device:", deviceData);
            
            // Transform to backend format
            const backendData = transformToBackendFormat(deviceData);
            
            // Add to backend
            const response = await axiosInstance.post('/api/laptops/register', backendData);
            
            // Transform response
            const newDevice = transformToFrontendFormat(response.data);
            
            // Update local state
            setLists(prevLists => [...prevLists, newDevice]);
            
            // Update localStorage
            try {
                const savedData = localStorage.getItem('laptopsData');
                const currentLists = savedData ? JSON.parse(savedData) : [];
                localStorage.setItem('laptopsData', JSON.stringify([...currentLists, newDevice]));
            } catch (storageError) {
                console.error("Error updating localStorage:", storageError);
            }
            
            toast.success('Device added successfully!');
            return true;
        } catch (error) {
            console.error("Failed to add device:", error);
            
            // Check for duplicate errors
            if (error.response?.data) {
                const errors = error.response.data;
                if (errors.studentId) {
                    toast.error(errors.studentId);
                } else if (errors.serialNumber) {
                    toast.error(errors.serialNumber);
                } else if (errors.macAddress) {
                    toast.error(errors.macAddress);
                } else {
                    toast.error('Failed to add device');
                }
            } else {
                toast.error('Failed to add device: ' + error.message);
            }
            
            return false;
        }
    };

    // ✅ VERIFY DEVICE FUNCTION
    const verifyDevice = async (id) => {
        try {
            const deviceId = parseInt(id);
            const response = await axiosInstance.put(`/api/laptops/${deviceId}/verify`);
            const verifiedDevice = transformToFrontendFormat(response.data);
            
            // Update local state
            setLists(prevLists => 
                prevLists.map(device => 
                    device.id === deviceId ? verifiedDevice : device
                )
            );
            
            toast.success('Device verified successfully!');
            return true;
        } catch (error) {
            console.error("Failed to verify device:", error);
            toast.error('Failed to verify device');
            return false;
        }
    };

    // ✅ Filtering logic
    const filteredLists = lists.filter(list => {
        const matchesBrand = selectedBrand === 'All' || list?.laptopBrand === selectedBrand;
        const matchesOS = selectedOS === 'All' || list?.operatingSystem === selectedOS;
        const matchesSearch = !searchTerm || 
            (list?.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             list?.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             list?.macAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             (list?.studentId && list.studentId.toLowerCase().includes(searchTerm.toLowerCase())) ||
             (list?.studentID && list.studentID.toLowerCase().includes(searchTerm.toLowerCase())));
        
        return matchesBrand && matchesOS && matchesSearch;
    });

    // Verified lists (for admin view)
    const verifiedLists = filteredLists.filter(list => list?.verified || list?.Verified);
    
    // ✅ Save user to localStorage whenever it changes
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    // ✅ Save lists to localStorage when they change
    useEffect(() => {
        if (lists.length > 0) {
            try {
                localStorage.setItem('laptopsData', JSON.stringify(lists));
            } catch (error) {
                console.error("Error saving to localStorage:", error);
            }
        }
    }, [lists]);

    // ✅ Initial data loading
    useEffect(() => {
        console.log("🚀 Initializing app...");
        fetchLaptopsFromBackend();
    }, []);

    const value = {
        stu, 
        user, 
        setUser, 
        logout,
        formData,
        setFormData, 
        lists, 
        setLists, 
        searchTerm, 
        setSearchTerm, 
        axios: axiosInstance,
        selectedBrand, 
        setSelectedBrand,
        selectedOS,
        setSelectedOS,
        filteredLists, 
        verifiedLists,
        form,
        setForm,
        error,
        setError,
        show,
        setShow,
        isLoading,
        setIsLoading,
        updateDevice,
        deleteDevice,
        addDevice,
        verifyDevice,
        fetchLaptopsFromBackend,
        transformToBackendFormat,
        transformToFrontendFormat,
        showDel, setShowDel,
        isDarkMode, setIsDarkMode
    };
    
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);