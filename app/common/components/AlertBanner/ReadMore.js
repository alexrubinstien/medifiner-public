import React, { Componenet } from "react";
import './styles.scss';

export default (showFullContent, handleClick) => { 
  return showFullContent ? "" : <h1 className="read-more">...<span onClick={handleClick}>read more</span></h1> 
} 
  