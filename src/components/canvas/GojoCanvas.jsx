// src/components/canvas/GojoCanvas.jsx

import React, { Suspense, useEffect, useState, memo } from "react";
import { Canvas } from "@react-three/fiber";
import CanvasLoader from "../Loader";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";


const Gojo = memo(({ isMobile }) => {
  const gojo = useGLTF("/gojo/scene.gltf");

  return (
    <primitive
      object={gojo.scene}
      scale={isMobile ? 0.40 : 0.45}
      position-y={-1}
      rotation-y={0}
    />
  );
});

const GojoCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 500px)");
    setIsMobile(mediaQuery.matches);

    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <Canvas
      frameloop="demand"
      shadows
      dpr={[1, 2]}
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [-4, 3, 6],
      }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        {/* Consider customizing OrbitControls as mentioned earlier */}
        <OrbitControls
          autoRotate
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Gojo isMobile={isMobile} />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default GojoCanvas;
