import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Header from "../../Header";
import Footer from "../../Footer";
import Loader from "../../Loader";
import "./userorders.css";
import { useNotification } from "../../../context/NotificationContext";

const UserCheckups = () => {
  const { addNotification } = useNotification();

  const token = Cookies.get("jwt_token");
  const decoded = jwtDecode(token);
  const userId = decoded.userId;

  const [isLoading, setIsLoading] = useState(true);

  const [checkups, setCheckups] = useState([]);

  useEffect(() => {
    fetchCheckupDetails();
  }, []);

  const fetchCheckupDetails = async () => {
    setIsLoading(true);

    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/checkups/patient/${userId}`;
      const response = await fetch(URL);
      addNotification("Detailsd fetched successfully!");
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      const transformedCheckups = data.map((item) => ({
        id: item._id,
        dentistName: item.dentistId?.name || "Unknown",
        dentistEmail: item.dentistId?.email || "Not Provided",
        description: item.dentistId?.description || "No description",
        scheduledTime: new Date(item.scheduledTime).toLocaleString(),
        createdAt: new Date(item.createdAt).toLocaleDateString(),
        status: item.status.charAt(0).toUpperCase() + item.status.slice(1),
        images: item.images || [], // <-- Add this line
      }));

      setCheckups(transformedCheckups);
    } catch (error) {
      addNotification(
        "Failed to fetch checkup appointments. Please try again later.!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <Header />
      <div className="details-container">
        <div className="details-header">
          <h1>Your Checkup Appointments</h1>
          <p>View your upcoming and past dental checkup appointments</p>
        </div>

        <div className="details-orders-list">
          {checkups.map((checkup) => (
            <div className="details-order-card" key={checkup.id}>
              <div className="details-order-info">
                <div className="details-info-section">
                  <h3>Appointment ID</h3>
                  <p>#{checkup.id}</p>
                </div>

                <div className="details-info-section">
                  <h3>Dentist Name</h3>
                  <p>{checkup.dentistName}</p>
                </div>

                <div className="details-info-section">
                  <h3>Dentist Email</h3>
                  <p>{checkup.dentistEmail}</p>
                </div>

                <div className="details-info-section">
                  <h3>Scheduled Time</h3>
                  <p>{checkup.scheduledTime}</p>
                </div>

                <div className="details-info-section">
                  <h3>Status</h3>
                  <div
                    className={`details-status ${checkup.status.toLowerCase()}`}
                  >
                    {checkup.status}
                  </div>
                </div>
                <div className="details-info-section">
                  <h3>Images</h3>
                  {checkup.images.length > 0 ? (
                    <div className="details-images-container">
                      {checkup.images.map((img, index) => (
                        <div key={index} className="details-image-item">
                          <img
                            src={img.image}
                            alt={`Checkup Image ${index + 1}`}
                          />
                          <p>{img.note}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No images available</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default UserCheckups;
