import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

import CanvasLoader from "../Loader";

const Earth = () => {
  const earth = useGLTF("./planet/scene.gltf");

  return (
    <primitive object={earth.scene} scale={3.2} position-y={-0.5} rotation-y={0} />
  );
};

const EarthCanvas = () => {
  return (
    <Canvas
      shadows={false}
      frameloop='always'
      dpr={[1, 1.5]}
      gl={{
        preserveDrawingBuffer: false,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
      }}
      camera={{
        fov: 50,
        near: 0.1,
        far: 200,
        position: [0, 0, 5],
      }}
      performance={{ min: 0.5 }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          autoRotate
          autoRotateSpeed={0.5} // Slower rotation for better performance
          enableZoom={false}
          enablePan={false}
          enableDamping={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Earth />

        <Preload all />
      </Suspense>
    </Canvas>
  );
};

export default EarthCanvas;
