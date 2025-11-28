// This is the main component
// Right now it just shows a placeholder text
// Next: turn this into a chat UI step by step
import "./App.css"; // import the CSS file
import ChatBox from "./components/ChatBox";

function App() {
  return (
    <div className="app-container">
       <ChatBox />
    <h1 className="title">Hello Pablo — Your AI App Started Successfully</h1>
    <p className="subtitle">Next step: we will build the chat UI.</p>
    </div>
  );
}

export default App;