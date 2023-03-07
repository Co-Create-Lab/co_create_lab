import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import dateFormat from "dateformat";
import { BiArrowBack } from "react-icons/bi";
import { MdOutlineDescription } from "react-icons/md";
import { BsPencilSquare } from "react-icons/bs";
import { IoMdMail } from "react-icons/io";
import { BsHeart } from "react-icons/bs";
import { BsHeartFill } from "react-icons/bs";
import { BiBarChart } from "react-icons/bi";
import { FiShare } from "react-icons/fi";
import { Link } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useContext } from "react";
import { BsBookmarkHeartFill } from "react-icons/bs";
import { BsBookmarkHeart } from "react-icons/bs";
import { AuthContext } from "../context/AuthProvider";
import DOMPurify from "dompurify";
import Spinner from "./Spinner";
import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import Tooltip from "react-bootstrap/Tooltip";
import { InlineShareButtons } from "sharethis-reactjs";
import AlikeProjects from "./AlikeProjects";
import { toast } from "react-toastify";

export default function Projectdetail({
  setLoadingSpinner,
  loadingSpinner,
  bookmarkProject,
  setBookmarkProjects,
}) {
  const { user } = useContext(AuthContext);
  const [projectdetail, setProjectdetail] = useState([]);

  const [bookmarkIcon, setBookmarkIcon] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const [likedProject, setLikedProjects] = useState([]);
  const [likeIcon, setLikeIcon] = useState(false);

  const goBack = () => {
    navigate("/projects");
  };

  useEffect(() => {
    setLoadingSpinner(true);
    const fetchProjects = async () => {
      try {
        const response = await axiosClient.get(`/projects/${id}`);
        const project = response.data;
        setProjectdetail(project);
        setLoadingSpinner(false);
      } catch (error) {
        console.error(error);
        setLoadingSpinner(false);
        navigate("/404");
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    axiosClient
      .get(`/users/bookmarks`)
      .then((res) => {
        setBookmarkProjects(res.data);
        if (res.data.find((project) => project._id === id)) {
          setBookmarkIcon(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleBookmarkClick = () => {
    const isBookmarked = bookmarkProject.find((project) => project._id === id);
    if (isBookmarked) {
      axiosClient
        .post(`/users/remove`, { projectId: id })
        .then((res) => {
          setBookmarkProjects(res.data);
          toast.success("Project was removed.");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axiosClient
        .post(`/users/bookmarks`, { projectId: id })
        .then((res) => {
          setBookmarkProjects(res.data);
          toast.success("Project was saved.");
        })
        .catch((err) => {
          console.log(err);
        });
    }
    setBookmarkIcon(!bookmarkIcon);
  };

  //likes

  useEffect(() => {
    axiosClient
      .get(`/projects/like/${id}`)
      .then((res) => {
        setLikedProjects(res.data);
        if (res.data.includes(user?._id)) {
          setLikeIcon(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleLike = () => {
    const findLike = likedProject.includes(user._id);

    if (findLike) {
      axiosClient
        .post(`/projects/removelike`, { projectId: id })
        .then((res) => {
          setLikedProjects(res.data);
          setLikeIcon(false);
        })

        .catch((err) => {
          console.log(err);
        });
    } else {
      axiosClient
        .post(`/projects/like`, { projectId: id })
        .then((res) => {
          setLikedProjects(res.data);
          setLikeIcon(true);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    setLikeIcon(!likeIcon);
  };

  const popover = (
    <Popover id="popover-contact">
      <Popover.Header className="dark-blue-background usercontact-header fs-3 text-center">
        Wanna drop {projectdetail.creator?.username} a line?
      </Popover.Header>
      <Popover.Body className="dark-blue-background usercontact-body light-gray-text">
        <div className="dark-blue-background light-gray-text">
          <div className="dark-blue-background light-gray-text">
            <div className="card-body border border-0">
              <h5 className="card-title text-start dark-blue-background light-gray-text border border-0  pb-3">
                {" "}
                <span className="dark-blue-background">
                  {" "}
                  <svg
                    className="bi bi-person-fill usercontact-icon me-1"
                    viewBox="0 0 16 16"
                  >
                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                  </svg>{" "}
                </span>{" "}
                {projectdetail.creator?.username}
              </h5>
              <h5 className="dark-blue-background light-gray-text">
                <a
                  href="mailto:cocreate@lab.com"
                  className="dark-blue-background usercontact-mail"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="bi bi-envelope-fill usercontact-icon me-2"
                    viewBox="0 0 16 16"
                  >
                    <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z" />
                  </svg>
                  {projectdetail.creator?.email}
                </a>
              </h5>
            </div>
          </div>
        </div>
      </Popover.Body>
    </Popover>
  );

  const sharePopover = (
    <Popover id="share-popover" className="share-body">
      <Popover.Body className="share-body dark-blue-background">
        <div>
          <div className="dark-blue-background light-gray-text pb-2 ">
            Share your favorite project <br></br>
          </div>
          <input
            type="text"
            className="form-control share-input ps-1 dark-blue-background  rounded-0"
            value={`https://co-create-lab/projects/${projectdetail._id}`}
          ></input>
        </div>
        <button
          type="button"
          className="btn share-button mt-2"
          onClick={() => {
            navigator.clipboard.writeText(
              "https://co-create-lab/projects/873463903748435623908"
            );
          }}
        >
          Copy
        </button>
      </Popover.Body>
    </Popover>
  );

  function createMarkup(html) {
    return {
      __html: DOMPurify.sanitize(html),
    };
  }

  return (
    <>
      {loadingSpinner ? (
        <Spinner />
      ) : (
        <>
          <div className="container-fluid projectdetail mt-4 p-0">
            <div className=" col-md-7 col-xl-6 col-xxl-6 mx-auto projectdetail-div">
              <div className="bg-light rounded-3 shadow-sm ">
                <div className="mx-4 pt-4 bg-light bookmark d-flex align-items-start">
                  <h2 className="bg-light detailsPage blueText loginFormText">
                    {projectdetail?.project_name}
                  </h2>
                  <p className="bg-light ps-2" onClick={handleBookmarkClick}>
                    {bookmarkIcon ? (
                      <BsBookmarkHeartFill
                        size={25}
                        style={{ fill: "#f66b0e", backgroundColor: "white" }}
                      />
                    ) : (
                      <BsBookmarkHeart
                        size={25}
                        style={{ backgroundColor: "white" }}
                      />
                    )}
                  </p>
                </div>
                <div className="container bg-light mt-2 my-0 ">
                  <div className="bg-light d-flex mx-2">
                    <div className="p-0 bg-light ">
                      <OverlayTrigger
                        placement="top"
                        className="bg-light"
                        overlay={
                          <Tooltip id="create_tooltip" className="tooltip">
                            Views
                          </Tooltip>
                        }
                      >
                        <button className="position-relative view-icon">
                          <span className="position-absolute top-0 start-100 translate-middle badge view-icon-text">
                            {projectdetail.views}
                            <span className="visually-hidden">views</span>
                          </span>
                          <BiBarChart
                            size={22}
                            className="bg-light"
                            style={{
                              fill: "#112b3c",
                              backgroundColor: "white",
                            }}
                          />
                        </button>
                      </OverlayTrigger>
                    </div>
                    <div className=" p-0 bg-light" onClick={handleLike}>
                      {likeIcon ? (
                        <OverlayTrigger
                          placement="top"
                          className="bg-light"
                          overlay={
                            <Tooltip id="create_tooltip" className="tooltip">
                              Likes
                            </Tooltip>
                          }
                        >
                          <button className="position-relative view-icon">
                            <span className="position-absolute top-0 start-100 translate-middle badge view-icon-text">
                              {projectdetail.likes?.length}
                              <span className="visually-hidden">likes</span>
                            </span>
                            <BsHeartFill
                              size={18}
                              style={{
                                fill: "#f66b0e",
                                backgroundColor: "#f8f9fa",
                              }}
                            />
                          </button>
                        </OverlayTrigger>
                      ) : (
                        <OverlayTrigger
                          placement="top"
                          className="bg-light"
                          overlay={
                            <Tooltip id="create_tooltip" className="tooltip">
                              Likes
                            </Tooltip>
                          }
                        >
                          <button className="position-relative view-icon">
                            <span className="position-absolute top-0 start-100 translate-middle badge view-icon-text">
                              {projectdetail.likes?.length}
                              <span className="visually-hidden">likes</span>
                            </span>
                            <BsHeart
                              size={17}
                              style={{
                                backgroundColor: "#f8f9fa",
                              }}
                            />
                          </button>
                        </OverlayTrigger>
                      )}
                    </div>
                  </div>
                  <hr className="solid mx-3 p-0"></hr>
                  <div className="row row-cols-2 mx-1 bg-light ">
                    <div className="bg-light">
                      <p className="bg-light detailsFont m-0">
                        <span className="me-1 bg-light">
                          {" "}
                          <BsPencilSquare className="bg-light" />
                        </span>
                        Created
                      </p>
                      <p className="bg-light ms-3">
                        {dateFormat(projectdetail?.createdAt, "dd. mmmm yyyy")}
                      </p>
                    </div>
                    <div className="bg-light">
                      <p className="bg-light m-0 detailsFont">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="bi bi-calendar2-plus projectoverviewicon bg-light"
                          viewBox="0 0 16 16"
                        >
                          <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H2z" />
                          <path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V4zM8 8a.5.5 0 0 1 .5.5V10H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V11H6a.5.5 0 0 1 0-1h1.5V8.5A.5.5 0 0 1 8 8z" />
                        </svg>
                        <span className="bg-light detailsFont">Start Date</span>
                      </p>
                      {projectdetail?.start_date !== "open" && (
                        <p className="bg-light ms-3">
                          {dateFormat(
                            projectdetail?.start_date,
                            "dd. mmmm yyyy"
                          )}
                        </p>
                      )}
                      {projectdetail?.start_date === "open" && (
                        <p className="bg-light ms-3">
                          {projectdetail?.start_date}
                        </p>
                      )}
                    </div>
                    <div className="bg-light ">
                      <p className="bg-light my-0 detailsFont">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="bi bi-geo-alt-fill projectoverviewicon bg-light"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                        </svg>
                        <span className="bg-light detailsFont">Location</span>
                      </p>
                      <p className="bg-light ms-3 my-0 w-100">
                        {projectdetail?.location}
                      </p>
                    </div>
                  </div>
                  <hr className="solid mx-3"></hr>
                </div>
                <div className="container bg-light ">
                  <div className="row row-cols-2 ms-1">
                    <div className="bg-light">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="bi bi-tags-fill projectoverviewicon bg-light"
                        viewBox="0 0 16 16"
                      >
                        <path d="M2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586V2zm3.5 4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
                        <path d="M1.293 7.793A1 1 0 0 1 1 7.086V2a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l.043-.043-7.457-7.457z" />
                      </svg>
                      <span className="bg-light detailsFont">Category</span>
                      {projectdetail?.categories?.map((category, i) => {
                        return (
                          <div className="bg-light" key={i}>
                            <ul className="bg-light m-0 ps-3">
                              <li className="bg-light">{category}</li>
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                    <div className="bg-light">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="bi bi-tags-fill projectoverviewicon bg-light"
                        viewBox="0 0 16 16"
                      >
                        <path d="M2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586V2zm3.5 4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
                        <path d="M1.293 7.793A1 1 0 0 1 1 7.086V2a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l.043-.043-7.457-7.457z" />
                      </svg>
                      <span className="bg-light detailsFont">Tech Stack</span>
                      {projectdetail?.tech_stack?.map((stack, i) => {
                        return (
                          <div className="bg-light" key={i}>
                            <ul className="bg-light m-0 ps-3">
                              <li className="bg-light">{stack}</li>
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="bg-light mt-2 ">
                  <div className="bg-light mx-4">
                    <hr className="solid"></hr>
                    <MdOutlineDescription className="bg-light" />
                    <span className="bg-light detailsFont">Description</span>
                    <div
                      className="bg-light details_description mt-3"
                      dangerouslySetInnerHTML={createMarkup(
                        projectdetail.description
                      )}
                    ></div>
                    <hr className="solid mx-autos"></hr>
                  </div>
                  <div className="bg-light my-4">
                    <InlineShareButtons
                      className="bg-light"
                      config={{
                        alignment: "center",
                        color: "white",
                        enabled: true,
                        font_size: 35,
                        language: "en",
                        networks: [
                          "sharethis",
                          "gmail",
                          "linkedin",
                          "twitter",
                          "whatsapp",
                          "messenger",
                        ],
                        padding: 6,
                        radius: 6,
                        show_total: true,
                        size: 30,
                        url: `http://localhost:3000/projects/${projectdetail._id}`,
                        image: "https://bit.ly/2CMhCMC",
                        description: "Checkout this awesome project",
                        title: "Checkout this awesome project",
                        message: "Checkout this awesome project",
                        subject: "Checkout this awesome project",
                        username: "custom twitter handle",
                      }}
                    />
                  </div>
                  <div className="bg-light text-center mb-2 pb-3">
                    {user && (
                      <div className="bg-light" id="">
                        <OverlayTrigger
                          trigger="focus"
                          placement="top"
                          overlay={popover}
                        >
                          <Button className="btn footer_newsletterbutton">
                            Contact the Creator
                          </Button>
                        </OverlayTrigger>
                      </div>
                    )}
                    {!user && (
                      <div className="bg-light" id="">
                        <OverlayTrigger
                          overlay={
                            <Tooltip id="tooltip-disabled">
                              Please log in to contact the creator!
                            </Tooltip>
                          }
                        >
                          <span className="d-inline-block">
                            <Button
                              className="btn footer_newsletterbutton"
                              disabled
                            >
                              Contact the Creator
                            </Button>
                          </span>
                        </OverlayTrigger>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="backDiv">
                <button
                  className="backBtn text-start p-0"
                  type="button"
                  onClick={goBack}
                >
                  <BiArrowBack size={16} className="me-1" />
                  Back
                </button>
              </div>
            </div>

            <AlikeProjects />
            <Helmet>
              <meta charSet="utf-8" />
              <title>Project|CoCreateLab</title>
              <link rel="canonical" href="/projects/" />
            </Helmet>
          </div>
        </>
      )}
    </>
  );
}
