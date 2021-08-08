import "dotenv/config"
import "./db"; //우리의 node.js파일하고 mongodb를 이어줌.
//import "./models/Video";
//import "./models/User";
import app from "./server.js";
const PORT = 4000;

const handleListening = () => console.log(`✅ Server listening on port http://localhost:${PORT}!`);
app.listen(PORT,handleListening);