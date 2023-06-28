import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import CodeEditor from "./code-editor";
import Preview from "./preview";
import bundle from "../bundler";
import Resizable from "./resizable";

const CodeCell = () => {
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");

  useEffect(() => {
    setTimeout(async () => {
      const output = await bundle(input);
      setCode(output);
    }, 1000);
  }, [input]);

  const onClick = async () => {
    const output = await bundle(input);
    setCode(output);

    // try {
    //   // execute javascript that is inside of a string
    //   eval(result.outputFiles[0].text);
    // } catch (err) {
    //   alert(err);
    // }
  };

  return (
    <Resizable direction="vertical">
      <div style={{ height: "100%", display: "flex", flexDirection: "row" }}>
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue="const a = 1;"
            onChange={(value) => setInput(value)}
          />
        </Resizable>

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
    </Resizable>
  );
};

export default CodeCell;
