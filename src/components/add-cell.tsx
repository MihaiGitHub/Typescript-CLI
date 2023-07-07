import "./add-cell.css";
import { useActions } from "../hooks/use-actions";

interface AddCellProps {
  nextCellid: string;
}

const AddCell: React.FC<AddCellProps> = ({ nextCellid }) => {
  const { insertCellBefore } = useActions();
  return (
    <div>
      <button onClick={() => insertCellBefore(nextCellid, "code")}>Code</button>
      <button onClick={() => insertCellBefore(nextCellid, "text")}>Code</button>
    </div>
  );
};
