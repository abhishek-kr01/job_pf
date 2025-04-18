import { useNavigate } from "react-router-dom";
import { useFormContext } from "../context/FormContext";

const SubmissionSuccess = () => {
  const { resetForm } = useFormContext();
  const navigate = useNavigate();

  const handleStartNew = () => {
    resetForm();
    navigate("/step-1");
  };

  return (
    <div className="text-center py-6">
      <div className="mb-6">
        <svg
          className="mx-auto h-16 w-16 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-3">
        Application Submitted!
      </h2>
      <p className="text-gray-600 mb-6">
        Thank you for submitting your application. We will review it shortly and
        get back to you.
      </p>

      <div className="bg-blue-50 p-4 rounded-md text-blue-800 mb-8 inline-block">
        <p className="font-medium">What happens next?</p>
        <p className="text-sm mt-2">
          Our team will review your application and contact you via email or
          phone if your qualifications match our requirements.
        </p>
      </div>

      <button type="button" className="btn-primary" onClick={handleStartNew}>
        Start a New Application
      </button>
    </div>
  );
};

export default SubmissionSuccess;
