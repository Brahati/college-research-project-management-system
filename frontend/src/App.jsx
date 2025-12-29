import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import StudentDashboard from "./pages/studentDashboard";
import FacultyDashboard from "./pages/facultyDashboard";
import AdminDashboard from "./pages/adminDashboard";
import CompanyDashboard from "./pages/companyDashboard";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/faculty" element={<FacultyDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/company" element={<CompanyDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
