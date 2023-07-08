import { useEffect } from "react";
import CodeEditor from "./code-editor";
import Preview from "./preview";
import Resizable from "./resizable";
import { Cell } from "../state";
import { useActions } from "../hooks/use-actions";
import { useTypedSelector } from "../hooks/use-typed-selector";

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const { updateCell, createBundle } = useActions();
  const bundle = useTypedSelector((state) => state.bundles[cell.id]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      createBundle(cell.id, cell.content);
    }, 750);

    return () => {
      clearTimeout(timer);
    };
  }, [cell.content, cell.id]);

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
        {bundle && <Preview err={bundle.err} code={bundle.code} />}
      </div>
    </Resizable>
  );
};

export default CodeCell;
