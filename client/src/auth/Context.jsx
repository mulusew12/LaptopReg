import { createContext, useContext, useEffect, useState } from "react";
import { dummyLaptopData } from "../assets/assets";
import axios from "axios"

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
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('All');
    const [selectedOS, setSelectedOS] = useState('All');
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    // ✅ Logout function
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

   const axiosInstance = axios.create({
    baseURL: BACKEND_URL,
    headers: {
        'Content-Type': 'application/json',
    }
    });
    
    // ✅ Single function to fetch laptops from backend
    const fetchLaptopsFromBackend = async () => {
        try {
            const response = await axiosInstance.get('/api/laptops');
            setLists(response.data);
            console.log("Fetched laptops from backend:", response.data.length);
        } catch (error) {
            console.error("Failed to fetch laptops:", error);
            // Fallback to dummy data only if backend is completely unavailable
            setLists(dummyLaptopData);
        }
    };

    // ✅ Filtering logic
    const filteredLists = lists.filter(list => {
        const matchesBrand = selectedBrand === 'All' || list?.laptopBrand === selectedBrand;
        const matchesOS = selectedOS === 'All' || list?.operatingSystem === selectedOS;
        const matchesSearch = !searchTerm || 
            (list?.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             list?.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             list?.macAddress?.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesBrand && matchesOS && matchesSearch;
    });

    // Verified lists (for admin view)
    const verifiedLists = filteredLists.filter(list => list?.verified === true);
    
    // ✅ Save user to localStorage whenever it changes
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    // ✅ Single useEffect for initial data loading
    useEffect(() => {
        // 1. Fetch laptops from backend
        fetchLaptopsFromBackend();
        
        // 2. Verify saved user on app load (optional - if you want to check session validity)
        if (user) {
            console.log("User loaded from localStorage:", user);
            // You could make an API call here to verify the user session is still valid
            // Example: axiosInstance.get('/api/auth/verify')
        }
    }, []); // Empty dependency array = run once on mount

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
        verifiedLists
    };
    
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);