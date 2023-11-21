import { ReactElement, useEffect, useState } from 'react';
import { TopicItem } from '../../../../services/getNodeTopics';
import {
  Avatar,
  Card,
  Divider,
  Flex,
  List,
  Pagination,
  Tag,
  Typography,
} from 'antd';
import { errorPrompt } from '../../../utils';
import { TopicInfo } from '../../../../services/getTopicInfo';
import dayjs from 'dayjs';
import { ReplyItem } from '../../../../services/getTopicReplies';

const { Title } = Typography;

interface TopicDetailProps {
  topic: TopicItem;
}

export default function TopicDetail({
  topic,
}: TopicDetailProps): ReactElement {
  const {
    id,
    title,
    last_modified,
    content_rendered,
    replies: replyNum,
  } = topic;

  const [stateActiveTopicInfo, setStateActiveTopicInfo] =
    useState<TopicInfo>();
  const [statePage, setStatePage] = useState(1);
  const [stateReplies, setStateReplies] = useState<ReplyItem[]>([]);
  const [stateLoading, setStateLoading] = useState(false);

  const { member } = stateActiveTopicInfo ?? {};
  const { username, avatar } = member ?? {};

  const fetchTopicInfo = async () => {
    if (topic === undefined) {
      return;
    }
    try {
      const result = await window.services.getTopicInfo({ id });
      setStateActiveTopicInfo(result);
    } catch (error) {
      errorPrompt(error);
    }
  };

  const fetchTopicReplies = async () => {
    if (topic === undefined) {
      return;
    }
    setStateLoading(true);
    try {
      const result = await window.services.getTopicReplies({
        topic: id,
        page: statePage,
      });
      setStateReplies(result);
    } catch (error) {
      errorPrompt(error);
    }
    setStateLoading(false);
  };

  const replyListPagination = (
    <Pagination
      pageSize={100}
      total={replyNum}
      current={statePage}
      onChange={setStatePage}
      style={{ margin: 8 }}
      size="small"
      showSizeChanger={false}
    />
  );

  useEffect(() => {
    fetchTopicInfo();
  }, [topic]);

  useEffect(() => {
    fetchTopicReplies();
  }, [topic, statePage]);

  return (
    <Flex vertical gap="small">
      <Card>
        <Flex justify="space-between" align="flex-start">
          <div>
            <Title level={3}>{title}</Title>
            <div>
              {username}
              &nbsp;&nbsp;•&nbsp;&nbsp;
              {dayjs.unix(last_modified).fromNow()}
            </div>
          </div>
          <Avatar shape="square" size={64} src={avatar} />
        </Flex>
        <Divider />
        <div dangerouslySetInnerHTML={{ __html: content_rendered }}></div>
      </Card>
      <Card bodyStyle={{ padding: 0 }}>
        <div style={{ padding: 12 }}>
          {`${replyNum} 条回复`}
          &nbsp;&nbsp;•&nbsp;&nbsp;
          {dayjs().format('YYYY-MM-DD HH:mm:ss Z')}
        </div>
        <Divider style={{ margin: 0 }} />
        {stateReplies.length > 0 && (
          <>
            {replyListPagination}
            <Divider style={{ margin: 0 }} />
          </>
        )}
        <List
          dataSource={stateReplies}
          renderItem={(item, index) => {
            const { member, content_rendered } = item ?? {};
            const { avatar, username } = member ?? {};
            return (
              <List.Item style={{ paddingLeft: 16, paddingRight: 16 }}>
                <List.Item.Meta
                  avatar={
                    <Avatar shape="square" size="large" src={avatar} />
                  }
                  title={username}
                  description={
                    <div
                      dangerouslySetInnerHTML={{
                        __html: content_rendered,
                      }}
                    ></div>
                  }
                />
                <Tag style={{ marginLeft: 16 }}>{index + 1}</Tag>
              </List.Item>
            );
          }}
          loading={stateLoading}
        />
        {stateReplies.length > 0 && (
          <>
            <Divider style={{ margin: 0 }} />
            {replyListPagination}
          </>
        )}
      </Card>
    </Flex>
  );
}
