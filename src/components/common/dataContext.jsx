import React, { createContext, useContext, useState } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [itemsValue, setItemsValue] = useState(10);

  const updateItemsValue = (newValue) => {
    setItemsValue(newValue);
  };

  const [pokeTags, setPokeTags] = useState([]);

  const updatePokeTags = (newValue) => {
    const updatedPokeTags = pokeTags.includes(newValue[newValue.length - 1])
      ? pokeTags.filter((_, index) => index !== pokeTags.indexOf(newValue[newValue.length - 1]))
      : [...pokeTags, newValue[newValue.length - 1]];
  
    setPokeTags(updatedPokeTags);
    setItemsValue((currentItems) => {
      return currentItems;
    });
  };

  const [searchContent, setSearchContent] = useState();

  const updateSearchContent = (newValue) => {
    setSearchContent(newValue);
  }

  return (
    <DataContext.Provider value={{ itemsValue, pokeTags, searchContent, updateSearchContent, updatePokeTags,  updateItemsValue }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};