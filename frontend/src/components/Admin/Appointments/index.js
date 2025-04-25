import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import Loader from "../../Loader";
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  User,
  MapPin,
  MessageSquare,
  ChevronDown,
  Bell,
  Search,
} from "lucide-react";
import "./appointments.css"

export default function DoctorAppointements() {
  const token = Cookies.get("jwt_token");
  const decoded = jwtDecode(token);
  const userId = decoded.userId;
  const[personal,setPersonal]=useState([]);
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDoctor();
  }, []);

  const fetchDoctor = async () => {
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
    
    } finally {
      setIsLoading(false);
    }
  };



  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/dentist/checkups/${userId}`;
      const response = await fetch(URL);
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      setAppointments(data.checkups);
    } catch (error) {
      setError("Failed to fetch appointments. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateAppointmentStatus = async (id, newStatus) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/checkups/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      setIsLoading(false);
      if (!response.ok) throw new Error("Failed to update appointment status");

      // Update local state if the request is successful
      setAppointments((prevAppointments) =>
        prevAppointments.map((app) =>
          app._id === id ? { ...app, status: newStatus } : app
        )
      );
    } catch (error) {
      setIsLoading(false);
      setError("Failed to update appointment status. Please try again later.");
    }
  };

  // Filter appointments based on status
  const pendingAppointments = appointments.filter(
    (app) => app.status === "pending"
  );
  const acceptedAppointments = appointments.filter(
    (app) => app.status === "accepted"
  );
  const rejectedAppointments = appointments.filter(
    (app) => app.status === "rejected"
  );

  const handleAccept = (id) => {
    updateAppointmentStatus(id, "accepted");
  };

  const handleReject = (id) => {
    updateAppointmentStatus(id, "rejected");
  };
if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="a_dashboard-container">
      <header className="a_dashboard-header">
        <div className="header-info">
          <h1 className="a_dashboard-title">Welcome back,</h1>
          <p className="a_dashboard-subtitle"> Dr.{personal?.name||"Doctor"}</p>
        </div>
        <div className="header-actions">
          <div className="notification-bell">
            <Bell size={20} />
            <span className="notification-badge">3</span>
          </div>
          <div className="user-profile">
            {/* <img
              src="/api/placeholder/32/32"
              alt="Doctor profile"
              className="profile-image"
            /> */}
            <span className="doctor-name">Dr. {personal?.name||"Doctor"}</span>
            <ChevronDown size={16} />
          </div>
        </div>
      </header>

      <div className="a_dashboard-content">
        <div className="section appointments-section">
          <div className="section-header">
            <h2 className="section-title">Today's Appointments</h2>
            <div className="search-container">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search patients..."
                className="search-input"
              />
            </div>
          </div>

          <div className="appointment-cards">
            {pendingAppointments.length > 0 ? (
              pendingAppointments.map((appointment) => (
                <div key={appointment._id} className="appointment-card">
                  <div className="patient-header">
                    <div className="patient-info">
                      <h3 className="patient-name">
                        {appointment.patientId.name}
                      </h3>
                      <div className="appointment-time">
                        <Calendar size={14} />
                        <span>
                          {new Date(
                            appointment.scheduledTime
                          ).toLocaleDateString()}
                        </span>
                        <Clock size={14} />
                        <span>
                          {new Date(
                            appointment.scheduledTime
                          ).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="appointment-details">
                    <div className="detail-item">
                      <MessageSquare size={14} />
                      <span>Status: {appointment.status}</span>
                    </div>
                    <div className="detail-item">
                      <MapPin size={14} />
                      <span>Location: Dentist Office</span>
                    </div>
                  </div>

                  <div className="action-buttons">
                    <button
                      onClick={() => handleAccept(appointment._id)}
                      className="accept-button"
                    >
                      <CheckCircle size={16} />
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(appointment._id)}
                      className="reject-button"
                    >
                      <XCircle size={16} />
                      Reject
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>No pending appointments for today.</p>
              </div>
            )}
          </div>
        </div>

        {/* Other sections */}
      </div>
      <div className="a_dashboard-content">
        <div className="section appointments-section">
          <div className="section-header">
            <h2 className="section-title">Accepted Appointments</h2>
            <div className="search-container">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search patients..."
                className="search-input"
              />
            </div>
          </div>

          <div className="appointment-cards">
            {acceptedAppointments.length > 0 ? (
              acceptedAppointments.map((appointment) => (
                <Link
                  to={`/appointment-details/${appointment._id} `}
                  className="logo-link"
                >
                  <div key={appointment._id} className="appointment-card">
                    <div className="patient-header">
                      <div className="patient-info">
                        <h3 className="patient-name">
                          {appointment.patientId.name}
                        </h3>
                        <div className="appointment-time">
                          <Calendar size={14} />
                          <span>
                            {new Date(
                              appointment.scheduledTime
                            ).toLocaleDateString()}
                          </span>
                          <Clock size={14} />
                          <span>
                            {new Date(
                              appointment.scheduledTime
                            ).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="appointment-details">
                      <div className="detail-item">
                        <MessageSquare size={14} />
                        <span>Status: {appointment.status}</span>
                      </div>
                      <div className="detail-item">
                        <MapPin size={14} />
                        <span>Location: Dentist Office</span>
                      </div>
                    </div>

                    <div className="action-buttons">
                      <button
                        className="accept-button"
                      >
                        <CheckCircle size={16} />
                        ADD Preceptions
                      </button>
                      {/* <button
                      onClick={() => handleReject(appointment._id)}
                      className="reject-button"
                    >
                      <XCircle size={16} />
                      Reject
                    </button> */}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="empty-state">
                <p>No pending appointments for today.</p>
              </div>
            )}
          </div>
        </div>

        {/* Other sections */}
      </div>

      <div className="a_dashboard-content">
        <div className="section appointments-section">
          <div className="section-header">
            <h2 className="section-title">Rejected Appointments</h2>
            <div className="search-container">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search patients..."
                className="search-input"
              />
            </div>
          </div>

          <div className="appointment-cards">
            {rejectedAppointments.length > 0 ? (
              rejectedAppointments.map((appointment) => (
                <Link
                  to={`/appointment-details/${appointment._id} `}
                  className="logo-link"
                >
                  <div key={appointment._id} className="appointment-card">
                    <div className="patient-header">
                      <div className="patient-info">
                        <h3 className="patient-name">
                          {appointment.patientId.name}
                        </h3>
                        <div className="appointment-time">
                          <Calendar size={14} />
                          <span>
                            {new Date(
                              appointment.scheduledTime
                            ).toLocaleDateString()}
                          </span>
                          <Clock size={14} />
                          <span>
                            {new Date(
                              appointment.scheduledTime
                            ).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="appointment-details">
                      <div className="detail-item">
                        <MessageSquare size={14} />
                        <span>Status: {appointment.status}</span>
                      </div>
                      <div className="detail-item">
                        <MapPin size={14} />
                        <span>Location: Dentist Office</span>
                      </div>
                    </div>

                    <div className="action-buttons">
                      {/* <button
                        className="accept-button"
                      >
                        <CheckCircle size={16} />
                        ADD Preceptions
                      </button> */}
                      <button
                      className="reject-button"
                    >
                      <XCircle size={16} />
                      Rejected
                    </button>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="empty-state">
                <p>No Rejected appointments for today.</p>
              </div>
            )}
          </div>
        </div>

        {/* Other sections */}
      </div>
    </div>
  );
}
