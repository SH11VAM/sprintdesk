import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { AppProviders } from './providers';

export const App: React.FC = () => {
  return (
    <AppProviders>
      <RouterProvider router={router} future={{ v7_startTransition: true }} />
    </AppProviders>
  );
};

export default App;
