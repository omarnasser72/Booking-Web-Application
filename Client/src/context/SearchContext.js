import { createContext, useReducer } from "react";

const INTIAL_STATE = {
  city: undefined,
  date: [
    {
      startDate: undefined,
      endDate: undefined,
    },
  ],
  options: {
    adult: undefined,
    children: undefined,
  },
};

export const SearchContext = createContext(INTIAL_STATE);

const SearchReducer = (state, action) => {
  switch (action.type) {
    case "NEW_SEARCH":
      return action.payload;
    case "RESET_SEARCH":
      return INTIAL_STATE;
    default:
      return state;
  }
};

export const SearchContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(SearchReducer, INTIAL_STATE);
  console.log(state);
  return (
    <SearchContext.Provider
      value={{
        city: state.city,
        date: state.date,
        options: state.options,
        dispatch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
