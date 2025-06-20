import React, { useContext, useEffect } from "react";
import "./App.css";
import { Context } from "./main";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import Home from "./components/Home/Home";
import Jobs from "./components/Job/Jobs";
import JobDetails from "./components/Job/JobDetails";
import Application from "./components/Application/Application";
import MyApplications from "./components/Application/MyApplications";
import PostJob from "./components/Job/PostJob";
import NotFound from "./components/NotFound/NotFound";
import MyJobs from "./components/Job/MyJobs";

// ProtectedRoute component
const ProtectedRoute = ({ isAuthorized, children }) => {
  if (!isAuthorized) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  const { isAuthorized, setIsAuthorized, setUser } = useContext(Context);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/getuser`,
          {
            withCredentials: true,
          }
        );
        setUser(response.data.user);
        setIsAuthorized(true);
      } catch (error) {
        setIsAuthorized(false);
      }
    };
    fetchUser();
  }, [isAuthorized]);

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute isAuthorized={isAuthorized}>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/job/getall" element={<ProtectedRoute isAuthorized={isAuthorized}> <Jobs /> </ProtectedRoute>} />
          <Route path="/job/:id" element={<ProtectedRoute isAuthorized={isAuthorized}> <JobDetails /> </ProtectedRoute>} />
          <Route path="/application/:id" element={<ProtectedRoute isAuthorized={isAuthorized}> <Application /> </ProtectedRoute>} />
          <Route path="/applications/me" element={<ProtectedRoute isAuthorized={isAuthorized}> <MyApplications /> </ProtectedRoute>} />
          <Route path="/job/post" element={<ProtectedRoute isAuthorized={isAuthorized}> <PostJob /> </ProtectedRoute>} />
          <Route path="/job/me" element={<ProtectedRoute isAuthorized={isAuthorized}> <MyJobs /> </ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <Toaster />
      </BrowserRouter>
    </>
  );
};

export default App;
