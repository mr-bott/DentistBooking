

import { useState, useEffect } from 'react';
import Cookies from "js-cookie";
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, ShoppingBag, CreditCard, 
  Bell, User, Settings, BarChart3, ArrowUp, Menu, X, LogOut,Package ,Calendar,Stethoscope,FileText
} from 'lucide-react';
import Loader from '../../Loader';
import './Dashboard.css'; 
import DoctorDashboard from '../RecentAppointments';
import DoctorAppointements from '../Appointments';
import HospitalDoctors from '../Doctors';
export default function Dashboard() {
  const token = Cookies.get("jwt_token");
   const decoded = jwtDecode(token);
   const userId = decoded.userId;
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [personal, setPersonal] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  

  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Appointments', icon: <Calendar size={20} /> },
    // { name: 'Patients', icon: <User size={20} /> },
    { name: 'Doctors', icon: <Stethoscope size={20} /> },
    { name: 'Medical Records', icon: <FileText size={20} /> },
    { name: 'Notifications', icon: <Bell size={20} /> },
    { name: 'Logout', icon: <LogOut size={20} /> }
  ];
  

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/dentist/${userId}`;
      const response = await fetch(URL);
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      setPersonal(data);
  
    } catch (error) {
      setIsLoading(false);
      setError("Failed to fetch products. Please try again later.");
   
    } finally {
      setIsLoading(false);
    }
  };

  const logoutUser = () => {
    Cookies.remove("token"); // Remove token from cookies
    navigate("/login");      // Redirect to login
  };

 
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  

  const renderMainContent = () => {
    if (activeTab === 'Appointments') {
         return <DoctorAppointements/>;
    } else if (activeTab === 'Doctors') {
      return <HospitalDoctors/>;
    } else {
      if (isLoading) {
        return <Loader />;
      }

      return (
        <>
         
          <DoctorDashboard/>
          
        </>
      );
    }
  };

  return (
    <div className="dashboard-container">
      {/* Mobile Menu Toggle */}
      <button 
        className="dashboard-mobile-toggle" 
        onClick={toggleSidebar}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`dashboard-sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="dashboard-logo">
          <div className="dashboard-logo-icon">
            <LayoutDashboard size={20} />
          </div>
          <h1 className="dashboard-logo-text">OralVis HealthCare</h1>
        </div>

        <div className="dashboard-nav">
          {navItems.map((item) => (
            <button
              key={item.name}
              className={`dashboard-nav-item ${activeTab === item.name ? 'dashboard-nav-active' : ''}`}
              onClick={() => {
                if (item.name === "Logout") {
                  logoutUser();
                } else {
                  setActiveTab(item.name);
                }
                if (window.innerWidth < 768) {
                  setSidebarOpen(false);
                }
              }}
            >
              <span className="dashboard-nav-icon">{item.icon}</span>
              <span className="dashboard-nav-text">{item.name}</span>
            </button>
          ))}
        </div>

        <div className="dashboard-upgrade">
          <button className="dashboard-upgrade-button" onClick={()=>logoutUser()}>
            LOGOUT 
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Header & Navigation */}
        <header className="dashboard-header">
          <div className="dashboard-breadcrumb">
            <a href="#" className="dashboard-breadcrumb-link">
              <LayoutDashboard size={18} />
            </a>
            <span className="dashboard-breadcrumb-separator">/</span>
            <span className="dashboard-breadcrumb-current">{activeTab}</span>
          </div>
          <h1 className="dashboard-title">{activeTab}</h1>
          <div className="dashboard-controls">
            <div className="dashboard-search">
              <input 
                type="text" 
                placeholder="Search here" 
                className="dashboard-search-input"
              />
            </div>
            <button className="dashboard-control-button">
              <User size={20} />
            </button>
            <button className="dashboard-control-button">
              <Settings size={20} />
            </button>
            <button className="dashboard-control-button">
              <Bell size={20} />
            </button>
          </div>
        </header>

        {/* Render dynamic content based on active tab */}
        {renderMainContent()}
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}
    </div>
  );
}
