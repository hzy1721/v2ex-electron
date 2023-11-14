import { contextBridge, ipcRenderer } from 'electron';
import type services from './services';

contextBridge.exposeInMainWorld('services', {
  getNotifications: params =>
    ipcRenderer.invoke('services', 'getNotifications', params),
  testPat: params => ipcRenderer.invoke('services', 'testPat', params),
} as typeof services);

contextBridge.exposeInMainWorld('api', {
  updatePat: (pat: string) => ipcRenderer.send('pat', pat),
});
