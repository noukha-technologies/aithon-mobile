import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BottomTabContextType {
  isTabBarVisible: boolean;
  setIsTabBarVisible: (visible: boolean) => void;
}

const BottomTabContext = createContext<BottomTabContextType | undefined>(undefined);

export const BottomTabProvider = ({ children }: { children: ReactNode }) => {
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);

  return (
    <BottomTabContext.Provider value={{ isTabBarVisible, setIsTabBarVisible }}>
      {children}
    </BottomTabContext.Provider>
  );
};

export const useBottomTab = () => {
  const context = useContext(BottomTabContext);
  if (context === undefined) {
    throw new Error('useBottomTab must be used within a BottomTabProvider');
  }
  return context;
};
