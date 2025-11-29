// This is the main component
// Right now it just shows a placeholder text
// Next: turn this into a chat UI step by step
import "./App.css"; // import the CSS file
import ChatBox from "./components/ChatBox";

function App() {
  return (
    <div className="app-container">
      <h1 className="title">0RPH3US</h1>
      <ChatBox />
    </div>
  );
}

export default App;