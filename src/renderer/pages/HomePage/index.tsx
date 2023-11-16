import {
  Typography,
  Radio,
  List,
  Tag,
  Flex,
  Button,
  Modal,
  Pagination,
  Avatar,
  Popover,
  Space,
  Divider,
  Skeleton,
  Popconfirm,
  Descriptions,
  DescriptionsProps,
  Tooltip,
} from 'antd';
import { ReactElement, useEffect, useRef, useState } from 'react';
import { TopicItem } from '../../../services/getNodeTopics';
import { errorPrompt } from '../../utils';
import dayjs from 'dayjs';
import TopicDetail from './TopicDetail';
import { NodeInfo } from '../../../services/getNodeInfo';
import { MemberProfile } from '../../../services/getMemberProfile';
import { useLocalStorage } from '@uidotdev/usehooks';
import { BellOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { NotificationItem } from '../../../services/getNotifications';
import InfiniteScroll from 'react-infinite-scroll-component';
import { PatInfo } from '../../../services/getPatInfo';

import './index.less';

const { Title, Link, Text } = Typography;

const nodes = [
  { value: 'tech', label: '技术' },
  { value: 'create', label: '分享创造' },
  { value: 'play', label: '好玩' },
  { value: 'jobs', label: '酷工作' },
  { value: 'beijing', label: '北京' },
];

export default function HomePage(): ReactElement {
  const [statePat, setStatePat] = useLocalStorage<string>('pat');
  const [stateMemberProfile, setStateMemberProfile] =
    useState<MemberProfile>();
  const [stateNotifications, setStateNotifications] = useState<
    NotificationItem[]
  >([]);
  const [stateNode, setStateNode] = useState(nodes[0].value);
  const [stateNodeInfo, setStateNodeInfo] = useState<NodeInfo>();
  const [statePage, setStatePage] = useState(1);
  const [stateLoading, setStateLoading] = useState(false);
  const [stateTopics, setStateTopics] = useState<TopicItem[]>([]);
  const [stateActiveTopic, setStateActiveTopic] = useState<TopicItem>();
  const [stateIsPatModalOpen, setStateIsPatModalOpen] = useState(false);
  const [statePatInfo, setStatePatInfo] = useState<PatInfo>();

  const notificationPageRef = useRef(1);
  const notificationHasMoreRef = useRef(true);

  const { avatar_large, username } = stateMemberProfile ?? {};
  const { topics } = stateNodeInfo ?? {};
  const secretPat = statePat?.replace(/(?<=-)[0-9a-z]{4}(?=-)/g, '****');

  const patInfoItems = (() => {
    const { scope, good_for_days, total_used, last_used } =
      statePatInfo ?? {};
    return [
      {
        label: (
          <Space size={4}>
            scope
            <Tooltip title="scope 有 2 种取值：everything 或 regular，唯一区别是 regular 不能用于创建新的 token">
              <QuestionCircleOutlined />
            </Tooltip>
          </Space>
        ),
        children: scope,
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

  const fetchMoreNotifications = async () => {
    if (!notificationHasMoreRef.current) {
      return;
    }
    try {
      const result = await window.services.getNotifications({
        page: notificationPageRef.current,
      });
      notificationPageRef.current += 1;
      if (result.length < 20) {
        notificationHasMoreRef.current = false;
      }
      setStateNotifications([...stateNotifications, ...result]);
    } catch (error) {
      notificationHasMoreRef.current = false;
      console.log(error);
    }
  };

  const handleDeleteNotification = async (id: number) => {
    try {
      await window.services.deleteNotification({ id });
      notificationPageRef.current = 1;
      notificationHasMoreRef.current = true;
      fetchMoreNotifications();
    } catch (error) {
      errorPrompt(error);
    }
  };

  const fetchNodeInfo = async () => {
    try {
      const result = await window.services.getNodeInfo({
        name: stateNode,
      });
      setStateNodeInfo(result);
    } catch (error) {
      errorPrompt(error);
    }
  };

  const fetchNodeTopics = async () => {
    setStateLoading(true);
    try {
      const result = await window.services.getNodeTopics({
        node: stateNode,
        page: statePage,
      });
      setStateTopics(result);
    } catch (error) {
      errorPrompt(error);
    }
    setStateLoading(false);
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
  };

  useEffect(() => {
    fetchMemberProfile();
    fetchMoreNotifications();
    fetchPatInfo();
  }, [statePat]);

  useEffect(() => {
    fetchNodeInfo();
  }, [stateNode]);

  useEffect(() => {
    fetchNodeTopics();
  }, [stateNode, statePage]);

  return (
    <div className="home-page">
      <Flex justify="space-between">
        <Title>V2EX</Title>
        <Space size="middle">
          <Popover
            placement="bottomRight"
            title="消息提醒"
            content={
              <div id="scrollableDiv" style={{ overflow: 'auto' }}>
                <InfiniteScroll
                  dataLength={stateNotifications.length}
                  next={fetchMoreNotifications}
                  hasMore={notificationHasMoreRef.current}
                  loader={<Skeleton paragraph={{ rows: 2 }} active />}
                  endMessage={<Divider plain>所有消息已加载完毕</Divider>}
                  scrollableTarget="scrollableDiv"
                >
                  <List
                    style={{ width: 600 }}
                    dataSource={stateNotifications}
                    renderItem={item => {
                      const { text, payload_rendered, created, id } =
                        item ?? {};
                      return (
                        <List.Item>
                          <List.Item.Meta
                            title={
                              <div
                                dangerouslySetInnerHTML={{ __html: text }}
                              ></div>
                            }
                            description={
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: payload_rendered,
                                }}
                              ></div>
                            }
                          />
                          <Space>
                            <Tag>{dayjs.unix(created).fromNow()}</Tag>
                            <Popconfirm
                              icon={
                                <QuestionCircleOutlined
                                  style={{ color: 'red' }}
                                />
                              }
                              title="删除消息"
                              description="您确定要删除这条消息吗？"
                              onConfirm={() =>
                                handleDeleteNotification(id)
                              }
                            >
                              <Button type="primary" size="small" danger>
                                删除
                              </Button>
                            </Popconfirm>
                          </Space>
                        </List.Item>
                      );
                    }}
                  />
                </InfiniteScroll>
              </div>
            }
            onOpenChange={isOpen => {
              if (isOpen) {
                notificationPageRef.current = 1;
                notificationHasMoreRef.current = true;
              }
            }}
          >
            <BellOutlined
              style={{
                fontSize: 24,
                cursor: 'pointer',
                color: '#000000A6',
              }}
            />
          </Popover>
          <Popover
            placement="bottomRight"
            title="个人信息"
            content={
              <div style={{ width: 350 }}>
                <Divider style={{ margin: '8px 0' }} />
                <Flex justify="space-between" align="center">
                  <Space size="middle">
                    <Avatar
                      shape="square"
                      size="large"
                      src={avatar_large}
                    />
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
                  <Link onClick={() => setStateIsPatModalOpen(true)}>
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
        </Space>
      </Flex>
      <div>
        <Flex vertical gap="small">
          <Radio.Group
            options={nodes}
            optionType="button"
            value={stateNode}
            onChange={e => setStateNode(e.target.value)}
          />
          <Pagination
            pageSize={20}
            total={topics}
            current={statePage}
            onChange={setStatePage}
            showSizeChanger={false}
            showQuickJumper
            showTotal={total => `${total} 个话题`}
          />
          <List
            dataSource={stateTopics}
            renderItem={item => {
              const { title, last_touched, last_reply_by, replies } = item;
              return (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <Link onClick={() => setStateActiveTopic(item)}>
                        {title}
                      </Link>
                    }
                    description={
                      <div>
                        {dayjs.unix(last_touched).fromNow()}
                        &nbsp;&nbsp;•&nbsp;&nbsp;
                        {last_reply_by
                          ? `最后回复来自 ${last_reply_by}`
                          : '无回复'}
                      </div>
                    }
                  />
                  <Tag>{replies}</Tag>
                </List.Item>
              );
            }}
            bordered
            loading={stateLoading}
          />
          <Pagination
            pageSize={20}
            total={topics}
            current={statePage}
            onChange={setStatePage}
            showSizeChanger={false}
            showQuickJumper
            showTotal={total => `${total} 个话题`}
          />
        </Flex>
        <div></div>
      </div>
      <Modal
        open={stateActiveTopic !== undefined}
        footer={
          <Button onClick={() => setStateActiveTopic(undefined)}>
            关闭
          </Button>
        }
        onCancel={() => setStateActiveTopic(undefined)}
        title="话题详情"
        width={1000}
        style={{ top: 30 }}
      >
        <TopicDetail topic={stateActiveTopic} key={stateActiveTopic?.id} />
      </Modal>
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
        <Title level={3}>{secretPat}</Title>
        <Divider style={{ margin: '8px 0' }} />
        <Descriptions items={patInfoItems} />
      </Modal>
    </div>
  );
}
