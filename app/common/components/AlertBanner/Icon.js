import React, { Componenet } from "react";
import './styles.scss';

export default (showFullContent, handleClick) => { 
  return showFullContent ? <h1 className="icon cross" onClick={handleClick}>X</h1> : <h1 className="icon exclamation">!</h1>;
} 
  