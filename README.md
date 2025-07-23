# ABOUT THIS SO FAR

First I was creating a project with Turbo Repo, but right now it does not make any sense, so Im converting to React in FE and Node in BE in different repos.

This project will have more setup like MSW for mocking, Testing with Vitest, PWA (first, later a simple mobile app), Integrations, its own design system, etc.

- Dark/Light/System mode enabled.
- Translations enabled (just need to translate more items)

### Want to test it?

Front and Back are deployed in cloud and we can test it.

- **link**: https://app.maid4maid.com
- **login**: gabriel
- **pass**: 12345678

## Using

- Vite
- React 18+
- Tailwind CSS and shadcn/ui
- Zustand
- React Hook Form
- React i18next
- React Router Dom
- Zod
- Axios
- Husky
- More...

## Vercel

I'm doing the deploy in Vercel.

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react';

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
});
```
