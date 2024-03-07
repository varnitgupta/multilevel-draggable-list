import React from "react";
const ShadowItem = (props) => {
  const { dropPosition } = props;
  let className = "shadow-container";
  if (dropPosition === "addChild") {
    className += " child-shadow";
  }
  if (dropPosition == "addBefore") {
    className += " m-b-5";
  } else if (dropPosition == "addAfter" || dropPosition == "addChild") {
    className += " m-t-5";
  }

  return <div className={className}></div>;
};

export default ShadowItem;
