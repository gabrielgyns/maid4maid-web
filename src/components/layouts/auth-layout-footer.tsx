export const AuthLayoutFooter = () => {
  return (
    <footer className="bottom-0 min-h-10 bg-primary dark:bg-slate-800">
      <div className="flex h-full items-center justify-center">
        <span className="py-6 text-sm text-muted dark:text-muted-foreground">
          MuveTech © 2024-{new Date().getFullYear()} Maid4Maid | All Rights
          Reserved
        </span>
      </div>
    </footer>
  );
};
