import { RouterProvider } from 'react-router-dom';

import { Toaster } from '@/components/ui/toaster';
import { router } from '@/routes';

import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="@CRMaidEasy:theme">
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
