// Import the libraries installed
import express from "express"; // import express
import cors from "cors"; // allows frontend to talk to backend
import dotenv from "dotenv"; // load environment variables

dotenv.config(); // activate .env file BEFORE using anything

const app = express(); // create express application
const PORT = 3000;

app.use(cors()); // enable CORS
app.use(express.json()); // allow JSON request bodies

// TEST ROUTE - shows backend is working
app.get("/", (req, res) => {
  res.send("🐲Pablo's AI backend is running.🐲");
});

// ACCEPTS POST request
// Reads the message the user typed
// Sends response back
app.post("/chat", (req, res) => {
  const { message } = req.body;

  // For now, return a simple fake backend reply
  res.json({
    reply: `Backend received: "${message}`,
  });
});

// START THE SERVER on port 3000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
