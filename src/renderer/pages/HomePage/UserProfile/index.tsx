import {
  Divider,
  Flex,
  Space,
  Avatar,
  Popconfirm,
  Typography,
  Popover,
  Modal,
  Button,
  Descriptions,
  Tooltip,
  DescriptionsProps,
  message,
} from 'antd';
import { ReactElement, useEffect, useState } from 'react';
import { MemberProfile } from '../../../../services/getMemberProfile';
import { PatInfo } from '../../../../services/getPatInfo';
import { errorPrompt } from '../../../utils';
import { useLocalStorage } from '@uidotdev/usehooks';
import { QuestionCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Link, Text } = Typography;

export default function UserProfile(): ReactElement {
  const [statePat, setStatePat] = useLocalStorage<string>('pat');
  const [stateMemberProfile, setStateMemberProfile] =
    useState<MemberProfile>();
  const [statePatInfo, setStatePatInfo] = useState<PatInfo>();
  const [stateIsPatModalOpen, setStateIsPatModalOpen] = useState(false);
  const [stateIsProfilePopoverOpen, setStateIsProfilePopoverOpen] =
    useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const { avatar_large, username } = stateMemberProfile ?? {};
  const secretPat = statePat?.replace(/(?<=-)[0-9a-z]{4}(?=-)/g, '****');
  const patInfoItems = (() => {
    const { scope, created, good_for_days, total_used, last_used } =
      statePatInfo ?? {};
    return [
      {
        label: 'token',
        children: <Text code>{secretPat}</Text>,
      },
      {
        label: (
          <Space size={4}>
            scope
            <Tooltip title="scope 有 2 种取值：everything 或 regular，regular 不能用于创建新的 token">
              <QuestionCircleOutlined />
            </Tooltip>
          </Space>
        ),
        children: scope,
      },
      {
        label: '创建时间',
        children: dayjs.unix(created).format('YYYY-MM-DD HH:mm:ss Z'),
      },
      {
        label: '剩余天数',
        children: good_for_days,
      },
      {
        label: '总调用次数',
        children: total_used,
      },
      {
        label: '最后一次调用时间',
        children: dayjs.unix(last_used).fromNow(),
      },
    ] as DescriptionsProps['items'];
  })();

  const fetchMemberProfile = async () => {
    try {
      const result = await window.services.getMemberProfile();
      setStateMemberProfile(result);
    } catch (error) {
      errorPrompt(error);
    }
  };

  const fetchPatInfo = async () => {
    try {
      const result = await window.services.getPatInfo();
      setStatePatInfo(result);
    } catch (error) {
      errorPrompt(error);
    }
  };

  const handleLogout = () => {
    setStatePat('');
    window.api.updatePat('');
    messageApi.success('退出登录成功');
  };

  useEffect(() => {
    fetchMemberProfile();
    fetchPatInfo();
  }, [statePat]);

  return (
    <>
      <Popover
        placement="bottomRight"
        open={stateIsProfilePopoverOpen}
        onOpenChange={setStateIsProfilePopoverOpen}
        title="个人信息"
        content={
          <div style={{ width: 350 }}>
            <Divider style={{ margin: '8px 0' }} />
            <Flex justify="space-between" align="center">
              <Space size="middle">
                <Avatar shape="square" size="large" src={avatar_large} />
                {username}
              </Space>
              <Popconfirm
                title="退出登录"
                description="您确定要退出登录吗？"
                onConfirm={handleLogout}
              >
                <Link>退出登录</Link>
              </Popconfirm>
            </Flex>
            <Divider style={{ margin: '8px 0' }} />
            <Flex justify="space-between" align="center">
              <span>
                PAT：
                <Text code>{secretPat}</Text>
              </span>
              <Link
                onClick={() => {
                  setStateIsPatModalOpen(true);
                  setStateIsProfilePopoverOpen(false);
                }}
              >
                管理
              </Link>
            </Flex>
          </div>
        }
      >
        <Avatar
          shape="square"
          size="large"
          src={avatar_large}
          style={{ cursor: 'pointer' }}
        />
      </Popover>
      <Modal
        open={stateIsPatModalOpen}
        footer={
          <Button onClick={() => setStateIsPatModalOpen(false)}>
            关闭
          </Button>
        }
        onCancel={() => setStateIsPatModalOpen(false)}
        title="Personal Access Token"
        width={600}
      >
        <Descriptions
          items={patInfoItems}
          column={1}
          style={{ marginTop: 24 }}
        />
      </Modal>
      {contextHolder}
    </>
  );
}
