import type { ForgeConfig } from '@electron-forge/shared-types';
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';

import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-dmg',
      config: {
        iconSize: 128,
        contents: (opts: { appPath: string }) => [
          {
            x: 100,
            y: 100,
            type: 'file',
            path: opts.appPath,
          },
          {
            x: 300,
            y: 100,
            type: 'link',
            path: '/Applications',
          },
        ],
        additionalDMGOptions: {
          window: {
            size: {
              width: 400,
              height: 240,
            },
          },
        },
      },
    },
  ],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new WebpackPlugin({
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            name: 'main_window',
            html: './src/index.html',
            js: './src/renderer/index.tsx',
            preload: {
              js: './src/preload.ts',
            },
          },
        ],
      },
    }),
  ],
};

export default config;
