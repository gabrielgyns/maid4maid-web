import { RouterProvider } from 'react-router-dom';

import { Toaster } from '@/components/ui/toaster';
import { router } from '@/routes';

import { ThemeProvider } from './contexts/ThemeContext';
import { QueryProvider } from './providers/query-provider';

function App() {
  return (
    <QueryProvider>
      <ThemeProvider defaultTheme="system" storageKey="@CRMaidEasy:theme">
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </QueryProvider>
  );
}

export default App;
