// AvailableDoctors.jsx
import { useState, useEffect } from "react";
import { Calendar, Clock, Star, MapPin, X, Check } from "lucide-react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import "./doctors.css";
import Header from "../../Header";
import Loader from "../../Loader";
import Footer from "../../Footer";
import { useNotification } from "../../../context/NotificationContext";

export default function AvailableDoctors() {
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

  const handleConfirmBooking = async (dentistId) => {
    if (!selectedTime || !bookingDoctor) return;

    const selectedSlot = bookingDoctor.availableTimes.find(
      (t) => t.id === selectedTime.timeId
    );
    if (!selectedSlot) return;

    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/checkups`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            patientId: userId,
            dentistId: dentistId, // use backend ID if available
            scheduledTime: `${selectedSlot.date} ${selectedSlot.time}`,
          }),
        }
      );

      const result = await response.json();
      setIsLoading(false);

      addNotification("Booking placed successfully");
      if (!response.ok) {
        throw new Error(result.message || "Failed to book appointment");
      }
      setIsLoading(false);
      // Update UI state on success
      setDoctors(
        doctors.map((doctor) => {
          if (doctor.id === selectedTime.doctorId) {
            return {
              ...doctor,
              availableTimes: doctor.availableTimes.map((time) =>
                time.id === selectedTime.timeId
                  ? { ...time, available: false }
                  : time
              ),
            };
          }
          return doctor;
        })
      );

      setBookingConfirmed(true);
      setTimeout(() => {
        setShowBookingModal(false);
        setSelectedTime(null);
        setBookingDoctor(null);
        setBookingConfirmed(false);
      }, 3000);
    } catch (err) {
      setIsLoading(false);
      console.error("Booking error:", err.message);

      addNotification("Booking error:", err.message);
    }
  };

  const handleCloseModal = () => {
    setShowBookingModal(false);
    setSelectedTime(null);
    setBookingDoctor(null);
    setBookingConfirmed(false);
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

        <div className="filters-section">
          <div className="filter-item">
            <label htmlFor="specialty">Specialty</label>
            <select
              id="specialty"
              name="specialty"
              value={filters.specialty}
              onChange={handleFilterChange}
            >
              <option value="">All Specialties</option>
              {/* {specialties.map((specialty, index) => (
              <option key={index} value={specialty}>{specialty}</option>
            ))} */}
            </select>
          </div>

          <div className="filter-item">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
            />
          </div>
        </div>

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

        {/* Booking Modal */}
        {showBookingModal && bookingDoctor && (
          <div className="modal-overlay">
            <div className="booking-modal">
              <button className="close-modal" onClick={handleCloseModal}>
                <X size={24} />
              </button>

              {bookingConfirmed ? (
                <div className="booking-confirmed">
                  <div className="confirmation-icon">
                    <Check size={48} />
                  </div>
                  <h2>Booking Placed !</h2>
                  <p>
                    Your appointment with {bookingDoctor.name} has been
                    waitlisted.
                  </p>
                  <div className="confirmation-details">
                    <div className="confirmation-item">
                      <Calendar size={16} />
                      <span>
                        {
                          bookingDoctor.availableTimes.find(
                            (t) => t.id === selectedTime.timeId
                          )?.date
                        }
                      </span>
                    </div>
                    <div className="confirmation-item">
                      <Clock size={16} />
                      <span>
                        {
                          bookingDoctor.availableTimes.find(
                            (t) => t.id === selectedTime.timeId
                          )?.time
                        }
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <h2>Confirm Your Appointment</h2>
                  <div className="booking-doctor-info">
                    <img src={bookingDoctor.image} alt={bookingDoctor.name} />
                    <div>
                      <h3>{bookingDoctor.name}</h3>
                      <p>{bookingDoctor.specialty}</p>
                    </div>
                  </div>

                  <div className="booking-details">
                    <div className="booking-detail-item">
                      <Calendar size={18} />
                      <span>
                        Date:{" "}
                        {
                          bookingDoctor.availableTimes.find(
                            (t) => t.id === selectedTime.timeId
                          )?.date
                        }
                      </span>
                    </div>
                    <div className="booking-detail-item">
                      <Clock size={18} />
                      <span>
                        Time:{" "}
                        {
                          bookingDoctor.availableTimes.find(
                            (t) => t.id === selectedTime.timeId
                          )?.time
                        }
                      </span>
                    </div>
                    <div className="booking-detail-item">
                      <MapPin size={18} />
                      <span>Location: {bookingDoctor.location}</span>
                    </div>
                  </div>

                  <div className="booking-actions">
                    <button
                      className="cancel-booking"
                      onClick={handleCloseModal}
                    >
                      Cancel
                    </button>
                    <button
                      className="confirm-booking"
                      onClick={() => handleConfirmBooking(bookingDoctor.id)}
                    >
                      Confirm Booking
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer/>
    </>
  );
}
