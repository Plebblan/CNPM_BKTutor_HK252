import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { routes } from './routes';
import { Suspense, lazy } from 'react';
import './App.css';
import './index.css';
const theme = createTheme({
  palette: {
    primary: { main: '#0099ff' },
    secondary: { main: '#764ba2' },
  },
  typography: { fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {routes.map(({ path, importFn }) => {
              const Element = lazy(importFn); // pass the import function directly
              return <Route key={path} path={path} element={<Element />} />;
            })}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
}

export default App;