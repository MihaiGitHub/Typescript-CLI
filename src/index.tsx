import * as esbuild from "esbuild-wasm";
import { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";

const App = () => {
  // assign a type to this ref
  const ref = useRef<any>();
  const iframe = useRef<any>();
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");

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

    try {
      // execute javascript that is inside of a string
      eval(result.outputFiles[0].text);
    } catch (err) {
      alert(err);
    }

    iframe.current.postMessage(result.outputFiles[0].text, "*");
  };

  // the html that goes inside the iframe which contains the root div which can be targeted
  const html = `
  <html>
    <head></head>
    <body>
      <div id="root"></div>
      <script>
        window.addEventListener('message', (event) => {
          try {
            eval(event.data);
          } catch (err) {
            const root = document.querySelector('#root');
            root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>';
            throw err;
          }
        }, false);
      </script>
    </body>
  </html>`;

  return (
    <div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <pre>{code}</pre>
      {/* sandbox property allows or disallows direct access between iframe and parent */}
      {/* sandbox="allow-scripts" allows iframe to execute script tags */}
      <iframe sandbox="allow-same-origin" src="/iframe.html" />

      {/* load up content into this iframe using a local string */}
      <iframe ref={iframe} sandbox="allow-scripts" srcDoc={html} />
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));
