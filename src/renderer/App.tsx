import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import HomePage from './pages/HomePage';
import 'reset-css';
import LoginPage from './pages/LoginPage';
import { useLocalStorage } from '@uidotdev/usehooks';
import zhCN from 'antd/locale/zh_CN';
import { ConfigProvider } from 'antd';

const routerForLogOut = createBrowserRouter([
  {
    path: '*',
    element: <LoginPage />,
  },
]);

const routerForLogIn = createBrowserRouter([
  {
    path: '/main_window',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
]);

export default function App() {
  const [statePAT] = useLocalStorage('pat');

  return (
    <ConfigProvider locale={zhCN}>
      <RouterProvider
        router={statePAT ? routerForLogIn : routerForLogOut}
      ></RouterProvider>
    </ConfigProvider>
  );
}
