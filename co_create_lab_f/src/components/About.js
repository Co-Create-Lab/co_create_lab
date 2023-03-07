import { Helmet } from "react-helmet";

export default function About() {
  return (
    <div className="m-3 rounded">
    

      <div className="dark-blue-background light-gray-text p-3 container-fluid shadow-lg">
        <div className="row dark-blue-background light-gray-text">
          <div className="col-lg-8 mb-2 dark-blue-background light-gray-text welcome-text">
          We’re a community of people who want to work together on cool ideas.{" "}
            Our focus is on web and mobile apps, but we also have a lot of fun
            with games and other projects. We are all about making cool things
            with technology – no matter if you are an experienced developer or
            if you are just starting out.
          </div>

          <div className="col-lg-4 dark-blue-background light-gray-text">
            <h2 className="dark-blue-background light-gray-text text-end welcome-heading">
              Who is <br></br> <span className="orange-text dark-blue-background">
                Co Create Lab
              </span>
              ?
            </h2>
          </div>
        </div>
      </div>


      <div className="light-gray-background dark-blue-text p-3 container-fluid shadow-lg">
        <div className="row light-gray-background dark-blue-text">
          <div className="col-lg-4 mb-2">
            <h2 className="text-start welcome-heading-dark ">
              For whom is <br></br>
              <span className="orange-text">Co Create Lab</span> the right place
              to be?
            </h2>
          </div>
          <div className="col-lg-8 mb-2 welcome-text">
            <ul className="home-target-group">
              <li>
                <strong>everyone</strong> with awesome ideas for “a good cause”,
                a business idea, a fun game or whatever
              </li>
              <li>bootcamp students in their final phase</li>
              <li>tech people who want to realize cool projects </li>
              <li>
                tech people who want to gain more experience in tech skills,
                teaching, consulting, mentoring and so on
              </li>
              <li>
                tech people who want to “volunteer” for ideas to: pimp GitHub,
                LinkedIn or just because they love the idea and want to solve
                the given problem
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="dark-blue-background light-gray-text p-3 container-fluid shadow-lg">
        <div className="row dark-blue-background light-gray-text">
          <div className="col-lg-8 mb-2 dark-blue-background light-gray-text welcome-text">
            In our free time we organize workshops and training sessions in
            various technical topics like frontend development, fullstack
            development, UX design, design thinking, etc. In the end of every
            workshop we discuss what worked well during the workshop and where
            new topics could be developed in the future. We love to organize
            events where people from all over the world can meet each other and
            enjoy themselves while they learn something new.
          </div>

          <div className="col-lg-4 dark-blue-background light-gray-text">
            <h2 className="dark-blue-background light-gray-text text-end welcome-heading">
              What else do we do?
            </h2>
          </div>
        </div>
      </div>

      <Helmet>
        <meta charSet="utf-8" />
        <title>About us|CoCreateLab</title>
        <link rel="canonical" href="/about" />
      </Helmet>
    </div>
  );
}
