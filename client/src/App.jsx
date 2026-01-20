import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/test")
      .then(response => setMessage(response.data))
      .catch(error => setMessage("Api call failed"));
  }, []);

  return (
    <div className="App">
      <h1>Muse Api test</h1>
      <h3>{message}</h3>
    </div>
  );
}

export default App;