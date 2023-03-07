import { tech_stack_options, categoriesOptions, customStyles } from "../const";
import { Helmet } from "react-helmet";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import axiosClient from "../axiosClient";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Texteditor from "./Texteditor";
import { Editor } from "react-draft-wysiwyg";
import { convertToHTML } from "draft-convert";
import DOMPurify from "dompurify";
import {
  ContentState,
  convertToRaw,
  EditorState,
  convertFromHTML,
  convertFromRaw,
} from "draft-js";
import dateFormat, { masks } from "dateformat";
import Spinner from "./Spinner";

export default function EditProject({
  project,
  isClickedEdit,
  setIsClickedEdit,
  setLoadingSpinner,
  loadingSpinner,
  show,
  setShow,
}) {
  function createMarkup(html) {
    return {
      __html: DOMPurify.sanitize(html),
    };
  }
  const [project_name, setName] = useState(`${project.project_name}`);
  const [description, setDescription] = useState("");
  const [locationHelper, setLocationHelper] = useState("");
  const [location, setLocation] = useState(`${project.location}`);
  const [startDateHelper, setStartDateHelper] = useState("");
  const [start_date, setStartDate] = useState(`${project.start_date}`);
  const [tech_stack, setTechStack] = useState(`${project.tech_stack}`);
  const [categories, setCategory] = useState([`${project.categories}`]);
  const [newProjectId, setNewProjectId] = useState("");
  const [autocompleteCities, setAutocompleteCities] = useState([]);
  const [autocompleteErr, setAutocompleteErr] = useState("");

  const [convertedContent, setConvertedContent] = useState(null);
  const [showEdit, setShowEdit] = useState(false);

  const navigate = useNavigate();

  //for editor

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  useEffect(() => {
    let html = convertToHTML(editorState.getCurrentContent());
    setConvertedContent(html);
    setDescription(convertedContent);
  }, [editorState]);

  const handleCityChange = async (e) => {
    setLocation(e.target.value);
    if (!location) return;

    const res = await fetchPlace(location);
    !autocompleteCities.includes(e.target.value) &&
      res.features &&
      setAutocompleteCities(res.features.map((place) => place.place_name));
    res.error ? setAutocompleteErr(res.error) : setAutocompleteErr("");
  };

  const handleOnChangeName = (e) => {
    setName(e.target.value);
  };

  const handleOnChangeLocationHelper = (e) => {
    setLocationHelper(e.target.value);
    setLocation(e.target.value);
  };

  const handleOnChangeLocationHelperRemote = (e) => {
    setLocationHelper(e.target.value);
    if (e.target.value === "remote") {
      setLocation("remote");
    } else {
      setLocation("");
    }
  };

  const handleOnChangeStartDate = (e) => {
    setStartDateHelper(e.target.value);
  };

  const handleOnChangeStartDateNotOpen = (e) => {
    setStartDateHelper(e.target.value);
    if (e.target.value === "open") {
      setStartDate("open");
    } else {
      setStartDate(project.start_date);
    }
  };

  const handleOnChangeSpecificDate = (e) => {
    setStartDate(`${e.target.value}T00:42:15.714Z`);
  };

  const handleOnChangeTechStack = (tech_stack_options) => {
    setTechStack(
      [].slice
        .call(tech_stack_options)
        .map((tech_stack_option) => tech_stack_option.value)
    );
  };

  const onSelectedOptionsChange = (options) => {
    setCategory([].slice.call(options).map((option) => option.value));
  };
  const handleClose = () => setShow(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axiosClient
      .put(`/projects/${project._id}`, {
        project_name,
        description,
        categories,
        location,
        start_date,
        tech_stack,
      })
      .then((response) => {
        setNewProjectId(response.data._id);
        setIsClickedEdit(false);
        handleClose();
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        navigate("/404");
      });
  };

  const handlereset = () => {
    window.location.reload();
  };

  const fetchPlace = async (text) => {
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${text}.json?access_token=${process.env.REACT_APP_API_KEY}&cachebuster=1625641871908&autocomplete=true&types=place`
      );
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    } catch (err) {
      return { error: "Unable to retrieve places" };
    }
  };

  let defaultValueTechStack = project.tech_stack?.map((tech) => {
    let properties = {
      label: tech,
      value: tech,
    };
    return properties;
  });

  let defaultValueCategories = project.categories?.map((category) => {
    let properties = {
      label: category,
      value: category,
    };
    return properties;
  });

  return (
    <>
      {loadingSpinner ? (
        <Spinner />
      ) : (
        <>
          <div className="container">
            <div className="mt-2 orangeText">
              <h3 className="pe-3 mb-4 text-center">Edit this project </h3>
            </div>
            <div className="">
              <Form onSubmit={handleSubmit} id="createAProject" className="">
                <Row className="mb-3">
                  <Form.Group controlId="projectname">
                    <Form.Label className="">
                      Project Name
                      <OverlayTrigger
                        placement="right"
                        className="bg-light"
                        overlay={
                          <Tooltip id="create_tooltip" className="tooltip">
                            Add a short but interesting name for your projects
                            which summarizes your idea for other users
                          </Tooltip>
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="bi bi-question-circle questionmarkicon "
                          viewBox="0 0 16 16"
                          id="tooltip_questionmarkicon"
                        >
                          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                          <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z" />
                        </svg>
                      </OverlayTrigger>
                    </Form.Label>
                    <Form.Control
                      onChange={handleOnChangeName}
                      value={project_name}
                      required
                      placeholder="Add a catchy project name"
                    />
                  </Form.Group>
                </Row>
                <Form.Group className="mb-3" controlId="description">
                  <Form.Label>
                    Description
                    <OverlayTrigger
                      placement="right"
                      className="bg-light"
                      overlay={
                        <Tooltip id="create_tooltip" className="tooltip">
                          Describe your idea in detail. What do you want to
                          build? Why? What's the goal and the purpose?
                        </Tooltip>
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="bi bi-question-circle questionmarkicon "
                        viewBox="0 0 16 16"
                        id="tooltip_questionmarkicon"
                      >
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                        <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z" />
                      </svg>
                    </OverlayTrigger>
                  </Form.Label>
                  <div
                    className=" edit-description"
                    dangerouslySetInnerHTML={createMarkup(project.description)}
                  ></div>

                  <div className="text-center">
                   
                      <p>
                        <button
                          className="btn collapsebutton-dark mt-3"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseExample"
                          aria-expanded="false"
                          aria-controls="collapseExample"
                        >
                          Change description
                        </button>
                        <OverlayTrigger
                          placement="right"
                          className="bg-light"
                          overlay={
                            <Tooltip id="create_tooltip" className="tooltip">
                              Due to a bug it's currently not possible to show
                              your unedited description in the text editor by
                              default. We're working on that! Next week
                              everything will be back to normal! Till then,
                              please make use of copy-pasting the description
                              to the editor. Thanks for your understanding!
                            </Tooltip>
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="bi bi-question-circle questionmarkicon "
                            viewBox="0 0 16 16"
                            id="tooltip_questionmarkicon"
                          >
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                            <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z" />
                          </svg>
                        </OverlayTrigger>
                      </p>
                     
                    <div className="collapse texteditor" id="collapseExample"> <Editor
                      editorState={editorState}
                      onEditorStateChange={setEditorState}
                      toolbarClassName="toolbar-class "
                      wrapperClassName="wrapper-class"
                      editorClassName="editor-class"
                      toolbar={{
                        options: [
                          "inline",
                          "blockType",
                          "list",
                          "textAlign",
                          "emoji",
                          "remove",
                          "history",
                        ],
                      }}
                    /></div>
                  </div>
                </Form.Group>

                {project.location === "remote" && (
                  <Row className="mb-3">
                    <Form.Group as={Col} controlId="location">
                      <Form.Label>
                        Location*
                        <OverlayTrigger
                          placement="right"
                          className="bg-light"
                          overlay={
                            <Tooltip id="create_tooltip" className="tooltip">
                              If it's important for you to find co-creators in
                              your city to meet in person as well, you can enter
                              your location here. Or leave it to remote.
                            </Tooltip>
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="bi bi-question-circle questionmarkicon "
                            viewBox="0 0 16 16"
                            id="tooltip_questionmarkicon"
                          >
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                            <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z" />
                          </svg>
                        </OverlayTrigger>
                      </Form.Label>
                      <Form.Select
                        aria-label="location"
                        onChange={handleOnChangeLocationHelper}
                      >
                        <option value="remote">Remote</option>
                        <option value="onsite">Onsite</option>
                      </Form.Select>
                    </Form.Group>
                    {locationHelper === "onsite" && (
                      <Form.Group as={Col} controlId="city">
                        <Form.Label>
                          City
                          {autocompleteErr && (
                            <span className="inputError">
                              {autocompleteErr}
                            </span>
                          )}
                        </Form.Label>

                        <Form.Control
                          list="places"
                          type="text"
                          name="city"
                          onChange={handleCityChange}
                          required
                          pattern={autocompleteCities.join("|")}
                          autoComplete="off"
                          placeholder="Choose a city"
                        ></Form.Control>

                        <datalist id="places">
                          {autocompleteCities.map((city, i) => (
                            <option key={i}>{city}</option>
                          ))}
                        </datalist>
                      </Form.Group>
                    )}
                  </Row>
                )}
                {project.location !== "remote" && (
                  <Row className="mb-3">
                    <Form.Group as={Col} controlId="location">
                      <Form.Label>
                        Location
                        <OverlayTrigger
                          placement="right"
                          className="bg-light"
                          overlay={
                            <Tooltip id="create_tooltip" className="tooltip">
                              If it's important for you to find co-creators in
                              your city to meet in person as well, you can enter
                              your location here. Or leave it to remote.
                            </Tooltip>
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="bi bi-question-circle questionmarkicon "
                            viewBox="0 0 16 16"
                            id="tooltip_questionmarkicon"
                          >
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                            <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z" />
                          </svg>
                        </OverlayTrigger>
                      </Form.Label>
                      <Form.Select
                        aria-label="location"
                        onChange={handleOnChangeLocationHelperRemote}
                      >
                        <option value="onsite">Onsite</option>
                        <option value="remote">Remote</option>
                      </Form.Select>
                    </Form.Group>
                    {locationHelper !== "remote" && (
                      <Form.Group as={Col} controlId="city">
                        <Form.Label>
                          City
                          {autocompleteErr && (
                            <span className="inputError">
                              {autocompleteErr}
                            </span>
                          )}
                        </Form.Label>

                        <Form.Control
                          list="places"
                          type="text"
                          name="city"
                          onChange={handleCityChange}
                          required
                          pattern={autocompleteCities.join("|")}
                          autoComplete="off"
                          placeholder="Choose a city"
                          value={location}
                        ></Form.Control>
                        <datalist id="places">
                          {autocompleteCities.map((city, i) => (
                            <option key={i}>{city}</option>
                          ))}
                        </datalist>
                      </Form.Group>
                    )}
                  </Row>
                )}
                {project.start_date === "open" && (
                  <Row className="mb-3">
                    <Form.Group
                      className="mb-3"
                      as={Col}
                      controlId="start_date"
                    >
                      <Form.Label>
                        Project Start
                        <OverlayTrigger
                          placement="right"
                          className="bg-light"
                          overlay={
                            <Tooltip id="create_tooltip" className="tooltip">
                              Do you have a specific date when to start the
                              project or it doesn't matter?
                            </Tooltip>
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="bi bi-question-circle questionmarkicon "
                            viewBox="0 0 16 16"
                            id="tooltip_questionmarkicon"
                          >
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                            <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z" />
                          </svg>
                        </OverlayTrigger>
                      </Form.Label>
                      <Form.Select
                        aria-label="Location"
                        onChange={handleOnChangeStartDate}
                      >
                        <option value="open">Open</option>
                        <option value="specific date">Specific Date</option>
                      </Form.Select>
                    </Form.Group>

                    {startDateHelper === "specific date" && (
                      <Form.Group as={Col} controlId="specific_start_date">
                        <Form.Label>Choose a date</Form.Label>
                        <Form.Control
                          type="date"
                          onChange={handleOnChangeSpecificDate}
                          required
                        ></Form.Control>
                      </Form.Group>
                    )}
                  </Row>
                )}
                {project.start_date !== "open" && (
                  <Row className="mb-3">
                    <Form.Group
                      className="mb-3"
                      as={Col}
                      controlId="start_date"
                    >
                      <Form.Label>
                        Project Start
                        <OverlayTrigger
                          placement="right"
                          className="bg-light"
                          overlay={
                            <Tooltip id="create_tooltip" className="tooltip">
                              Do you have a specific date when to start the
                              project or it doesn't matter?
                            </Tooltip>
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="bi bi-question-circle questionmarkicon "
                            viewBox="0 0 16 16"
                            id="tooltip_questionmarkicon"
                          >
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                            <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z" />
                          </svg>
                        </OverlayTrigger>
                      </Form.Label>
                      <Form.Select
                        aria-label="Location"
                        onChange={handleOnChangeStartDate}
                      >
                        <option value="open">Open</option>
                        <option value="specific date">Specific Date</option>
                      </Form.Select>
                    </Form.Group>

                    {startDateHelper === "specific date" && (
                      <Form.Group as={Col} controlId="specific_start_date">
                        <Form.Label>Choose a date</Form.Label>
                        <Form.Control
                          type="date"
                          onChange={handleOnChangeSpecificDate}
                          required
                        ></Form.Control>
                      </Form.Group>
                    )}
                  </Row>
                )}
                {project.start_date !== "open" && (
                  <Row className="mb-3">
                    <Form.Group
                      className="mb-3"
                      as={Col}
                      controlId="start_date"
                    >
                      <Form.Label>
                        Project Start
                        <OverlayTrigger
                          placement="right"
                          className="bg-light"
                          overlay={
                            <Tooltip id="create_tooltip" className="tooltip">
                              Do you have a specific date when to start the
                              project or it doesn't matter?
                            </Tooltip>
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="bi bi-question-circle questionmarkicon "
                            viewBox="0 0 16 16"
                            id="tooltip_questionmarkicon"
                          >
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                            <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z" />
                          </svg>
                        </OverlayTrigger>
                      </Form.Label>
                      <Form.Select
                        aria-label="Location"
                        onChange={handleOnChangeStartDateNotOpen}
                      >
                        <option value="specific date">Specific Date</option>
                        <option value="open">Open</option>
                      </Form.Select>
                    </Form.Group>

                    {startDateHelper !== "open" && (
                      <Form.Group as={Col} controlId="specific_start_date">
                        <Form.Label>Choose a date</Form.Label>
                        <Form.Control
                          type="date"
                          onChange={handleOnChangeSpecificDate}
                          required
                          value={dateFormat(start_date, "yyyy-mm-dd")}
                        ></Form.Control>
                      </Form.Group>
                    )}
                  </Row>
                )}
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="tech_stack" className="">
                    <Form.Label>
                      Tech Stack
                      <OverlayTrigger
                        placement="right"
                        className="bg-light"
                        overlay={
                          <Tooltip id="create_tooltip" className="tooltip">
                            If you already know which technical skills your
                            co-creators should have, you can enter it here. If
                            you do not know anything about tech, don't worry,
                            just leave it blank.
                          </Tooltip>
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="bi bi-question-circle questionmarkicon "
                          viewBox="0 0 16 16"
                          id="tooltip_questionmarkicon"
                        >
                          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                          <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z" />
                        </svg>
                      </OverlayTrigger>
                    </Form.Label>
                    <Select
                      options={tech_stack_options}
                      isMulti
                      name="tech_stack"
                      className="tech_stack"
                      classNamePrefix="tech_stack.select"
                      onChange={handleOnChangeTechStack}
                      styles={customStyles}
                      defaultValue={defaultValueTechStack}
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="categories" className="">
                    <Form.Label>
                      Category
                      <OverlayTrigger
                        placement="right"
                        className="bg-light"
                        overlay={
                          <Tooltip id="create_tooltip" className="tooltip">
                            In which categories does your idea fit? You can
                            select as many categories as you like. If one
                            important category is missing, let us know!
                          </Tooltip>
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="bi bi-question-circle questionmarkicon "
                          viewBox="0 0 16 16"
                          id="tooltip_questionmarkicon"
                        >
                          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                          <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z" />
                        </svg>
                      </OverlayTrigger>
                    </Form.Label>
                    <Select
                      options={categoriesOptions}
                      isMulti
                      name="categories"
                      className="categories"
                      classNamePrefix="select"
                      onChange={onSelectedOptionsChange}
                      styles={customStyles}
                      defaultValue={defaultValueCategories}
                    />
                  </Form.Group>
                </Row>
                <div className="d-flex justify-content-between pt-2">
                  <Button
                    type="reset"
                    value="Reset"
                    className="btn resetbutton bg-light"
                    onClick={handlereset}
                  >
                    Reset
                  </Button>

                  <Button
                    variant="primary"
                    type="submit"
                    className="btn submitbutton"
                  >
                    Submit
                  </Button>
                </div>
              </Form>
            </div>
          </div>
          <Helmet>
            <meta charSet="utf-8" />
            <title>Create A Project|CoCreateLab</title>
            <link rel="canonical" href="/createproject" />
          </Helmet>
        </>
      )}
    </>
  );
}
