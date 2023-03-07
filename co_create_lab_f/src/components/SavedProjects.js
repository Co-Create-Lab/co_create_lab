import React from "react";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import axiosClient from "../axiosClient";
export default function SavedProjects({
  saved,
  bookmarkProject,
  setBookmarkProjects,
}) {
  const handleDeleteProject = (id) => {
    axiosClient.post(`/users/remove`, { projectId: id }).then(() => {
      const updatedProjects = bookmarkProject.filter(
        (project) => project._id !== id
      );
      setBookmarkProjects(updatedProjects);
    });
  };
  return (
    <>
      <div className="container-fluid p-0 bg-light my-3">
        <div className="row d-flex align-items-start justify-content-end col-12 col-md-11 mx-auto bg-light rounded fs-5 py-2 shadow-sm p-2">
          <div className="col-10 col-md-10 fs-5 blueText bg-light p-0">
            <Link
              to={`/projects/${saved._id}`}
              className="overview-title bg-light"
            >
              {saved.project_name}
            </Link>
          </div>
          <div className="bg-light col-2 col-md-2 p-0">
            <div className="d-flex bg-light justify-content-end">
              <div className="bg-light">
                <MdDelete
                  size={19}
                  style={{ backgroundColor: "white" }}
                  fill={"dark-red"}
                  className="deleteIcon bg-light"
                  onClick={(e) => {
                    const message = `Remove project from saved list"${saved.project_name}"?`;
                    if (window.confirm(message)) handleDeleteProject(saved._id);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
