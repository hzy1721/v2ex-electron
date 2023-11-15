import { contextBridge, ipcRenderer } from 'electron';
import type services from './services';

contextBridge.exposeInMainWorld('services', {
  testPat: params => ipcRenderer.invoke('services', 'testPat', params),
  getNodeInfo: params =>
    ipcRenderer.invoke('services', 'getNodeInfo', params),
  getNodeTopics: params =>
    ipcRenderer.invoke('services', 'getNodeTopics', params),
  getTopicInfo: params =>
    ipcRenderer.invoke('services', 'getTopicInfo', params),
  getTopicReplies: params =>
    ipcRenderer.invoke('services', 'getTopicReplies', params),
  getNotifications: params =>
    ipcRenderer.invoke('services', 'getNotifications', params),
} as typeof services);

contextBridge.exposeInMainWorld('api', {
  updatePat: (pat: string) => ipcRenderer.send('pat', pat),
});
