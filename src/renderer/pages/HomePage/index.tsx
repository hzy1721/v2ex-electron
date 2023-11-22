import {
  Typography,
  Radio,
  List,
  Tag,
  Flex,
  Button,
  Modal,
  Pagination,
  Space,
  Spin,
} from 'antd';
import { ReactElement, useEffect, useState } from 'react';
import { TopicItem } from '../../../services/getNodeTopics';
import { errorPrompt } from '../../utils';
import dayjs from 'dayjs';
import { NodeInfo } from '../../../services/getNodeInfo';
import UserProfile from './UserProfile';
import UserNotification from './UserNotification';
import TopicDetail from './TopicDetail';

import './index.less';

const { Title, Link } = Typography;

const nodes = [
  { value: 'tech', label: '技术' },
  { value: 'create', label: '分享创造' },
  { value: 'play', label: '好玩' },
  { value: 'jobs', label: '酷工作' },
  { value: 'beijing', label: '北京' },
];

export default function HomePage(): ReactElement {
  const [stateNode, setStateNode] = useState(nodes[0].value);
  const [stateNodeInfo, setStateNodeInfo] = useState<NodeInfo>();
  const [stateLoadingForNodeInfo, setStateLoadingForNodeInfo] =
    useState(false);

  const [statePage, setStatePage] = useState(1);
  const [stateTopics, setStateTopics] = useState<TopicItem[]>([]);
  const [stateLoadingForTopics, setStateLoadingForTopics] =
    useState(false);

  const [stateActiveTopic, setStateActiveTopic] = useState<TopicItem>();

  const { topics } = stateNodeInfo ?? {};

  const fetchNodeInfo = async () => {
    setStateLoadingForNodeInfo(true);
    try {
      const result = await window.services.getNodeInfo({
        name: stateNode,
      });
      setStateNodeInfo(result);
    } catch (error) {
      errorPrompt(error);
    }
    setStateLoadingForNodeInfo(false);
  };

  const fetchNodeTopics = async () => {
    setStateLoadingForTopics(true);
    try {
      const result = await window.services.getNodeTopics({
        node: stateNode,
        page: statePage,
      });
      setStateTopics(result);
    } catch (error) {
      errorPrompt(error);
    }
    setStateLoadingForTopics(false);
  };

  const topicListPagination = (
    <Pagination
      pageSize={20}
      total={topics}
      current={statePage}
      onChange={setStatePage}
      showSizeChanger={false}
      showQuickJumper
      showTotal={total => `${total} 个话题`}
    />
  );

  useEffect(() => {
    fetchNodeInfo();
  }, [stateNode]);

  useEffect(() => {
    fetchNodeTopics();
  }, [stateNode, statePage]);

  return (
    <>
      <div className="home-page">
        <Flex justify="space-between">
          <Title>V2EX</Title>
          <Space size="middle">
            <UserNotification />
            <UserProfile />
          </Space>
        </Flex>
        <Flex vertical gap="small">
          <Radio.Group
            options={nodes}
            optionType="button"
            value={stateNode}
            onChange={e => {
              setStateNode(e.target.value);
              setStatePage(1);
            }}
          />
          {topicListPagination}
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
            loading={stateLoadingForTopics}
          />
          {topicListPagination}
        </Flex>
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
          <TopicDetail
            topic={stateActiveTopic}
            key={stateActiveTopic?.id}
          />
        </Modal>
      </div>
      <Spin spinning={stateLoadingForNodeInfo} fullscreen />
    </>
  );
}
