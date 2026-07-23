import React from 'react';

export const OutletContext = React.createContext<{ element: React.ReactNode }>({ element: null });

export const Outlet: React.FC = () => {
  const { element } = React.useContext(OutletContext);
  return <>{element}</>;
};
