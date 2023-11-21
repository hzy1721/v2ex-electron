import { createRoot } from 'react-dom/client';
import App from './App';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

const localPat = localStorage.getItem('pat')?.slice(1, -1);
window.api.updatePat(localPat);

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<App />);
