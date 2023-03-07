import { Helmet } from "react-helmet";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { useState } from "react";
import axiosClient from "../axiosClient";
import { Link } from "react-router-dom";
import EditProject from "./EditProject";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function Userdetails({
  project,
  userProjects,
  setUserProjects,
}) {
  const [show, setShow] = useState(false);
  const [isClickedEdit, setIsClickedEdit] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const deleteProject = (id, e) => {
    axiosClient.delete(`projects/${id}`).then((res) => {
      const deletedProject = userProjects.filter((pro) => pro._id !== id);
      setUserProjects(deletedProject);
    });
  };

  const handleEditPage = () => {
    setIsClickedEdit(!isClickedEdit);
  };

  return (
    <>
      <div className="container-fluid p-0 bg-light my-3">
        <div className="row d-flex align-items-start justify-content-end col-12 col-md-11 mx-auto bg-light rounded fs-5 py-2 shadow-sm px-2">
          <div className="col-10 col-md-10 fs-5 blueText bg-light p-0">
            <Link
              to={`/projects/${project._id}`}
              className="overview-title bg-light"
            >
              {project.project_name}
            </Link>
          </div>
          <div className="bg-light col-2 col-md-2 p-0">
            <div className="d-flex bg-light justify-content-end">
              <div className="bg-light me-3">
                <FiEdit
                  onClick={handleShow}
                  size={15}
                  style={{ backgroundColor: "white" }}
                  className="editIcon bg-light"
                />
              </div>
              <div className="bg-light">
                <MdDelete
                  onClick={(e) => {
                    const message = `Delete this project "${project.project_name}"?`;
                    if (window.confirm(message)) deleteProject(project._id, e);
                  }}
                  size={19}
                  style={{ backgroundColor: "white" }}
                  fill={"dark-red"}
                  className="deleteIcon bg-light"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal show={show} onHide={handleClose} animation={false} size="lg">
        <Modal.Header className="bg-light" closeButton>
          <div className="bg-light">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              fill="currentColor"
              className="bi bi-share-fill logo_icon bg-light"
              viewBox="0 0 16 16"
            >
              <path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5z" />
            </svg>
          </div>
          <div className="ms-2 logo_text bg-light">CO CREATE LAB</div>
        </Modal.Header>
        <Modal.Body>
          {" "}
          <EditProject
            project={project}
            isClickedEdit={isClickedEdit}
            setIsClickedEdit={setIsClickedEdit}
            show={show}
            setShow={setShow}
            handleClose={handleClose}
          />
        </Modal.Body>
      </Modal>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Contact a creator|CoCreateLab</title>
        <link rel="canonical" href="/user/contact" />
      </Helmet>
    </>
  );
}
