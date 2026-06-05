import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SelectionContextType {
  selectedPackage: string;
  setSelectedPackage: (name: string) => void;
}

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selectedPackage, setSelectedPackage] = useState<string>('');

  return (
    <SelectionContext.Provider value={{ selectedPackage, setSelectedPackage }}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection() {
  const context = useContext(SelectionContext);
  if (context === undefined) {
    throw new Error('useSelection must be used within a SelectionProvider');
  }
  return context;
}
