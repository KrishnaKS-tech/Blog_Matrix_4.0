import React from "react";

function Hr({ mt, mb }) {
  return (
    <div>
      <div className={`h-px bg-gray-300 mr-4 ml-4 mt-${mt} mb-${mb}  `}></div>
    </div>
  );
}

export default Hr;
