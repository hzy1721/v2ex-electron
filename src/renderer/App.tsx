import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import HomePage from './pages/HomePage';
import 'reset-css';
import LoginPage from './pages/LoginPage';
import { useLocalStorage } from '@uidotdev/usehooks';
import zhCN from 'antd/locale/zh_CN';
import { ConfigProvider } from 'antd';

export default function App() {
  const [statePat] = useLocalStorage('pat');

  const router = createBrowserRouter([
    {
      path: '*',
      element: statePat ? <HomePage /> : <LoginPage />,
    },
  ]);

  return (
    <ConfigProvider locale={zhCN}>
      <RouterProvider router={router}></RouterProvider>
    </ConfigProvider>
  );
}
