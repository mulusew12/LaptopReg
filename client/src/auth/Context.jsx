import {  createContext, useContext, useEffect, useState } from "react";
import { dummyLaptopData } from "../assets/assets";

export const AppContext = createContext();

export const AppProvider = ({children})=>{
    const stu = true;

    const [user, setUser] = useState(null)
    const [lists, setLists] = useState([])
     const [searchTerm, setSearchTerm] = useState('');
      const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedOS, setSelectedOS] = useState('All');
      const [formData, setFormData] = useState({
        fullName: '',
        userId: '',
        email: '',
        password: ''
      });
 // In AppProvider.js
const filteredLists = lists.filter(list => {
  // Remove the verified check from filters for Lists component
  const matchesBrand = selectedBrand === 'All' || list?.laptopBrand === selectedBrand;
  const matchesOS = selectedOS === 'All' || list?.operatingSystem === selectedOS;
  const matchesSearch = !searchTerm || 
    (list?.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     list?.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     list?.macAddress?.toLowerCase().includes(searchTerm.toLowerCase()));
  
  return matchesBrand && matchesOS && matchesSearch;
});

// If you need a separate list for only verified items, create a new variable
const verifiedLists = filteredLists.filter(list => list?.verified === true);
      const fetchLists = async ()=>{
        setLists(dummyLaptopData)
      }

      useEffect(()=>{
        fetchLists()
      }, [])
    const value = {stu, user, setUser, formData,
         setFormData, lists, setLists, 
         searchTerm, setSearchTerm, 
        filteredLists, verifiedLists}
    return(
        <AppContext.Provider value={value} >
            {children}
        </AppContext.Provider>
    )
} 
export const useAppContext = ()=> useContext(AppContext)