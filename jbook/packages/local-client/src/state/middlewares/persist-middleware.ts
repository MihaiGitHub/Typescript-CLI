import { Dispatch } from "redux";
import { Action } from "../actions";
import { ActionType } from "../action-types";
import { saveCells } from "../action-creators";

// middleware is a function that returns a function that returns a function
export const persistMiddleware = ({
  dispatch,
}: {
  dispatch: Dispatch<Action>;
}) => {
  // take an action and pour it along to the next middleware
  // next is a function, that will be called with something called action of type Action and return void (nothing)
  return (next: (action: Action) => void) => {
    return (action: Action) => {
      next(action);
    };
  };
};
