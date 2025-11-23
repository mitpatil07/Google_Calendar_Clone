import React from 'react';
import { NavigationBar, WeekView, EventModal } from '@/components/Calendar';

export const AppLayout: React.FC = () => {
  return (
    <div className="h-screen flex flex-col bg-white">

      <NavigationBar />

      <WeekView />

      <EventModal />
    </div>
  );
};