// import axios from "axios";

// const API_URL = "/api/applications";

// // Create instance of axios with defaults
// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Save candidate details (Page 1)
// export const saveCandidateDetails = async (data) => {
//   try {
//     console.log("Sending candidate details to API:", data);
//     const response = await api.post("/candidate-details", data);
//     console.log("API response for candidate details:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("API error when saving candidate details:", error);
//     return handleError(error);
//   }
// };

// // Upload resume (Page 2)
// export const uploadResume = async (formData) => {
//   try {
//     console.log("Uploading resume to API");
//     const response = await axios.post(`${API_URL}/resume-upload`, formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });
//     console.log("API response for resume upload:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("API error when uploading resume:", error);
//     return handleError(error);
//   }
// };

// // Save behavioral responses (Page 3)
// export const saveBehavioralResponses = async (data) => {
//   try {
//     console.log("Sending behavioral responses to API:", data);
//     const response = await api.post("/behavioral-responses", data);
//     console.log("API response for behavioral responses:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("API error when saving behavioral responses:", error);
//     return handleError(error);
//   }
// };

// // Get application by ID
// export const getApplication = async (id) => {
//   try {
//     console.log("Fetching application with ID:", id);
//     const response = await api.get(`/${id}`);
//     console.log("API response for get application:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("API error when getting application:", error);
//     return handleError(error);
//   }
// };

// // Error handler
// const handleError = (error) => {
//   if (error.response) {
//     // Server responded with a status other than 200 range
//     console.error("Server error response:", error.response.data);
//     return {
//       success: false,
//       message: error.response.data.message || "Server error",
//       error: error.response.data.error,
//     };
//   } else if (error.request) {
//     // Request was made but no response
//     console.error("No response from server:", error.request);
//     return {
//       success: false,
//       message: "No response from server. Please check your connection.",
//       error: "Network error",
//     };
//   } else {
//     // Error setting up request
//     console.error("Request setup error:", error.message);
//     return {
//       success: false,
//       message: "Request setup error",
//       error: error.message,
//     };
//   }
// };

import axios from "axios";

// Axios instance with Vite proxy support (works with /api)
const API = axios.create({
  baseURL: "/api/applications",
});

// Save candidate details (Step 1)
export const saveCandidateDetails = async (data) => {
  try {
    const response = await API.post("/candidate-details", data);
    return response.data;
  } catch (error) {
    console.error("API error when saving candidate details:", error);
    throw error.response?.data || { success: false, message: "Unknown error" };
  }
};

// Upload resume (Step 2)
export const uploadResume = async (formData) => {
  try {
    const response = await API.post("/resume-upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("API error when uploading resume:", error);
    throw error.response?.data || { success: false, message: "Unknown error" };
  }
};

// Save behavioral responses (Step 3)
export const saveBehavioralResponses = async (data) => {
  try {
    const response = await API.post("/behavioral-responses", data);
    return response.data;
  } catch (error) {
    console.error("API error when saving responses:", error);
    throw error.response?.data || { success: false, message: "Unknown error" };
  }
};

// Get application by ID
export const getApplicationById = async (id) => {
  try {
    const response = await API.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error("API error when fetching application:", error);
    throw error.response?.data || { success: false, message: "Unknown error" };
  }
};

// Get all applications (Admin)
export const getAllApplications = async () => {
  try {
    const response = await API.get("/");
    return response.data;
  } catch (error) {
    console.error("API error when fetching applications:", error);
    throw error.response?.data || { success: false, message: "Unknown error" };
  }
};
