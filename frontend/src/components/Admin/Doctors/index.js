// AvailableDoctors.jsx
import { useState, useEffect } from "react";
import { Calendar, Clock, Star, MapPin, X, Check } from "lucide-react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Header from "../../Header";
import Loader from "../../Loader";
import { useNotification } from "../../../context/NotificationContext";

export default function HospitalDoctors() {
  const { addNotification } = useNotification();

  const [filters, setFilters] = useState({
    specialty: "",
    date: "",
  });

  const [selectedTime, setSelectedTime] = useState(null);
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  //   const specialties = [...new Set(doctors.map(doctor => doctor.specialty))];

  const token = Cookies.get("jwt_token");
  const decoded = jwtDecode(token);
  const userId = decoded.userId;
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/dentists`;
      const response = await fetch(URL);
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      // Add dummy data for UI compatibility
      if (response.ok) {
        addNotification("Details fetched successfully");
      }
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const formattedDate = tomorrow.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }); // e.g., "26 Apr 2025"

      const enhancedData = data.map((doc, index) => ({
        id: doc._id,
        name: doc.name,
        specialty: "General",
        image: "/api/placeholder/120/120",
        rating: 4.5,
        reviewCount: Math.floor(Math.random() * 200),
        location: "Default Clinic",
        availableTimes: [
          {
            id: `${index}1`,
            time: "09:00 AM",
            date: formattedDate,
            available: true,
          },
          {
            id: `${index}2`,
            time: "11:00 AM",
            date: formattedDate,
            available: true,
          },
          {
            id: `${index}3`,
            time: "12:00 PM",
            date: formattedDate,
            available: true,
          },
          {
            id: `${index}4`,
            time: "02:00 PM",
            date: formattedDate,
            available: true,
          },
        ],
      }));
      setDoctors(enhancedData);
    } catch (error) {
      addNotification("Failed to fetch appointments. Please try again later.");
      setError("Failed to fetch appointments. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimeSelect = (doctorId, timeId) => {
    const doctor = doctors.find((doc) => doc.id === doctorId);
    const time = doctor.availableTimes.find((t) => t.id === timeId);

    setSelectedTime({ doctorId, timeId });
    setBookingDoctor(doctor);
    setShowBookingModal(true);
  };

 

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  // Apply filters
  const filteredDoctors = doctors.filter((doctor) => {
    if (filters.specialty && doctor.specialty !== filters.specialty)
      return false;
    return true;
  });
  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Header />
      <div className="available-doctors-container">
        <header className="doctors-header">
          <h1>Available Doctors</h1>
          <p>Choose from our specialists and book your appointment</p>
        </header>


        <div className="doctors-list">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => (
              <div key={doctor.id} className="doctor-card">
                <div className="doctor-info">
                  {/* <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="doctor-image"
                  /> */}
                  <div className="doctor-details">
                    <h2>{doctor.name}</h2>
                    <div className="doctor-specialty">{doctor.specialty}</div>
                    <div className="doctor-rating">
                      <Star size={16} className="star-icon" />
                      <span>{doctor.rating}</span>
                      <span className="review-count">
                        ({doctor.reviewCount} reviews)
                      </span>
                    </div>
                    <div className="doctor-location">
                      <MapPin size={16} />
                      <span>{doctor.location}</span>
                    </div>
                  </div>
                </div>

                <div className="available-slots">
                  <h3>Available Time Slots</h3>
                  <div className="time-slots">
                    {doctor.availableTimes.map((time) => (
                      <button
                        key={time.id}
                        className={`time-slot ${
                          !time.available ? "booked" : ""
                        }`}
                        onClick={() =>
                          time.available && handleTimeSelect(doctor.id, time.id)
                        }
                        disabled={!time.available}
                      >
                        <Clock size={14} />
                        <span>{time.time}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>
                No doctors match your filters. Please try different criteria.
              </p>
            </div>
          )}
        </div>

       
      </div>
    </>
  );
}
