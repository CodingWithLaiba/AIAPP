import React, { useState, useRef, useEffect } from "react";

function AIApp() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);

  const bottomRef = useRef(null);
  const handlesubmit = async () => {
    if (!input) {
      setError("Please enter something");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch("http://localhost:5000/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: input,
        }),
      });

      const data = await res.json();

      const responseText =
        data[0]?.generated_text || data.generated_text || "No response";
      // const responseText = rawText.replace(input, "").trim();
      // update history AFTER response
      setHistory((prev) => [
        ...prev,
        { prompt: input, response: responseText },
      ]);

      setInput("");
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  return (
    <div className="h-screen flex flex-col p-4">
      {/* CHAT */}
      <div className="flex-1 overflow-y-auto space-y-4 p-3 rounded mb-2">
        {error && <p className="text-red-500">{error}</p>}
        {history.length === 0 && (
          <p className="text-gray-400 text-center mt-10">
            Start conversation...
          </p>
        )}
        {history.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-end">
              <div className="bg-blue-500 text-white max-w-xs p-3 rounded-lg">
                {item.prompt}
              </div>
            </div>

            <div className="flex justify-start">
              <div className="bg-gray-200 text-black max-w-xs p-3 rounded-lg">
                {item.response}
              </div>
            </div>
          </div>
        ))}

        {/* AUTO SCROLL TARGET */}
        <div ref={bottomRef}></div>
      </div>

      {/* INPUT */}
      <div className="flex gap-2 pt-3">
        <input
          className="border p-2 rounded w-full"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handlesubmit();
          }}
        />
        <button
          onClick={handlesubmit}
          className="bg-blue-500 px-3 text-white rounded"
        >
          {loading ? "Loading..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default AIApp;
