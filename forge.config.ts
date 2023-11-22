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
    {
      name: '@electron-forge/maker-zip',
      config: {},
    },
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-bitbucket',
      config: {
        repository: {
          owner: 'hzy1721',
          name: 'v2ex-electron',
        },
        replaceExistingFiles: true,
      },
    },
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'hzy1721',
          name: 'v2ex-electron',
        },
        force: true,
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
