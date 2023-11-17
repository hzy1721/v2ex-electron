import {
  Button,
  Divider,
  List,
  Popconfirm,
  Popover,
  Skeleton,
  Space,
  Tag,
} from 'antd';
import { ReactElement, useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { NotificationItem } from '../../../../services/getNotifications';
import dayjs from 'dayjs';
import { BellOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { errorPrompt } from '../../../utils';
import { useLocalStorage } from '@uidotdev/usehooks';

export default function UserNotification(): ReactElement {
  const [statePat] = useLocalStorage<string>('pat');
  const [stateNotifications, setStateNotifications] = useState<
    NotificationItem[]
  >([]);

  const notificationPageRef = useRef(1);
  const notificationHasMoreRef = useRef(true);

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
      errorPrompt(error);
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

  useEffect(() => {
    fetchMoreNotifications();
  }, [statePat]);

  return (
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
                const { text, payload_rendered, created, id } = item ?? {};
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
                        onConfirm={() => handleDeleteNotification(id)}
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
  );
}
