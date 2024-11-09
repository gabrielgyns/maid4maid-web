import { Outlet } from 'react-router-dom';

import { AuthLayoutFooter } from './AuthLayoutFooter';

export const AuthLayout = () => {
  return (
    <div className="flex min-h-screen flex-col justify-between">
      {/* TODO: Future put the logo... header... something */}
      <h1 className="py-10 text-center text-4xl font-bold">CRMaidEasy</h1>

      <main className="flex flex-1 flex-col bg-background p-4 sm:items-center sm:justify-center">
        <Outlet />
      </main>

      <AuthLayoutFooter />
    </div>
  );
};
