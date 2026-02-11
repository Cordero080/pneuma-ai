import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Text3D, Center, Float, Environment } from '@react-three/drei';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import './LandingPage.css';

// Material for the large 3D title
const materialProps = {
  color: "#5a5a8e",
  metalness: 0.7,
  roughness: 0.35,
  envMapIntensity: 1.5,
};

// Text geometry properties - larger for landing
const textProps = {
  font: "/fonts/Orbitron_Bold.json",
  size: 2.2,
  height: 2.4,
  bevelEnabled: true,
  bevelThickness: 0.04,
  bevelSize: 0.04,
  bevelSegments: 5,
  curveSegments: 12,
};

function PneumaText() {
  const groupRef = useRef();
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.06;
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.03;
    }
  });

  return (
    <Float
      speed={1.2}
      rotationIntensity={0.15}
      floatIntensity={0.4}
      floatingRange={[-0.08, 0.08]}
    >
      <Center>
        <group ref={groupRef}>
          <Text3D {...textProps} position={[-7.1, 0, 0]}>
            PN
            <meshStandardMaterial {...materialProps} />
          </Text3D>
          
          <group position={[-1.9, 0, 0]} scale={[-1, 1, 1]}>
            <Text3D {...textProps}>
              E
              <meshStandardMaterial {...materialProps} />
            </Text3D>
          </group>
          
          <Text3D {...textProps} position={[-1.4, 0, 0]}>
            UMA
            <meshStandardMaterial {...materialProps} />
          </Text3D>
        </group>
      </Center>
    </Float>
  );
}

// Rotating quotes that cycle
const quotes = [
  "Not an AI model. Not a chatbot. Not a persona.",
  "A cognitive framework that shapes how language models think.",
  "46 minds don't fight. They dance.",
  "The thing between responses isn't a gap — it's a collision.",
  "The uncertainty IS the point, not a bug to fix.",
];

export default function LandingPage({ onEnter }) {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [fadeState, setFadeState] = useState('visible');

  // Cycle through quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setFadeState('fading');
      setTimeout(() => {
        setCurrentQuote((prev) => (prev + 1) % quotes.length);
        setFadeState('visible');
      }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="landing-page">
      {/* Particle/star field background effect */}
      <div className="landing-particles" />
      
      {/* 3D Title - Large and centered */}
      <div className="landing-title-container">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          className="landing-canvas"
          gl={{ alpha: true, antialias: true }}
        >
          <ambientLight intensity={1.3} />
          <directionalLight position={[5, 5, 5]} intensity={2} color="#a855f7" />
          <directionalLight position={[5, 5, 5]} intensity={2} color="#601cf2" />
          <pointLight position={[-3, 2, -2]} intensity={2} color="#09ff00" />
          <pointLight position={[0, 5, 0]} intensity={10} color="#12bceb" />
          <Environment preset="night" />
          <PneumaText />
        </Canvas>
      </div>

      {/* Tagline */}
      <div className="landing-tagline">
        <span className="tagline-main">A Personality Architecture for LLMs</span>
      </div>

      {/* Rotating quote */}
      <div className={`landing-quote ${fadeState}`}>
        <span className="quote-mark">"</span>
        {quotes[currentQuote]}
        <span className="quote-mark">"</span>
      </div>

      {/* Features grid */}
      <div className="landing-features">
        <div className="feature">
          <div className="feature-icon">◈</div>
          <div className="feature-text">46 Archetypes</div>
        </div>
        <div className="feature">
          <div className="feature-icon">◇</div>
          <div className="feature-text">Dialectical Synthesis</div>
        </div>
        <div className="feature">
          <div className="feature-icon">◆</div>
          <div className="feature-text">Inner Monologue</div>
        </div>
        <div className="feature">
          <div className="feature-icon">◉</div>
          <div className="feature-text">Vector Memory</div>
        </div>
      </div>

      {/* Enter button */}
      <button
        className={`landing-enter-btn ${isHovered ? 'hovered' : ''}`}
        onClick={onEnter}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span className="btn-text">Enter</span>
        <span className="btn-glow" />
      </button>

      {/* Subtle bottom text */}
      <div className="landing-footer">
        <span>© 2025-2026 Pablo Cordero</span>
        <span className="separator">·</span>
        <span>Evolving through use</span>
      </div>
    </div>
  );
}
