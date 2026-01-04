// ============================================================
// SOUND WAVE VISUALIZER
// Animated wave that plays when Pneuma speaks
// ============================================================

import { useEffect, useRef } from 'react';
import './SoundWave.css';

function SoundWave({ isPlaying, barCount = 5 }) {
  const bars = Array.from({ length: barCount }, (_, i) => i);
  
  return (
    <div className={`sound-wave ${isPlaying ? 'playing' : ''}`}>
      {bars.map((i) => (
        <div 
          key={i} 
          className="sound-bar" 
          style={{ 
            animationDelay: `${i * 0.1}s`,
            // Vary heights for organic feel
            '--base-height': `${30 + (i % 3) * 15}%`
          }} 
        />
      ))}
    </div>
  );
}

export default SoundWave;
