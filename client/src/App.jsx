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
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <h1 className="text-4cxl font-bold text-purple-500">
        Tailwind is live 🚀
      </h1>
    </div>
  );
}

export default App;