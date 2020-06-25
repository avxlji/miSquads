import React from 'react';
import Pagination from '@material-ui/lab/Pagination';

//import css
import '../../styles/Paginate.css';

const Paginate = ({ postsPerPage, totalPosts, paginate }) => {
  const pageNumbers = [];

  // sets each page
  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav id="pagination-container">
      {pageNumbers.length > 1 && (
        <Pagination
          count={pageNumbers.length}
          onChange={paginate}
          id="pagination"
        />
      )}
      {/* <ul className="pagination">
        {pageNumbers.map((number) => (
          <li key={number} className="page-item">
            <a onClick={() => paginate(number)} className="page-link">
              {number}
            </a>
          </li>
        ))}
      </ul> */}
    </nav>
  );
};

export default Paginate;
