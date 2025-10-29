import React from "react";

type LoaderProps = {
  size?: number; // size in px
  color?: string; // tailwind text color like 'text-primary'
  fullScreen?: boolean; // if true, shows full-screen overlay with blur
};

const Loader: React.FC<LoaderProps> = ({ size = 24, color = "text-light", fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/20 backdrop-blur-lg">
        <div
          className={`animate-spin rounded-full border-4 border-t-transparent ${color}`}
          style={{
            width: 48,
            height: 48,
            borderRightColor: "transparent",
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={`animate-spin rounded-full border-3 border-t-transparent ${color}`}
      style={{
        width: size,
        height: size,
        borderRightColor: "transparent",
      }}
    />
  );
};

export default Loader;
