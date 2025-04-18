import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import CandidateDetails from "./pages/CandidateDetails";
import ResumeUpload from "./pages/ResumeUpload";
import BehavioralQuestions from "./pages/BehavioralQuestions";
import SubmissionSuccess from "./pages/SubmissionSuccess";

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/step-1" replace />} />
        <Route path="/step-1" element={<CandidateDetails />} />
        <Route path="/step-2" element={<ResumeUpload />} />
        <Route path="/step-3" element={<BehavioralQuestions />} />
        <Route path="/success" element={<SubmissionSuccess />} />
        <Route path="*" element={<Navigate to="/step-1" replace />} />
      </Routes>
    </Layout>
  );
};

export default App;
