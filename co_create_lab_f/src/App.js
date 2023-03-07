import "./App.css";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Error from "./components/Error";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Projectdetail from "./components/Projectdetail";
import Allprojects from "./components/Allprojects";
import Userprofile from "./components/Userprofile";
import EditProject from "./components/EditProject";
import CreateAProject from "./components/CreateAProject";
import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "./context/AuthProvider";
import Protected from "./components/Protected";
import AllprojectsCategory from "./components/AllprojectsCategory";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import About from "./components/About";
import Mymap from "./components/Mymap";

import ScrollToTop from "./components/ScrollToTop";

function App() {
  const [show, setShow] = useState(false);
  const { user, loading, logout } = useContext(AuthContext);
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [bookmarkProject, setBookmarkProjects] = useState([]);
  return (
    <>
      <ScrollToTop />
      <Header show={show} setShow={setShow} />
      <div className="components">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                setLoadingSpinner={setLoadingSpinner}
                loadingSpinner={loadingSpinner}
                setShow={setShow}
              />
            }
          />
          <Route
            path="/login"
            element={<Login show={show} setShow={setShow} />}
          />
          <Route
            path="/signup"
            element={<Signup show={show} setShow={setShow} />}
          />
          <Route
            path="/projects"
            element={
              <Allprojects
                setLoadingSpinner={setLoadingSpinner}
                loadingSpinner={loadingSpinner}
              />
            }
          />
          <Route
            path="/projects/category/:category"
            element={
              <AllprojectsCategory
                setLoadingSpinner={setLoadingSpinner}
                loadingSpinner={loadingSpinner}
              />
            }
          />
          <Route
            path="/projects/:id"
            element={
              <Projectdetail
                setLoadingSpinner={setLoadingSpinner}
                loadingSpinner={loadingSpinner}
                bookmarkProject={bookmarkProject}
                setBookmarkProjects={setBookmarkProjects}
              />
            }
          />

          <Route path="/projects/onsite" element={<Mymap />} />

          <Route path="/*" element={<Error />} />

          <Route path="/about" element={<About />} />

          <Route path="/" element={<Protected />}>
            <Route
              path="/profile"
              element={
                <Userprofile
                  bookmarkProject={bookmarkProject}
                  setBookmarkProjects={setBookmarkProjects}
                />
              }
            />
            <Route path="/createproject" element={<CreateAProject />} />
            <Route path="/editproject/:id" element={<EditProject />} />
          </Route>
        </Routes>
      </div>
      <ToastContainer />
      <Footer />
    </>
  );
}

export default App;
