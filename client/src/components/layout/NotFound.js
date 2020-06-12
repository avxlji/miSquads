//general imports
import React, { Fragment } from 'react';
import notFound from '../assets/undrawNotFound.svg';
import Footer from './Footer';
import '../../styles/NotFound.css';

/* 404 Error Page */

export const NotFound = () => {
  return (
    <>
      <div id="not-found-container">
        <div id="not-found-content-container">
          <h3>Page Not Found</h3>
          <img src={notFound}></img>
          <p>Sorry, we couldn't find what you were looking for</p>
        </div>
      </div>
    </>
  );
};
