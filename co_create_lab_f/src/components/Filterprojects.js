import {
  tech_stack_options,
  categoriesOptions,
  customStylesFilter,
} from "../const";
import { useState, useEffect } from "react";
import axios from "axios";
import Select, { clearValue, clear, InputActionMeta } from "react-select";
import { useNavigate } from "react-router-dom";

export default function Filterprojects({
  setProjects,
  setSearchResult,
  homeCategoryDefault,
  setLoadingSpinner,
  projects,
  setShowPagination,
}) {
  const [keyword, setKeyword] = useState("");
  const [locationHelper, setLocationHelper] = useState("remote");
  const [location, setLocation] = useState("");
  const [startDateHelper, setStartDateHelper] = useState("open");
  const [start_date, setStartDate] = useState("");
  const [tech_stack, setTechStack] = useState("");
  const [categories, setCategory] = useState([]);
  const [autocompleteCities, setAutocompleteCities] = useState([]);
  const [autocompleteErr, setAutocompleteErr] = useState("");
  const [sortCriteriaCreatedAt, setSortCriteriaCreatedAt] = useState("");
  const [sortCriteriaStartDate, setSortCriteriaStartDate] = useState("");
  const [sortCriteriaViews, setSortCriteriaViews] = useState("");
  const [sortCriteriaLikes, setSortCriteriaLikes] = useState("");

  const navigate = useNavigate();

  // SORTING

  const handleOnChangeSortCriteria = async (e) => {
    if (e.target.value === "createdAt: 1") {
      setSortCriteriaCreatedAt(1);
      setSortCriteriaStartDate("");
      setSortCriteriaLikes("");
      setSortCriteriaViews("");
    }
    if (e.target.value === "createdAt: -1") {
      setSortCriteriaCreatedAt(-1);
      setSortCriteriaStartDate("");
      setSortCriteriaLikes("");
      setSortCriteriaViews("");
    }
    if (e.target.value === "start_date: 1") {
      setSortCriteriaStartDate(1);
      setSortCriteriaCreatedAt("");
      setSortCriteriaLikes("");
      setSortCriteriaViews("");
    }
    if (e.target.value === "start_date: -1") {
      setSortCriteriaStartDate(-1);
      setSortCriteriaCreatedAt("");
      setSortCriteriaLikes("");
      setSortCriteriaViews("");
    }
    if (e.target.value === "views: 1") {
      setSortCriteriaViews(1);
      setSortCriteriaCreatedAt("");
      setSortCriteriaStartDate("");
      setSortCriteriaLikes("");
    }
    if (e.target.value === "views: -1") {
      setSortCriteriaViews(-1);
      setSortCriteriaCreatedAt("");
      setSortCriteriaStartDate("");
      setSortCriteriaLikes("");
    }
    // if (e.target.value === "likes: 1") {
    //   setSortCriteriaLikes(1);
    //   setSortCriteriaCreatedAt("");
    //   setSortCriteriaStartDate("");
    //   setSortCriteriaViews("");
    // }
    // if (e.target.value === "likes: -1") {
    //   setSortCriteriaLikes(-1);
    //   setSortCriteriaCreatedAt("");
    //   setSortCriteriaStartDate("");
    //   setSortCriteriaViews("");
    // }
  };

  const sort = (e) => {
    e.preventDefault();
    setLoadingSpinner(true);
    axios
      .get(
        `/api/projects/sort?start_date=${sortCriteriaStartDate}&createdAt=${sortCriteriaCreatedAt}&views=${sortCriteriaViews}&likes=${sortCriteriaLikes}`
      )
      .then((response) => {
        setProjects(response.data);
        setShowPagination(false);
        setLoadingSpinner(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadingSpinner(false);
      });
  };

  const reset = () => {
    navigate("/projects");
    window.location.reload();
  };

  // FILTERING

  const handleOnChangeKeyword = (e) => {
    setKeyword(e.target.value);
  };

  const handleOnChangeKeywordA = (e) => {
    console.log(e.key);
    if (e.key === "Enter") {
      handleFiltering();
    }
  };

  const handleOnChangeLocationHelper = (e) => {
    setLocationHelper(e.target.value);
    setLocation(e.target.value);
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

  const handleCityChange = async (e) => {
    setLocation(e.target.value);
    if (!location) return;

    const res = await fetchPlace(location);
    !autocompleteCities.includes(e.target.value) &&
      res.features &&
      setAutocompleteCities(res.features.map((place) => place.place_name));
    res.error ? setAutocompleteErr(res.error) : setAutocompleteErr("");
  };

  const handleOnChangeStartDate = (e) => {
    setStartDateHelper(e.target.value);
    setStartDate(e.target.value);
    if (start_date.length > 1 && startDateHelper === "specific date") {
      setStartDate("open");
    } else {
    }
  };

  const handleOnChangeSpecificDate = (e) => {
    setStartDate(`${e.target.value}T00:42:15.714Z`);
  };

  const onSelectedOptionsChange = (options) => {
    setCategory([].slice.call(options).map((option) => option.value));
  };

  const handleOnChangeTechStack = (tech_stack_options) => {
    setTechStack(
      [].slice
        .call(tech_stack_options)
        .map((tech_stack_option) => tech_stack_option.value)
    );
  };

  const handleFiltering = (e) => {
    // e.preventDefault();
    setLoadingSpinner(true);
    axios
      .get(
        `/api/projects/search?keyword=${keyword}&location=${location}&start_date=${start_date}&categories=${categories}&tech_stack=${tech_stack}`,
        {
          keyword,
          categories,
          location,
          start_date,
          tech_stack,
        }
      )
      .then((response) => {
        setProjects(response.data);
        setSearchResult(true);
        setShowPagination(false);
        setLoadingSpinner(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadingSpinner(false);
        navigate("/404");
      });
  };

  const filterSort = (e) => {
    axios
      .get(
        `/api/projects/search/sort?keyword=${keyword}&location=${location}&start_dateF=${start_date}&categories=${categories}&tech_stack=${tech_stack}&start_date=${sortCriteriaStartDate}&createdAt=${sortCriteriaCreatedAt}&views=${sortCriteriaViews}&likes=${sortCriteriaLikes}`,
        {
          keyword,
          categories,
          location,
          start_date,
          tech_stack,
          sortCriteriaCreatedAt,
          sortCriteriaStartDate,
          sortCriteriaLikes,
          setSortCriteriaViews,
        }
      )
      .then((response) => {
        setProjects(response.data);
        setShowPagination(false);
        setLoadingSpinner(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadingSpinner(false);
        navigate("/404");
      });
  };

  return (
    <>
      <div className="allprojectsfilter">
        <div className="sort bg-light shadow-sm">
          <div className="bg-light d-sm-flex justify-content-between">
            <h5 className="bg-light fw-bold">SORT</h5>
            <button className="btn bg-light clear_filter_btn" onClick={reset}>
              Clear
            </button>
          </div>
          <form className="sortform bg-light" id="sortform">
            <div className="bg-light d-flex m-2 mb-3">
              <select
                className="form-control bg-light sortcriteria"
                type="select"
                aria-label="sort"
                onChange={handleOnChangeSortCriteria}
                id="sort"
              >
                <option value="createdAt: 1" className="option">
                  creation date {String.fromCharCode(8593)}
                </option>
                <option value="createdAt: -1" className="option">
                  creation date {String.fromCharCode(8595)}
                </option>
                <option value="start_date: 1" className="option">
                  start date {String.fromCharCode(8593)}
                </option>
                <option value="start_date: -1" className="option">
                  start date {String.fromCharCode(8595)}
                </option>
                <option value="views: 1" className="option">
                  views {String.fromCharCode(8593)}
                </option>
                <option value="views: -1" className="option">
                  views {String.fromCharCode(8595)}
                </option>
                {/* <option value="likes: 1" className="option">
                  likes {String.fromCharCode(8593)}
                </option>
                <option value="likes: -1" className="option">
                  likes {String.fromCharCode(8595)}
                </option> */}
              </select>
              <button onClick={sort} className="sortbutton">
                <svg
                  fill="currentColor"
                  className="bi bi-filter sorticon"
                  viewBox="0 0 16 16"
                >
                  <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
                </svg>
              </button>
            </div>
          </form>
        </div>

        <div className="filter bg-light shadow-sm">
          <div className="bg-light d-sm-flex justify-content-between">
            <h5 className="bg-light fw-bold">FILTER</h5>
            <button className=" btn bg-light clear_filter_btn" onClick={reset}>
              Clear
            </button>
          </div>
          <div className="bg-light mt-3">
            <form
              className="filterform bg-light"
              role="search"
              id="searchcriteria"
            >
              Keyword
              <div className="bg-light d-flex m-2 mb-4">
                <input
                  className="form-control bg-light filtercriteria"
                  type="search"
                  placeholder=" Keyword"
                  aria-label="keyword"
                  onChange={handleOnChangeKeyword}
                  onKeyDown={handleOnChangeKeywordA}
                ></input>
              </div>
              Location
              <div className="bg-light m-2 mb-4 ">
                <select
                  className="form-control bg-light filtercriteria"
                  type="select"
                  placeholder=""
                  aria-label="remote"
                  onChange={handleOnChangeLocationHelper}
                >
                  <option value="" className="option">
                    All
                  </option>
                  <option value="remote" className="option">
                    Remote
                  </option>
                  <option value="onsite" className="option">
                    Onsite
                  </option>
                </select>

                {locationHelper === "onsite" && (
                  <div className="d-flex bg-light mt-2">
                    {autocompleteErr && (
                      <span className="inputError">{autocompleteErr}</span>
                    )}
                    <input
                      className="form-control bg-light filtercriteria"
                      list="places"
                      type="text"
                      name="city"
                      onChange={handleCityChange}
                      pattern={autocompleteCities.join("|")}
                      autoComplete="off"
                      placeholder="City"
                      aria-label="location"
                      required
                    ></input>
                    <datalist id="places">
                      {autocompleteCities.map((city, i) => (
                        <option key={i}>{city}</option>
                      ))}
                    </datalist>
                  </div>
                )}
              </div>
              Start Date
              <div className="bg-light m-2 mb-4 ">
                <select
                  className="form-control bg-light filtercriteria"
                  type="open"
                  aria-label="open"
                  onChange={handleOnChangeStartDate}
                >
                  <option value="" className="option">
                    All
                  </option>
                  <option value="open" className="option">
                    Open
                  </option>
                  <option value="specific date" className="option">
                    Specific Date
                  </option>
                </select>
                {startDateHelper === "specific date" && (
                  <div className="d-flex bg-light mt-2">
                    <input
                      className="form-control bg-light filtercriteria"
                      type="date"
                      placeholder="Start Date"
                      aria-label="start_date"
                      onChange={handleOnChangeSpecificDate}
                      required
                    ></input>
                  </div>
                )}
              </div>
              Category
              <Select
                options={categoriesOptions}
                isMulti
                name="categories"
                className="basic-multi-select m-2 mb-4"
                classNamePrefix="filter_select"
                onChange={onSelectedOptionsChange}
                styles={customStylesFilter}
                isClearable
                isSearchable
                clearValue
                defaultValue={[homeCategoryDefault]}
              />
              Tech Stack
              <Select
                options={tech_stack_options}
                isMulti
                name="tech_stack"
                className="basic-multi-select m-2 mb-4"
                classNamePrefix="filter_select"
                onChange={handleOnChangeTechStack}
                styles={customStylesFilter}
                isClearable
                isSearchable
                clearValue
              />
            </form>

            <div className="bg-light d-flex justify-content-between filtercriteria pe-3 ms-3 ">
              <button
                type="button"
                className="btn submitbutton"
                onClick={handleFiltering}
              >
                Filter
              </button>
            </div>

            <div className="bg-light d-flex m-3 mb-4 mt-4 filtersortform">
              <select
                className="form-control bg-light filtercriteria"
                type="select"
                aria-label="sort"
                onChange={handleOnChangeSortCriteria}
              >
                <option value="createdAt: 1" className="option">
                  creation date {String.fromCharCode(8593)}
                </option>
                <option value="createdAt: -1" className="option">
                  creation date {String.fromCharCode(8595)}
                </option>
                <option value="start_date: 1" className="option">
                  start date {String.fromCharCode(8593)}
                </option>
                <option value="start_date: -1" className="option">
                  start date {String.fromCharCode(8595)}
                </option>
                <option value="views: 1" className="option">
                  views {String.fromCharCode(8593)}
                </option>
                <option value="views: -1" className="option">
                  views {String.fromCharCode(8595)}
                </option>
                {/* <option value="likes: 1" className="option">
                  likes {String.fromCharCode(8593)}
                </option>
                <option value="likes: -1" className="option">
                  likes {String.fromCharCode(8595)}
                </option> */}
              </select>
              <button onClick={filterSort} className="sortbutton">
                <svg
                  fill="currentColor"
                  className="bi bi-filter sorticon"
                  viewBox="0 0 16 16"
                >
                  <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
