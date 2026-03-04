import { ThemeProvider } from '@mui/material/styles';
import { createRoot } from 'react-dom/client';

import App from './app/App.tsx';
import { aiReviewTheme } from './app/ai-review/theme';

import './styles/index.css';

createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={aiReviewTheme}>
    <App />
  </ThemeProvider>,
);
