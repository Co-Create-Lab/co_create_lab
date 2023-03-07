import ReactPaginate from "react-paginate";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Pagination({
  totalCount,
  setProjects,
  projects,
  setLoadingSpinner,
}) {
  const navigate = useNavigate();

  const [offset, setOffset] = useState("");
  const itemsPerPage = 5;

  // offset on first click = 2nd page

  const pageCount = Math.ceil(totalCount / itemsPerPage);
  // to calculate the needed number of pages
  // pageCount will be set as an attribute in the return

  const endOffset = offset + itemsPerPage;
  //   console.log(`Loading items from ${offset} to ${endOffset}`);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % totalCount;
    // console.log(
    //   `User requested page number ${event.selected}, which is offset ${ (event.selected * itemsPerPage) % totalCount}`
    // );
    setOffset(newOffset);
    axios
      .get(`/api/projects/paginate?offset=${newOffset}&limit=5`)
      .then((response) => {
        setProjects(response.data.project);
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
      <ReactPaginate
        // marginPagesDisplayed={2} // how many pages after breakLabel
        // pageRangeDisplayed={5} // how many pages between breakLabel
        containerClassName={"pagination pagination-sm justify-content-center"} // className for Container STYLING FROM BOOTSTRAP
        pageClassName={"page-item"} // className for item
        pageLinkClassName={"page-link"} // className for link
        previousClassName={"page-item"} // className for previous button
        previousLinkClassName={"page-link"} // className for previous link
        nextClassName={"page-item"} // className for next button
        nextLinkClassName={"page-link"} // className for next link
        breakClassName={"page-item"} // className for break button
        breakLinkClassName={"page-link"} // className for break link
        activeClassName={"active"} // className for active page
        //renderOnZeroPageCount={null}
        // hrefAllControls={true}
        // forcePage={3}
        breakLabel="..."
        nextLabel=">>"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="<<"
        renderOnZeroPageCount={null}
      />
    </>
  );
}
