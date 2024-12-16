import React, { createContext, useState, useContext } from "react";

const LoaderContext = createContext();

const LoaderProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <LoaderContext.Provider value={{ isLoading, setIsLoading }}>{children}</LoaderContext.Provider>
  );
};

export const useLoader = () => useContext(LoaderContext);

export default LoaderProvider;
