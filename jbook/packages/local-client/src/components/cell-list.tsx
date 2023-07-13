import "./cell-list.css";
import { Fragment, useEffect } from "react";
import { useTypedSelector } from "../hooks/use-typed-selector";
import CellListItem from "./cell-list-item";
import AddCell from "./add-cell";
import { useActions } from "../hooks/use-actions";

const CellList: React.FC = () => {
  // destructure cells first then destructure order and data from cells
  const cells = useTypedSelector(({ cells: { order, data } }) => {
    return order.map((id) => data[id]);
  });

  const { fetchCells, saveCells } = useActions();

  useEffect(() => {
    fetchCells();
  }, []);

  const renderedCells = cells.map((cell) => (
    <Fragment key={cell.id}>
      <CellListItem key={cell.id} cell={cell} />
      <AddCell previousCellId={cell.id} />
    </Fragment>
  ));

  return (
    <div className="cell-list">
      <div className={cells.length === 0 ? "force-visible" : ""}>
        <AddCell forceVisible={cells.length === 0} previousCellId={null} />
        {renderedCells}
      </div>
    </div>
  );
};

export default CellList;
