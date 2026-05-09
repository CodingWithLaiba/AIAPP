
# 🤖 AI Chat App

A modern AI-powered chat application built with React, Vite, and Tailwind CSS using the Hugging Face Inference API.

---

## 🚀 Features

- ⚛️ React functional components + hooks
- 🎨 Modern responsive UI with Tailwind CSS
- 🤖 AI chat integration using Hugging Face
- 💬 Real-time conversation history
- ⌨️ Send messages with Enter key
- 🔄 Auto scroll to latest message
- ⚡ Fast development with Vite
- 🌙 Clean dark mode interface
- 📱 Responsive layout

---

## 🛠️ Tech Stack

- React
- Vite
- Tailwind CSS
- Hugging Face Inference API
- JavaScript (ES6+)

---

## 📂 Project Structure

```bash
src/
│
├── components/
│   └── AIApp.jsx
│
├── App.jsx
├── main.jsx
│
public/
│
vite.config.js
package.json
```

---

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/CodingWithLaiba/AIAPP.git
```

Navigate into the project:

```bash
cd AIAPP
```

Install dependencies:

```bash
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_HF_TOKEN=your_huggingface_token
```

> ⚠️ Never expose production API keys publicly.

---

## ▶️ Run Development Server

```bash
npm run dev
```

App will run on:

```bash
http://localhost:5173
```

---

## 🌐 Hugging Face Setup

This project uses the Hugging Face Router API.

Example endpoint:

```js
/hf/v1/chat/completions
```

Configured using Vite proxy.

---

## ⚡ Vite Proxy Configuration

```js
server: {
  proxy: {
    "/hf": {
      target: "https://router.huggingface.co",
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/hf/, ""),
    },
  },
}
```

---

## 💬 Example Request

```js
const res = await fetch("/hf/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
    messages: [
      {
        role: "user",
        content: "Hello AI!",
      },
    ],
  }),
});
```

---

## 🧠 React Concepts Used

- useState
- useEffect
- useRef
- Controlled inputs
- Conditional rendering
- Dynamic rendering with map()
- Async/await API handling

---

## 🎨 Tailwind Concepts Used

- Flexbox layouts
- Responsive spacing
- Dark UI styling
- Utility-first CSS
- Conditional classes


## 📚 Learning Outcomes

This project helped practice:

- React fundamentals
- API integration
- AI application architecture
- Tailwind CSS styling
- State management
- Async JavaScript
- Deployment workflows

---

## 👩‍💻 Author

Made by Laiba

---

## 📄 License

This project is open source and available under the MIT License.