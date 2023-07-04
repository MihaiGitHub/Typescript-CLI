import { useSelector, TypedUseSelectorHook } from "react-redux";
import { RootState } from "../state";

// whenever need to access state inside a component, useTypedSelector (understand the type of data stored in the store)
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
