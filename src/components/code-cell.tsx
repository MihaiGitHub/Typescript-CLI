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
    if (!bundle) {
      createBundle(cell.id, cell.content);
      return;
    }

    const timer = setTimeout(async () => {}, 750);

    return () => {
      clearTimeout(timer);
    };
    // eslint turn off dependency check on below line of code
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cell.content, cell.id, createBundle]); // create bundle does not change because of the useMemo hook

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
