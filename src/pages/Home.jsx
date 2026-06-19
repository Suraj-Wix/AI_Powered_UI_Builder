import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Select from "react-select";
import { BsStars } from "react-icons/bs";
import { HiOutlineCode } from "react-icons/hi";
import Editor from "@monaco-editor/react";
import { IoCloseSharp, IoCopy } from "react-icons/io5";
import { PiExportBold } from "react-icons/pi";
import { ImNewTab } from "react-icons/im";
import { FiRefreshCcw } from "react-icons/fi";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

const Home = () => {

  // Framework Options
  const options = [
    { value: "html-css", label: "HTML + CSS" },
    { value: "html-tailwind", label: "HTML + Tailwind CSS" },
    { value: "html-bootstrap", label: "HTML + Bootstrap" },
    { value: "html-css-js", label: "HTML + CSS + JS" },
    { value: "html-tailwind-bootstrap", label: "HTML + Tailwind + Bootstrap" },
  ];

  const [outputScreen, setOutputScreen] = useState(false);
  const [tab, setTab] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [frameWork, setFrameWork] = useState(options[0]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNewTabOpen, setIsNewTabOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Extract code from ``` blocks
  function extractCode(text) {
    const match = text.match(/```(?:html|css|javascript)?\n?([\s\S]*?)```/);
    return match ? match[1].trim() : text;
  }

  // Gemini API Client
  const ai = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

  // Generate code
  async function getResponse() {
    if (!prompt.trim())
      return toast.error("Please describe your component first");

    try {
      setLoading(true);

      const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

      const result = await model.generateContent(`
        You are an expert UI/UX developer.
        Generate a modern responsive UI component based on:

        ${prompt}

        Framework: ${frameWork.label}

        Requirements:
        - Return ONLY a single HTML file.
        - Clean modern design.
        - Add animations & responsiveness.
        - Output only code inside a markdown code block.
      `);

      const text = await result.response.text();
      const finalCode = extractCode(text);

      setCode(finalCode);
      setOutputScreen(true);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while generating code");
    } finally {
      setLoading(false);
    }
  }

  // Copy Code
  const copyCode = async () => {
    if (!code.trim()) return toast.error("No code to copy");
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied");
    } catch {
      toast.error("Failed to copy");
    }
  };

  // Download Code
  const downnloadFile = () => {
    if (!code.trim()) return toast.error("No code to download");

    const blob = new Blob([code], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "GenUI-Code.html";
    link.click();

    URL.revokeObjectURL(url);
    toast.success("File downloaded");
  };

  return (
    <>
      <Navbar />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 lg:px-16">
        
        {/* Left Section */}
        <div className="w-full py-6 rounded-xl bg-[#141319] mt-5 p-5">
          <h3 className="text-[25px] font-semibold sp-text">
            AI Component Generator
          </h3>

          <p className="text-gray-400 mt-2">
            Describe your component and let AI generate it.
          </p>

          {/* Framework */}
          <p className="text-[15px] font-[700] mt-4">Framework</p>
          <Select
            className="mt-2"
            options={options}
            value={frameWork}
            onChange={(selected) => setFrameWork(selected)}
          />

          {/* Prompt */}
          <p className="text-[15px] font-[700] mt-5">Describe your component</p>
          <textarea
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
            className="w-full min-h-[200px] bg-[#09090B] text-white p-3 rounded-xl"
            placeholder="Example: Modern login form with animations..."
          ></textarea>

          <div className="flex items-center justify-between mt-3">
            <p className="text-gray-400 text-sm">Press generate to get code</p>

            <button
              onClick={getResponse}
              className="flex items-center p-3 bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg px-5 gap-2 hover:scale-105 transition-all"
            >
              {loading ? <ClipLoader size={18} color="white" /> : <BsStars />}
              Generate
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="relative mt-2 w-full h-[80vh] bg-[#141319] rounded-xl overflow-hidden">
          {!outputScreen ? (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <div className="p-5 w-[70px] h-[70px] rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center text-[30px]">
                <HiOutlineCode />
              </div>
              <p className="text-gray-400 mt-3">Your component & code will appear here</p>
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div className="bg-[#17171C] w-full h-[50px] flex gap-3 px-3 items-center">
                <button
                  onClick={() => setTab(1)}
                  className={`w-1/2 py-2 rounded-lg ${
                    tab === 1 ? "bg-purple-600" : "bg-zinc-800"
                  } text-white`}
                >
                  Code
                </button>

                <button
                  onClick={() => setTab(2)}
                  className={`w-1/2 py-2 rounded-lg ${
                    tab === 2 ? "bg-purple-600" : "bg-zinc-800"
                  } text-white`}
                >
                  Preview
                </button>
              </div>

              {/* Toolbar */}
              <div className="bg-[#17171C] w-full h-[50px] flex justify-between items-center px-4">
                <p className="font-bold text-gray-200">Code Editor</p>

                <div className="flex gap-2">
                  {tab === 1 ? (
                    <>
                      <button className="w-10 h-10 rounded-xl border flex items-center justify-center" onClick={copyCode}>
                        <IoCopy />
                      </button>
                      <button className="w-10 h-10 rounded-xl border flex items-center justify-center" onClick={downnloadFile}>
                        <PiExportBold />
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="w-10 h-10 rounded-xl border flex items-center justify-center" onClick={() => setIsNewTabOpen(true)}>
                        <ImNewTab />
                      </button>
                      <button className="w-10 h-10 rounded-xl border flex items-center justify-center" onClick={() => setRefreshKey((prev) => prev + 1)}>
                        <FiRefreshCcw />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Code / Preview */}
              <div className="h-full">
                {tab === 1 ? (
                  <Editor value={code} height="100%" theme="vs-dark" language="html" />
                ) : (
                  <iframe key={refreshKey} srcDoc={code} className="w-full h-full bg-white"></iframe>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Fullscreen Preview */}
      {isNewTabOpen && (
        <div className="absolute inset-0 bg-white w-screen h-screen overflow-auto">
          <div className="h-[60px] bg-gray-100 flex items-center justify-between px-5">
            <p className="font-bold text-black">Preview</p>
            <button
              onClick={() => setIsNewTabOpen(false)}
              className="w-10 h-10 rounded-xl border flex items-center justify-center"
            >
              <IoCloseSharp />
            </button>
          </div>

          <iframe srcDoc={code} className="w-full h-[calc(100vh-60px)]"></iframe>
        </div>
      )}
    </>
  );
};

export default Home;
