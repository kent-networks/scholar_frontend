import React from "react";
import PropTypes from "prop-types";

// Slanted shimmer animation using CSS
const Skeleton = ({
  height = 20,
  width = "100%",
  baseColor = "#e4e6eb",
  highlightColor = "#560fd125",
  className = "",
  style = {},
  ...props
}) => {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        height,
        width,
        borderRadius: 8,
        backgroundColor: baseColor,
        ...style,
      }}
      {...props}
    >
      <div
        className="absolute inset-0 w-full h-full pointer-events-none skeleton-shimmer"
        style={{
          background: `linear-gradient(120deg, ${baseColor} 20%, ${highlightColor} 50%, ${baseColor} 80%)`,
          // backgroundSize: "200% 100%",
          backgroundRepeat: "no-repeat",
        }}
      />
    </div>
  );
};

Skeleton.propTypes = {
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  baseColor: PropTypes.string,
  highlightColor: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default Skeleton;
