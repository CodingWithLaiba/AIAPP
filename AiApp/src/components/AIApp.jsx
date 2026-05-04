import React, { useState, useRef, useEffect } from "react";

function AIApp() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);

  const bottomRef = useRef(null);
  const handlesubmit = async (prompt) => {
    console.log(prompt);
    if (!prompt.trim()) return;

    setHistory((prev) => [
      ...prev,
      { role: "user", content: prompt, id: Date.now() },
    ]);
    setLoading(true);
    setError(null);

    try {
      const token = import.meta.env.VITE_HF_TOKEN;
      console.log(token);
      if (!token)
        throw new Error("Missing API token — add VITE_HF_TOKEN to .env");

      const res = await fetch("/hf/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 512,
        }),
      });

      if (!res.ok) {
        console.log("API ERROR:", res);
        const body = await res.json().catch(() => null);
        throw new Error(
          `API error (${res.status}): ${body?.error || body?.message || res.statusText}`,
        );
      }

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || "No response.";
      console.log("API RESPONSE:", reply);
      setHistory((prev) => [
        ...prev,
        { role: "assistant", content: reply, id: Date.now() + 1 },
      ]);
    } catch (err) {
      setError(err.message);
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
          onClick={() => {
            handlesubmit(input);
            setInput("");
          }}
          className="bg-blue-500 px-3 text-white rounded"
        >
          {loading ? "Loading..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default AIApp;
