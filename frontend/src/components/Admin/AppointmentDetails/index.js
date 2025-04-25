import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Loader from "../../Loader";
import { useNotification } from "../../../context/NotificationContext";

import {
  Clock,
  Calendar,
  MapPin,
  User,
  File,
  Check,
  X,
  Plus,
  Image as ImageIcon,
} from "lucide-react";
import "./appointmentDetails.css";

export default function AppointmentDetails() {
  const { addNotification } = useNotification();

  const token = Cookies.get("jwt_token");
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const fileInputRef = useRef(null);
  const [appointment, setAppointment] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newNote, setNewNote] = useState({
    images: [],
    description: "",
  });
  const [previewImages, setPreviewImages] = useState([]);

  const getAppointmentDetails = async () => {
    try {
      setIsLoading(true);
      const url = `${process.env.REACT_APP_BACKEND_URL}/checkup/${id}`;
      const response = await fetch(url);
      const data = await response.json();

      const checkup = data.checkup;

      const scheduledDate = new Date(checkup.scheduledTime);
      const formattedDate = scheduledDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      const formattedTime = scheduledDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      setIsLoading(false);
      setAppointment({
        id: checkup._id,
        patientName: checkup.patientId.name,
        patientImage: "/api/placeholder/80/80",
        patientAge: 30, // Replace with real data if available
        patientGender: "Not specified", // Replace with real data if available
        date: formattedDate,
        time: formattedTime,
        duration: "30 minutes",
        reason: "General dental checkup",
        location: "Dental Clinic",
        status: checkup.status,
        images: checkup.images,
        notes: [],
      });
    } catch (err) {
      setIsLoading(false);

      addNotification("Failed to fetch appointment", err.message);
    }
  };

  useEffect(() => {
    getAppointmentDetails();
  }, [id]);

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
      addNotification("Status Updated Successfully!");
      if (!response.ok) throw new Error("Failed to update appointment status");
      
      // Update local state if the request is successful
    } catch (error) {
      addNotification("Failed to update appointment status");
      setIsLoading(false);
      // setError("Failed to update appointment status. Please try again later.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleUploadImage = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/uploadprojectimage`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      setIsLoading(false);
      if (data.imageUrl) {
        setIsLoading(false);
        setUploadedImageUrl(data.imageUrl);
        setSelectedImage(null);
      }
    } catch (error) {
      setIsLoading(false);
      addNotification("Image upload failed", error.message);
    }
  };
  const handleAddNote = async () => {
    if (newNote.description.trim() === "" && uploadedImageUrl === "") {
      return;
    }

    // Prepare updated appointment data
    const updatedAppointment = {
      ...appointment,
      notes: [
        ...appointment.notes,
        {
          id: Date.now(),
          images: uploadedImageUrl ? [uploadedImageUrl] : [],
          description: newNote.description,
        },
      ],
    };

    // Update the local state
    setAppointment(updatedAppointment);
    setNewNote({ images: [], description: "" });
    setUploadedImageUrl("");

    // Prepare the payload for the API call
    const payload = {
      newImageNote: { image: uploadedImageUrl, note: newNote.description },
    };

    try {
      setIsLoading(true);
      // Make the PUT request to the backend API
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/checkup/${appointment.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      setIsLoading(false);
      if (!response.ok) {
        addNotification("Failed to update the checkup.");
        throw new Error("Failed to update the checkup.");
      }

      // If the request is successful, you can show a success message if needed.
    } catch (error) {
      setIsLoading(false);
      addNotification("Error updating checkup:", error.message)
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...previewImages];
    updatedImages.splice(index, 1);
    setPreviewImages(updatedImages);
  };

  const handleMarkCompleted = (id) => {
    updateAppointmentStatus(id, "completed");
    setIsCompleted(true);
    setAppointment({
      ...appointment,
      status: "completed",
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  if (isLoading) {
    return <Loader />;
   
  }

  return (
    <div
      className={`appointment-details-container ${
        isCompleted ? "completed" : ""
      }`}
    >
      <div className="appointment-header">
        <div className="appointment-id-section">
          <h1>Appointment Details</h1>
          <div className="appointment-id">ID: {appointment.id}</div>
          <div className={`appointment-status ${appointment.status}`}>
            {appointment.status === "completed" ? "Completed" : "Active"}
          </div>
        </div>

        {!isCompleted && (
          <button
            className="complete-button"
            onClick={() => handleMarkCompleted(appointment.id)}
          >
            <Check size={18} />
            Mark as Completed
          </button>
        )}
      </div>

      <div className="appointment-content">
        <div className="patient-info-section">
          <div className="patient-profile">
            {/* <img
              src={appointment.patientImage}
              alt={appointment.patientName}
              className="patient-avatar"
            /> */}
            <div className="patient-details">
              <h2>{appointment.patientName}</h2>
              <div className="patient-metadata">
                <span className="metadata-item">
                  <User size={14} /> {appointment.patientAge} years,{" "}
                  {appointment.patientGender}
                </span>
              </div>
            </div>
          </div>

          <div className="appointment-meta">
            <div className="meta-item">
              <Calendar size={16} />
              <span>{appointment.date}</span>
            </div>
            <div className="meta-item">
              <Clock size={16} />
              <span>
                {appointment.time} ({appointment.duration})
              </span>
            </div>
            <div className="meta-item">
              <MapPin size={16} />
              <span>{appointment.location}</span>
            </div>
          </div>

          <div className="appointment-reason">
            <h3>Reason for Visit</h3>
            <p>{appointment.reason}</p>
          </div>
        </div>
        <div className="notes-section">
          <h3>Saved Images</h3>
          {appointment.images.lenght <= 0 && (
            <p className="para-image">Nothing Found</p>
          )}

          <div className="saved-images-container">
            {appointment.images &&
              appointment.images.map((item, index) => (
                <div key={index}>
                  <img src={item.image} alt="Saved" className="saved-image" />
                  <p className="para-image">note: {item.note}</p>
                </div>
              ))}
          </div>
        </div>

        <div className="notes-section">
          <h3>Notes & Images</h3>

          <div className="notes-list">
            {appointment.notes.map((note) => (
              <div key={note.id} className="note-item">
                {note.images.length > 0 && (
                  <div className="note-images">
                    {note.images.map((image, idx) => (
                      <div key={idx} className="note-image-container">
                        <img
                          src={image}
                          alt={`Note ${idx + 1}`}
                          className="note-image"
                        />
                      </div>
                    ))}
                  </div>
                )}
                {note.description && (
                  <div className="note-description">
                    <p>{note.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {!isCompleted && (
            <div className="add-note-section">
              <h4>Add New Note</h4>

              <div className="new-note-input">
                <textarea
                  placeholder="Enter description or findings..."
                  value={newNote.description}
                  onChange={(e) =>
                    setNewNote({ ...newNote, description: e.target.value })
                  }
                  rows={4}
                  disabled={isCompleted}
                ></textarea>
              </div>

              {previewImages.length > 0 && (
                <div className="preview-images">
                  {previewImages.map((image, idx) => (
                    <div key={idx} className="preview-image-container">
                      <img
                        src={image}
                        alt={`Preview ${idx + 1}`}
                        className="preview-image"
                      />
                      <button
                        className="remove-image-button"
                        onClick={() => handleRemoveImage(idx)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* <div className="note-actions">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  multiple
                />
                <button
                  className="upload-image-button"
                  onClick={triggerFileInput}
                >
                  <ImageIcon size={18} />
                  Add Images
                </button>
                <button
                  className="add-note-button"
                  onClick={handleAddNote}
                  disabled={
                    (newNote.description.trim() === "" &&
                      previewImages.length === 0) ||
                    isCompleted
                  }
                >
                  <Plus size={18} />
                  Add Note
                </button>
              </div> */}
              <div className="note-actions">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
                <button
                  className="upload-image-button"
                  onClick={() => fileInputRef.current.click()}
                >
                  <ImageIcon size={18} />
                  Select Image
                </button>

                <button
                  className="upload-image-button"
                  onClick={handleUploadImage}
                  disabled={!selectedImage}
                >
                  Upload
                </button>

                {uploadedImageUrl && (
                  <div className="preview-images">
                    <div className="preview-image-container">
                      <img
                        src={uploadedImageUrl}
                        alt="Uploaded"
                        className="preview-image"
                      />
                    </div>
                  </div>
                )}

                <button
                  className="add-note-button"
                  onClick={handleAddNote}
                  disabled={
                    (newNote.description.trim() === "" &&
                      uploadedImageUrl === "") ||
                    isCompleted
                  }
                >
                  <Plus size={18} />
                  Add Note
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
