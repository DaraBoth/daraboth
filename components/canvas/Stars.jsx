import { useState, useRef, Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";

const Stars = (props) => {
  const ref = useRef();

  // Reduced from 5001 to 2000 particles for better performance
  // Use useMemo to prevent regeneration on re-renders
  const [sphere] = useState(() => {
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 1000 : 2000; // Even fewer on mobile
    return random.inSphere(new Float32Array(particleCount * 3), { radius: 1.2 });
  });

  useFrame((state, delta) => {
    if (ref.current) {
      // Slower rotation for better performance and smoother animation
      ref.current.rotation.x -= delta / 15;
      ref.current.rotation.y -= delta / 20;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="#f272c8"
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

const StarsCanvas = () => {
  return (
    <div className="w-full h-auto absolute inset-0 z-[-1]">
      <Canvas
        camera={{ position: [0, 0, 1] }}
        dpr={[1, 1.5]} // Limit device pixel ratio for better performance
        performance={{ min: 0.5 }} // Allow frame rate to drop for performance
        frameloop="demand" // Only render when needed
        gl={{
          preserveDrawingBuffer: false, // Better performance
          antialias: false, // Disable antialiasing for better performance
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        <Suspense fallback={null}>
          <Stars />
        </Suspense>
        <Preload all />
      </Canvas>
    </div>
  );
};

export default StarsCanvas;
