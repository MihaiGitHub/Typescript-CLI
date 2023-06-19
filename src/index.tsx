import "bulmaswatch/superhero/bulmaswatch.min.css";
import * as esbuild from "esbuild-wasm";
import { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";
import CodeEditor from "./components/code-editor";
import Preview from "./components/preview";

const App = () => {
  // assign a type to this ref
  const ref = useRef<any>();
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");

  const startService = async () => {
    // assign the esbuild service to the ref
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: "https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm",
    });
  };

  useEffect(() => {
    startService();
  }, []);

  const onClick = async () => {
    // if user clicks on submit button before service is ready
    if (!ref.current) {
      return;
    }

    // this will only do some transpiling on input
    const result = await ref.current.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        "process.env.NODE_ENV": '"production"',
        global: "window",
      },
    });

    setCode(result.outputFiles[0].text);

    // try {
    //   // execute javascript that is inside of a string
    //   eval(result.outputFiles[0].text);
    // } catch (err) {
    //   alert(err);
    // }
  };

  return (
    <div>
      <CodeEditor
        initialValue="const a = 1;"
        onChange={(value) => setInput(value)}
      />

      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      {/* sandbox property allows or disallows direct access between iframe and parent */}
      {/* sandbox="allow-scripts" allows iframe to execute script tags */}
      {/* <iframe title="Preview" sandbox="allow-same-origin" src="/iframe.html" /> */}

      {/* load up content into this iframe using a local string */}
      {/* <iframe
        title="Preview"
        ref={iframe}
        sandbox="allow-scripts"
        srcDoc={html}
      /> */}
      <Preview code={code} />
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));
