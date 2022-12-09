import React from 'react';
import ReactLoading from 'react-loading';


function Loader({type, color, message}) {
  return (
    <div className="contentWrap">
      <div style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)"
      }}>

      {/* <h2>{message}</h2> */}
      <img 
        src='/spin1.gif' 
        style={{width: "50%", height: "50%"}}
      />
      {/* <ReactLoading
        type={type}
        color={color}
        height={'80%'}
        width={'80%'} /> */}
      </div>
    </div>
  );
}

export default Loader;
