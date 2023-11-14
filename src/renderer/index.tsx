import { createRoot } from 'react-dom/client';
import App from './App';
import { AUTH_SERVICE } from '../services/auth';

AUTH_SERVICE.pat = localStorage.getItem('pat');

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<App />);
