import { Component } from "react";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import { NotificationProvider } from "./context/NotificationContext";
import NotificationManager from "./components/NotificationManager";

import SignUp from "./components/SignUp";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoutes";
import Dashboard from "./components/Admin/DashBoard/index.js";
import UserCheckups from "./components/User/UserAppointments/index.js";
import HomePage from "./components/User/Dashboard/index.js";
import NotFound from "./components/NotFound/index.js";
import DoctorDashboard from "./components/Admin/Appointments/index.js";
import AppointmentDetails from "./components/Admin/AppointmentDetails/index.js"; //remove
import AvailableDoctors from "./components/User/Doctors/index.js";
class App extends Component {
  render() {
    return (
      <NotificationProvider>
        <Router>
          {/* Notification bar should always render */}
          <NotificationManager />

          <Routes>
            <Route path="/" element={<ProtectedRoute />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/patient/dashboard"
              element={
                <ProtectedRoute element={HomePage} allowedRoles={["patient"]} />
              }
            />
            <Route
              path="/patient/appointments"
              element={
                <ProtectedRoute
                  element={UserCheckups}
                  allowedRoles={["patient"]}
                />
              }
            />
            <Route
              path="/available/doctors"
              element={
                <ProtectedRoute
                  element={AvailableDoctors}
                  allowedRoles={["patient"]}
                />
              }
            />
          <Route
              path="/dentist/dashboard"
              element={
                <ProtectedRoute
                  element={Dashboard}
                  allowedRoles={["dentist"]}
                />
              }
            />
             <Route
              path="/dentist/appointments"
              element={
                <ProtectedRoute
                  element={DoctorDashboard}
                  allowedRoles={["dentist"]}
                />
              }
            />
            <Route
              path="/appointment-details/:id"
              element={
                <ProtectedRoute
                  element={AppointmentDetails}
                  allowedRoles={["dentist"]}
                />
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </NotificationProvider>
    );
  }
}

export default App;
