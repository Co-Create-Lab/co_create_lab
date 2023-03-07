import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import { IoMdMail } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import Userdetails from "./Userdetails";
import { BiArrowBack } from "react-icons/bi";
import { Avatar } from "@mui/material";
import Stack from "@mui/material/Stack";
import { FiArrowRight } from "react-icons/fi";
import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import { BsBookmarkHeart } from "react-icons/bs";
import { RiLockPasswordFill } from "react-icons/ri";

import { GrProjects } from "react-icons/gr";
import SavedProjects from "./SavedProjects";
import Projectdetail from "./Projectdetail";

export default function Userprofile({ bookmarkProject, setBookmarkProjects }) {
  const { user, loading } = useContext(AuthContext);
  const [userProjects, setUserProjects] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axiosClient
      .get(`/projects/myprojects/${user._id}`)
      .then((response) => {
        setUserProjects(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const goBack = () => {
    navigate("/projects");
  };

  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: "#205375",
        height: 20,
        width: 20,
        fontSize: "1rem",
      },
      children: `${name.split(" ")[0][0]}`,
    };
  }

  useEffect(() => {
    axiosClient
      .get(`/users/bookmarks`)
      .then((res) => {
        setBookmarkProjects(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <div className="container-fluid userprofile">
        <div className="mt-md-2 ms-md-5 pt-3">
          <Tab.Container id="left-tabs-example" defaultActiveKey="second">
            <Row>
              <Col sm={3}>
                <Nav
                  variant="pills"
                  className="flex-column shadow rounded sidebarHeight bg-light"
                >
                  <Nav.Item bsPrefix="m-md-2 rounded bg-light p-1 ">
                    <Nav.Link
                      eventKey="first"
                      className="tab"
                      bsPrefix="custom-link bg-light d-flex align-items-center gap-1"
                    >
                      <Stack direction="row" className="bg-light">
                        {user?.username && (
                          <Avatar
                            alt="username"
                            {...stringAvatar(user?.username)}
                          />
                        )}
                      </Stack>
                      Profile
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item bsPrefix=" m-md-2 rounded bg-light p-1">
                    <Nav.Link eventKey="second" bsPrefix="custom-link bg-light">
                      <GrProjects size={15} className="bg-light me-1" /> Your
                      Projects
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item bsPrefix="m-md-2 rounded bg-light p-1">
                    <Nav.Link eventKey="third" bsPrefix="custom-link bg-light">
                      <BsBookmarkHeart className="bg-light me-1" />
                      Saved Projects
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
              <Col sm={7}>
                <Tab.Content>
                  <Tab.Pane eventKey="first">
                    <div className="container-fluid tabsHeight rounded mx-auto overflow-auto mt-3 mt-md-0 p-0 bg-light shadow">
                      <div className=" col-11 mx-auto mt-4 mt-md-3">
                        <h5>Personal Information</h5>
                        <p className="card-title text-start">
                          {" "}
                          <span className="">
                            {" "}
                            <FaUserCircle size={15} className="me-1" />
                          </span>{" "}
                          {user?.username}
                        </p>
                        <p
                          className="card-text text-start mb-1"
                          onClick={() =>
                            (window.location = "mailto:yourmail@domain.com")
                          }
                        >
                          <span className="">
                            <IoMdMail size={16} className="me-1" />
                          </span>{" "}
                          {user?.email}
                        </p>
                        <p className="card-text text-start mb-1 loginbutton">
                          <span className="">
                            <RiLockPasswordFill size={16} className="me-1" />
                          </span>{" "}
                          Change password
                        </p>
                      </div>
                      <div className=" col-11 mx-auto mt-3">
                        <h5 className="">Metrics</h5>
                        <div>Your Projects: {userProjects?.length}</div>
                        <div>Saved Projects: {bookmarkProject?.length}</div>
                      </div>
                      <div className="col-11 mx-auto mt-3">
                        <h5 className="bg-light">
                          {" "}
                          <Link to="/createproject" className="">
                            <button className="btn signupbutton" type="button">
                              Add project
                            </button>
                          </Link>
                        </h5>
                      </div>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="second">
                    {" "}
                    <div className="container-fluid tabsHeight rounded mx-auto overflow-auto mt-3 mt-md-0 p-0 bg-light shadow">
                      <div className="col-md-11 mx-auto rounded d-flex justify-content-evenly align-items-center bg-light">
                        {userProjects == "" && (
                          <div className="d-flex gap-5 bg-light mt-5">
                            <h5 className="bg-light ps-2 ">
                              Would you like to add a new project?{" "}
                              <span className="bg-light ps-1">
                                {" "}
                                <FiArrowRight className="bg-light" />
                              </span>
                            </h5>
                            <h5 className="bg-light">
                              {" "}
                              <Link to="/createproject" className="bg-light">
                                <button
                                  className="btn signupbutton"
                                  type="button"
                                >
                                  Add project
                                </button>
                              </Link>
                            </h5>
                          </div>
                        )}
                      </div>

                      {userProjects?.map((project) => {
                        return (
                          <Userdetails
                            key={project._id}
                            project={project}
                            userProjects={userProjects}
                            setUserProjects={setUserProjects}
                          />
                        );
                      })}
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="third">
                    <div className="container-fluid tabsHeight rounded mx-auto overflow-auto mt-3 mt-md-0 p-0 bg-light shadow">
                      <div className="col-md-11 mx-auto rounded d-flex justify-content-evenly align-items-center bg-light">
                        {bookmarkProject == "" && (
                          <div className="d-flex gap-5 bg-light mt-5">
                            <h5 className="bg-light ps-2 ">
                              No saved projects.
                            </h5>
                          </div>
                        )}
                      </div>
                      {bookmarkProject?.map((saved) => {
                        return (
                          <SavedProjects
                            key={saved._id}
                            saved={saved}
                            bookmarkProject={bookmarkProject}
                            setBookmarkProjects={setBookmarkProjects}
                          />
                        );
                      })}
                    </div>
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </div>

        <div className="container col-md-5 col-sm-12 ">
          <button
            className="backBtn text-start p-0 my-4"
            type="button"
            onClick={goBack}
          >
            <BiArrowBack size={16} className="me-1" />
            Back to overview
          </button>
        </div>
      </div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Your Profile|CoCreateLab</title>
        <link rel="canonical" href="/user/" />
      </Helmet>
    </>
  );
}
