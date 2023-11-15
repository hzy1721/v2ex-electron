import {
  Typography,
  Radio,
  List,
  Tag,
  Flex,
  Button,
  Modal,
  Pagination,
} from 'antd';
import { ReactElement, useEffect, useState } from 'react';
import { TopicItem } from '../../../services/getNodeTopics';
import { errorPrompt } from '../../utils';
import dayjs from 'dayjs';
import TopicDetail from './TopicDetail';
import { NodeInfo } from '../../../services/getNodeInfo';

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
  const [statePage, setStatePage] = useState(1);
  const [stateLoading, setStateLoading] = useState(false);
  const [stateTopics, setStateTopics] = useState<TopicItem[]>([]);
  const [stateActiveTopic, setStateActiveTopic] = useState<TopicItem>();

  const { topics } = stateNodeInfo ?? {};

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

  useEffect(() => {
    fetchNodeInfo();
  }, [stateNode]);

  useEffect(() => {
    fetchNodeTopics();
  }, [stateNode, statePage]);

  return (
    <div className="home-page">
      <Title>V2EX</Title>
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
    </div>
  );
}
