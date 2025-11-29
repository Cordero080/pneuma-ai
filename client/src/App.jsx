// This is the main component
// Right now it just shows a placeholder text
// Next: turn this into a chat UI step by step
import "./App.css"; // import the CSS file
import ChatBox from "./components/ChatBox";
import Title3D from "./components/Title3D";

function App() {
  return (
    <div className="app-container">
      <Title3D />
      <ChatBox />
    </div>
  );
}

export default App;