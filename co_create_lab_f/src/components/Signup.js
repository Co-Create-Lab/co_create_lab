import { Helmet } from "react-helmet";
import React from "react";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";
import { FormCheck } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthProvider";

export default function Example({ show, setShow }) {
  const handleShow = () => {
    setShow(true);
  };
  const { signup, loading } = useContext(AuthContext);
  const [userData, setUserData] = useState({
    first_name: "",
    username: "",
    email: "",
    password: "",
  });
  const [newUser, setNewUser] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };
  const handleClose = () => {
    setShow(false);
    navigate("/");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    signup({ ...userData });
  };

  return (
    <>
      <div className="loginPage d-flex justify-content-center align-items-center">
        <Link to="/signup">
          <button
            className="btn signupbutton"
            type="button"
            onClick={handleShow}
          >
            Create your account
          </button>
        </Link>
      </div>
      <div>
        <Modal
          className="p-4 modBot"
          show="true"
          onHide={handleClose}
          size="sm"
          backdrop="static"
          animation={false}
        >
          <Modal.Header closeButton className="bg-light">
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

          <Modal.Body className="mb-1 bg-light">
            <Modal.Title className="text-center mb-1 loginTextLink bg-light">
              Create your account
            </Modal.Title>
            <p className="text-center loginTextLink bg-light">
              Already have an account?{" "}
              <Link to="/login" className="loginFormText bg-light">
                LogIn
              </Link>
            </p>
            <Form className="bg-light">
              <Form.Group className="mb-1 bg-light">
                <Form.Label className="mb-1 loginTextLink bg-light">
                  Name
                </Form.Label>
                <Form.Control
                  type="text"
                  className="p-1"
                  placeholder="Name"
                  name="first_name"
                  autoFocus
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-1 bg-light">
                <Form.Label className="mb-1 loginTextLink bg-light">
                  Username
                </Form.Label>
                <Form.Control
                  type="text"
                  className="p-1"
                  placeholder="Username"
                  name="username"
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-1 bg-light">
                <Form.Label className="mb-1 loginTextLink bg-light">
                  Email address
                </Form.Label>
                <Form.Control
                  type="email"
                  className="p-1"
                  placeholder="email@example.com"
                  name="email"
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-2 bg-light">
                <Form.Label className="mb-1 loginTextLink bg-light">
                  Password
                </Form.Label>
                <Form.Control
                  type="Password"
                  className="p-1"
                  placeholder="Password"
                  name="password"
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="bg-light d-flex gap-1">
                <Form.Check
                  type="checkbox"
                  className="loginTextLink bg-light"
                />
                <Form.Label className="mb-1 loginTextLink bg-light">
                  Subscribe to our newsletter
                </Form.Label>
              </Form.Group>
              <button
                className="btn signupbutton w-100 p-1 mt-2"
                type="submit"
                onClick={handleSubmit}
              >
                SignUp
              </button>
            </Form>
          </Modal.Body>
        </Modal>
        <Helmet>
          <meta charSet="utf-8" />
          <title>SignUp|CoCreateLab</title>
          <link rel="canonical" href="/signup" />
        </Helmet>
      </div>
    </>
  );
}
