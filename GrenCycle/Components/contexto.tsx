import React, { createContext, useState, useContext, ReactNode } from 'react';
import { LocaisReciclagemModel } from '../Interfaces/LocaisReciclage';

interface MapContextType {
  pontosColeta: LocaisReciclagemModel[];
  setPontosColeta: (pontos: LocaisReciclagemModel[]) => void;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export const MapProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pontosColeta, setPontosColeta] = useState<LocaisReciclagemModel[]>([]);

  return (
    <MapContext.Provider value={{ pontosColeta, setPontosColeta }}>
      {children}
    </MapContext.Provider>
  );
};

export const useMapContext = () => {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error('useMapContext must be used within a MapProvider');
  }
  return context;
};
