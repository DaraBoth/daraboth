import { Html, useProgress } from "@react-three/drei";

const CanvasLoader = () => {
  const { progress } = useProgress();
  return (
    <Html
      as='div'
      center
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <span className='canvas-loader'></span>
      <p
        style={{
          fontSize: 14,
          color: "#F1F1F1",
          fontWeight: 800,
          marginTop: 40,
        }}
      >
        {progress.toFixed(2)}%
      </p>
    </Html>
  );
};

// Simple fallback loader for non-canvas contexts
export const SimpleLoader = () => (
  <div className="flex justify-center items-center h-32">
    <div className="glass-loading w-8 h-8 rounded-full"></div>
    <span className="ml-3 text-secondary">Loading...</span>
  </div>
);

// Canvas-specific loader that doesn't use R3F hooks
export const CanvasPlaceholder = () => (
  <div className="flex justify-center items-center w-full h-full min-h-[200px]">
    <div className="glass-loading w-12 h-12 rounded-full"></div>
    <span className="ml-3 text-secondary">Loading 3D content...</span>
  </div>
);

export default CanvasLoader;
