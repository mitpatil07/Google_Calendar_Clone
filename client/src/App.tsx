import React from 'react';
import { CalendarProvider } from '@/contexts/CalendarContext';
import { AppLayout } from '@/components/layout/AppLayout';

const App: React.FC = () => {
  return (
    <CalendarProvider>
      <AppLayout />
    </CalendarProvider>
  );
};

export default App;