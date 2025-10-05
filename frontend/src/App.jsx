/* eslint-disable no-unused-vars */
import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Customize from "./pages/Customize";
import Customize2 from "./pages/Customize2";
import Home from "./pages/Home";
import { useContext } from "react";
import { userDataContext } from "./context/UserContext";

function App() {
  const { userData, setUserData } = useContext(userDataContext);

  // Check if user has completed assistant setup
  const hasCompletedSetup = userData?.assistantImage && userData?.assistantName;

  return (
    <Routes>
      <Route
        path="/"
        element={
          hasCompletedSetup ? (
            <Home />
          ) : userData ? (
            <Navigate to="/customize" />
          ) : (
            <Navigate to="/signin" />
          )
        }
      />
      <Route
        path="/signup"
        element={!userData ? <SignUp /> : <Navigate to="/" />}
      />
      <Route
        path="/signin"
        element={!userData ? <SignIn /> : <Navigate to="/" />}
      />
      <Route
        path="/customize"
        element={userData ? <Customize /> : <Navigate to="/signin" />}
      />
      <Route
        path="/customize2"
        element={userData ? <Customize2 /> : <Navigate to="/signin" />}
      />
    </Routes>
  );
}

export default App;