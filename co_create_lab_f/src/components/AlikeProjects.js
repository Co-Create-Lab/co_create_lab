import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Link, useNavigate } from "react-router-dom";
import { alikePics } from "../const";
import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { BiBarChart } from "react-icons/bi";
import { BsHeartFill } from "react-icons/bs";
import Popover from "react-bootstrap/Popover";
import axiosClient from "../axiosClient";


export default function AlikeProjects() {

  const { projects, setViews } = useContext(AuthContext);

  const nums = new Set();
    while (nums.size !== 6) {
    nums.add(Math.floor(Math.random() * alikePics.length));
  }
  const uniNums = [...nums];

  const shuffled = projects.sort(() => 0.5 - Math.random());
// Get sub-array of first n elements after shuffled 4 = n = limit 
  let projectsLimit = shuffled.slice(0, 4);

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
            value="https://co-create-lab/projects/873463903748435623908"
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

  return (
    <div className="likeprojects dark-blue-background">
      <div className="likeprojects-categories-dark card-container w-100 footershadow dark-blue-background">
        <div className="light-gray-text dark-blue-background">
          <h2 className="light-gray-text dark-blue-background text-center pb-4">
            You also may like
          </h2>

          <Row
            xs={1}
            sm={2}
            md={3}
            lg={4}
            xl={5}
            className="g-4 dark-blue-background m-0 d-flex justify-content-center"
          >
            {projectsLimit.map((element, i) => (
              <Col key={i} className="dark-blue-background">
                <a
                  href={`/projects/${element._id}`}
                  className="text-decoration-none"
                  onClick={() => {
                    try {
                      axiosClient
                        .post(`/projects/view`, {
                          id: element._id,
                        })
                        .then((res) => {
                          setViews(res.data);
                        });
                    } catch (error) {
                      console.error(error);
                    }
                  }}
                >
                  <Card className="home-card-light alikeprojectscard shadow-lg">
                    <Card.Body className="home-card-light ">
                      <Card.Title className="dark-blue-text light-gray-background home-card-title ">
                        {element.project_name}
                      </Card.Title>
                     
                      <div className="light-gray-background">
                        <Card.Img
                          className="home-cardimg"
                          src={alikePics[uniNums[i]]}
                        />
                      </div>
                      
                    </Card.Body>
                  </Card>
                </a>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </div>
  );
}
