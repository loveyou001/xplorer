import { Actions } from "../../Typings/Store/store";
import { ISelectionReducerState } from "../../Typings/Store/selection";

const initialState: ISelectionReducerState = {
    selected: [],
};

const reducer = (state = initialState, action: Actions): ISelectionReducerState => {
    if (action.status !== "SUCCESS") return state;

    switch (action.type) {
        case "UPDATE_SELECTION":
            console.log("UPDATE_SELECTION", action.updates);
            return {
                ...state,
                ...action.updates,
            };
        default:
            return state;
    }
};

export default reducer;
