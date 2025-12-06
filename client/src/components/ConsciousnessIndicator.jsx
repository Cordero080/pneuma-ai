import './ConsciousnessIndicator.css';

const ENGINES = [
  { id: 'memory', color: '#00f0ff' },
  { id: 'archetype', color: '#c084fc' },
  { id: 'reflection', color: '#ff44dd' },
  { id: 'synthesis', color: '#22ffaa' },
];

function ConsciousnessIndicator({ activeEngine = null, isProcessing = false }) {
  return (
    <div className={`consciousness-indicator ${isProcessing ? 'processing' : ''}`}>
      <div className="engines-row">
        {ENGINES.map((engine) => (
          <div
            key={engine.id}
            className={`engine-node ${activeEngine === engine.id ? 'active' : ''}`}
            style={{ '--engine-color': engine.color }}
          />
        ))}
      </div>
      {isProcessing && (
        <div className="processing-bar">
          <div className="processing-fill"></div>
        </div>
      )}
    </div>
  );
}

export default ConsciousnessIndicator;
