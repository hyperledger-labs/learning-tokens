import React, { createContext, useContext, useState, ReactNode } from 'react';

interface EventContextType {
  eventData: any;
  setEventData: React.Dispatch<React.SetStateAction<any>>;
}

const EventContext = createContext<EventContextType | null>(null);

interface EventProviderProps {
  children: ReactNode;
}

// EventProvider component
export const EventProvider: React.FC<EventProviderProps> = ({ children }) => {
  const [eventData, setEventData] = useState<any>(null);

  return (
    <EventContext.Provider value={{ eventData, setEventData }}>
      {children}
    </EventContext.Provider>
  );
};

// Custom hook for easy context consumption
export const useEventContext = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEventContext must be used within an EventProvider');
  }
  return context;
};