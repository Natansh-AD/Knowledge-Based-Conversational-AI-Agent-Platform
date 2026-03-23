import { createContext, useContext } from "react";

export const TitleContext = createContext();

export const useTitle = () => useContext(TitleContext);