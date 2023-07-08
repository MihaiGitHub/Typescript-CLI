import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import CodeEditor from "./code-editor";
import Preview from "./preview";
import bundle from "../bundler";
import Resizable from "./resizable";
import { Cell } from "../state";
import { useActions } from "../hooks/use-actions";

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const { updateCell } = useActions();

  useEffect(() => {
    const timer = setTimeout(async () => {
      const output = await bundle(cell.content);
      setCode(output.code);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [cell.content]);

  return (
    <Resizable direction="vertical">
      <div
        style={{
          height: "calc(100%-10px)",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue={cell.content}
            onChange={(value) => updateCell(cell.id, value)}
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
        <Preview err={err} code={code} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
