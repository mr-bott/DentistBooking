import React from "react";
import { useNavigate } from "react-router-dom";
import "./homepage.css";
import Header from "../../Header";
import Footer from "../../Footer";

export default function AppointmentHomePage() {
  const navigate=useNavigate()
  const handlebooknow=()=>{
      return navigate("/available/doctors")
  }
  return (
    <>
      <div className="home-container">
        {/* <Header /> */}
    <Header/>
        <main className="main-content">
          <h1 className="main-title">
            Book Your Doctor
            <br />
            Appointment Online
          </h1>
          <p className="subtitle">
            Find the right specialist and schedule
            <br />
            your visit with just a few clicks.
          </p>
          <a href="/available/doctors" className="book-now-link">
            <button className="book-now-button" onClick={()=>handlebooknow()}>Book Now</button>
          </a>

          <div className="specialties-illustration">
            <div className="specialty general"></div>
            <div className="specialty cardiology"></div>
            <div className="specialty pediatrics"></div>
            <div className="specialty dermatology"></div>
            <div className="specialty orthopedics"></div>
            <div className="specialty neurology"></div>
            <div className="specialty dentistry"></div>
            <div className="specialty ophthalmology"></div>
            <div className="specialty psychology"></div>
          </div>
        </main>

        <div className="stats-container">
          <div className="stats-header">
            <h2>Why patients choose us</h2>
            <p>
              Our commitment to exceptional healthcare experiences makes us the preferred
              choice for thousands of patients.
            </p>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">
                12<span className="plus">+</span>
              </div>
              <div className="stat-title">Years of service</div>
              <div className="stat-subtitle">Trusted healthcare provider</div>
            </div>

            <div className="stat-card">
              <div className="stat-value">15,000</div>
              <div className="stat-title">Appointments booked</div>
              <div className="stat-subtitle">Just in the last month</div>
            </div>

            <div className="stat-card">
              <div className="stat-value">
                500<span className="plus">+</span>
              </div>
              <div className="stat-title">Medical specialists</div>
              <div className="stat-subtitle">Ready to help you</div>
            </div>
          </div>
        </div>
        
       <Footer/>
      </div>
    </>
  );
}