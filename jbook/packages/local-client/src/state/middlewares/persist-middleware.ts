import { Dispatch } from "redux";
import { Action } from "../actions";
import { ActionType } from "../action-types";
import { saveCells } from "../action-creators";
import { RootState } from "../reducers";

// middleware is a function that returns a function that returns a function
export const persistMiddleware = ({
  dispatch,
  getState,
}: {
  dispatch: Dispatch<Action>;
  getState: () => RootState;
}) => {
  // take an action and pour it along to the next middleware
  // next is a function, that will be called with something called action of type Action and return void (nothing)
  return (next: (action: Action) => void) => {
    return (action: Action) => {
      next(action);

      if (
        [
          ActionType.MOVE_CELL,
          ActionType.UPDATE_CELL,
          ActionType.INSERT_CELL_AFTER,
          ActionType.DELETE_CELL,
        ].includes(action.type)
      ) {
        // call saveCells, receive the function that comes back, and immediately call that function with dispatch and getState
        saveCells()(dispatch, getState);
      }
    };
  };
};
