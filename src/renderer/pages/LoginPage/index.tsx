import { useLocalStorage } from '@uidotdev/usehooks';
import {
  Button,
  Card,
  Flex,
  Form,
  Input,
  Space,
  Tooltip,
  message,
} from 'antd';
import { ReactElement, useState } from 'react';
import { errorPrompt } from '../../utils';
import { QuestionCircleOutlined } from '@ant-design/icons';

export default function LoginPage(): ReactElement {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [statePat, setStatePat] = useLocalStorage<string>('pat');
  const [stateLoginLoading, setStateLoginLoading] = useState(false);

  const handleSubmitLogin = async ({ pat }: { pat: string }) => {
    setStateLoginLoading(true);
    try {
      await window.services.testPat({ pat });
      window.api.updatePat(pat);
      setStatePat(pat);
      message.success('登录成功');
    } catch (error) {
      errorPrompt(error);
    }
    setStateLoginLoading(false);
  };

  return (
    <Flex justify="center" align="center" style={{ height: '100vh' }}>
      <Card
        title="Personal Access Token 登录"
        extra={
          <a
            href="https://v2ex.com/help/personal-access-token"
            target="_blank"
          >
            什么是 PAT
          </a>
        }
        style={{ width: 400 }}
      >
        <Form layout="vertical" onFinish={handleSubmitLogin}>
          <Form.Item
            name="pat"
            label="Personal Access Token"
            rules={[
              { required: true, message: '请输入 PAT' },
              {
                pattern:
                  /^[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}$/,
                message: 'PAT 格式错误',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={stateLoginLoading}
              >
                登录
              </Button>
              <Tooltip
                title="长时间无响应请尝试开启全局代理"
                placement="right"
              >
                <QuestionCircleOutlined />
              </Tooltip>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </Flex>
  );
}
