import React, { useState, useRef, useEffect } from "react";

function AIApp() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);

  const bottomRef = useRef(null);

  const handlesubmit = async (prompt) => {
    if (!prompt.trim()) return;

    const userMessage = {
      role: "user",
      content: prompt,
      id: Date.now(),
    };

    setHistory((prev) => [...prev, userMessage]);
    setLoading(true);
    setError("");

    try {
      const token = import.meta.env.VITE_HF_TOKEN;

      if (!token) {
        throw new Error(
          "Missing API token add VITE_HF_TOKEN to .env"
        );
      }

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
        const body = await res.json().catch(() => null);

        throw new Error(
          `API error (${res.status}): ${
            body?.error || body?.message || res.statusText
          }`
        );
      }

      const data = await res.json();

      const reply =
        data.choices?.[0]?.message?.content ||
        "No response.";

      const botMessage = {
        role: "assistant",
        content: reply,
        id: Date.now() + 1,
      };

      setHistory((prev) => [...prev, botMessage]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [history]);

  return (
    <div className="flex justify-center items-center flex-col">
      {/* HEADER */}
      <div className="border-b w-full border-zinc-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          AI Chat
        </h1>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto px-4 py-6 w-3xl">
        <div className="max-w-4xl mx-auto space-y-6">
          {history.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center mt-32">
              <h2 className="text-4xl font-bold mb-3 text-zinc-200">
                Welcome 👋
              </h2>

              <p className="text-zinc-500 text-center max-w-md">
                Ask anything and start chatting with your AI
                assistant.
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-2xl">
              {error}
            </div>
          )}

          {history.map((item) => (
            <div
              key={item.id}
              className={`flex ${
                item.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] px-5 py-4 rounded-3xl shadow-lg whitespace-pre-wrap wrap-break-words ${
                  item.role === "user"
                    ? "bg-blue-600 text-white rounded-br-md"
                    : "bg-zinc-800 text-zinc-100 rounded-bl-md"
                }`}
              >
                {item.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-zinc-800 px-5 py-4 rounded-3xl rounded-bl-md flex gap-2">
                <span className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}

          <div ref={bottomRef}></div>
        </div>
      </div>

      {/* INPUT AREA */}
      <div className="border-t border-zinc-800 p-4 bg-zinc-950 w-3xl">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <input
            type="text"
            placeholder="Message AI..."
            className="flex-1 bg-zinc-900 border border-zinc-700 focus:border-blue-500 outline-none rounded-2xl px-5 py-4 text-white placeholder:text-zinc-500 transition-all"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handlesubmit(input);
                setInput("");
              }
            }}
          />

          <button
            onClick={() => {
              handlesubmit(input);
              setInput("");
            }}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all px-6 py-4 rounded-2xl font-medium shadow-lg"
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AIApp;