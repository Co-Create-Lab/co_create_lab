import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { Avatar } from "@mui/material";
import Stack from "@mui/material/Stack";
export default function Header({ setShow }) {
  const navigate = useNavigate();
  const { user, loading, logout } = useContext(AuthContext);
  const handleShow = () => setShow(true);

  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: "#205375",
        height: 40,
        width: 40,
        fontSize: "1.8rem",
      },
      children: `${name.split(" ")[0][0]}`,
    };
  }
  return (
    <>
      <nav className="navbar navbar-expand-sm container-fluid header headershadow">
        <div className="logo">
          <Link to="/" className="logo">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                fill="currentColor"
                className="bi bi-share-fill logo_icon"
                viewBox="0 0 16 16"
              >
                <path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5z" />
              </svg>
            </div>
            <div className="logo_text">CO CREATE LAB</div>
          </Link>
        </div>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navHeaderContent"
          aria-controls="navHeaderContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse headergroup"
          id="navHeaderContent"
        >
          {!loading && (
            <div className="headergroup">
              <Link
                to="/projects"
                className="viewAllProjects me-3"
                onClick={(e) => navigate("/projects")}
              >
                View all projects
              </Link>
              <div className="headerbuttongroup">
                {!user ? (
                  <div>
                    <Link to="/login">
                      <button
                        className="btn loginbutton"
                        type="button"
                        onClick={handleShow}
                      >
                        LogIn
                      </button>
                    </Link>

                    <Link to="/signup" className="ms-3">
                      <button
                        className="btn signupbutton"
                        type="button"
                        onClick={handleShow}
                      >
                        SignUp
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div>
                    <Link to="/createproject" className="">
                      <button className="btn loginbutton" type="button">
                        Add a project
                      </button>
                    </Link>
                    <button
                      className="btn loginbutton me-2"
                      type="button"
                      onClick={logout}
                    >
                      Logout
                    </button>
                    <Link to={`/profile`}>
                      <button
                        className="btn loginbutton p-0"
                        type="button"
                        onClick={handleShow}
                      >
                        <Stack direction="row">
                          {user?.username && (
                            <Avatar
                              alt="username"
                              {...stringAvatar(user?.username)}
                            />
                          )}
                        </Stack>
                      </button>
                    </Link>{" "}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
