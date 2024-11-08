import { RouterProvider } from 'react-router-dom';

import { router } from '@/routes';

import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="@CRMaidEasy:theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
