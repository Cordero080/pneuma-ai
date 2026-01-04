import { Canvas } from '@react-three/fiber';
import { Text3D, Center, Float, Environment } from '@react-three/drei';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import './Title3D.css';

// Shared material properties
const materialProps = {
  color: "#5a5a8e",
  metalness: 0.7,
  roughness: 0.35,
  envMapIntensity: 1.5,
};

// Shared text geometry properties
const textProps = {
  font: "/fonts/Orbitron_Bold.json",
  size: 1.6,
  height: 1.9,
  bevelEnabled: true,
  bevelThickness: 0.03,
  bevelSize: 0.03,
  bevelSegments: 5,
  curveSegments: 12,
};

function PneumaText() {
  const groupRef = useRef();
  
  // Subtle rotation on hover/idle
  useFrame((state) => {
    if (groupRef.current) {
      // Very subtle breathing movement
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.02;
    }
  });

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.1}
      floatIntensity={0.3}
      floatingRange={[-0.05, 0.05]}
    >
      <Center>
        <group ref={groupRef}>
          {/* "PN" */}
          <Text3D {...textProps} position={[-5.2, 0, 0]}>
            PN
            <meshStandardMaterial {...materialProps} />
          </Text3D>
          
          {/* Reversed "E" - flipped on X axis */}
          <group position={[-1.4, 0, 0]} scale={[-1, 1, 1]}>
            <Text3D {...textProps}>
              E
              <meshStandardMaterial {...materialProps} />
            </Text3D>
          </group>
          
          {/* "UMA" */}
          <Text3D {...textProps} position={[-1.0, 0, 0]}>
            UMA
            <meshStandardMaterial {...materialProps} />
          </Text3D>
        </group>
      </Center>
    </Float>
  );
}

export default function Title3D() {
  return (
    <div className="title-container">
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 50 }}
        className="title-canvas"
        gl={{ alpha: true, antialias: true }}
      >
        {/* Ambient base */}
        <ambientLight intensity={1.3} />
        
        {/* Key light - purple tint */}
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={2} 
          color="#a855f7"
        />
        
        {/* Front light - makes it visible */}
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={2} 
          color="#601cf2ff"
        />
        
        {/* Rim light - cyan accent */}
        <pointLight 
          position={[-3, 2, -2]} 
          intensity={2} 
          color="#09ff00ff"
        />
        
        {/* Top light */}
        <pointLight 
          position={[0, 5, 0]} 
          intensity={10} 
          color="#12bcebff"
        />
        
        {/* Environment for reflections */}
        <Environment preset="night" />
        
        <PneumaText />
      </Canvas>
    </div>
  );
}
