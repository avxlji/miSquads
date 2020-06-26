import React from 'react';
import img from '../assets/loading.gif';
import '../../styles/Spinner.css';

/* To be implemented in a future update */

const Spinner = () => {
  return (
    <div id="loading-container">
      <img src={img} id="loading-gif"></img>
    </div>
  );
};

export default Spinner;
