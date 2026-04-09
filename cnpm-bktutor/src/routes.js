// src/routes.js
const pageModules = import.meta.glob('./pages/*.jsx');

export const routes = Object.keys(pageModules).map((path) => {
  const name = path.match(/\.\/pages\/(.*)\.jsx$/)[1];
  const routePath = name === 'HomePage' ? '/' : `/${name.replace('Page', '').toLowerCase()}`;

  return {
    path: routePath,
    importFn: pageModules[path], // **keep as a function**
  };
});