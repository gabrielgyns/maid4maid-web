import { RouterProvider } from 'react-router-dom';

import { Toaster } from '@/components/ui/toaster';
import { router } from '@/routes';

import { ThemeProvider } from './contexts/theme-context';
import { QueryProvider } from './providers/query-provider';

function App() {
  return (
    <QueryProvider>
      <ThemeProvider defaultTheme="system" storageKey="@Maid4Maid:theme">
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </QueryProvider>
  );
}

export default App;
