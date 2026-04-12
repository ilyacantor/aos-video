/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";
import { enableTailwind } from '@remotion/tailwind-v4';

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.overrideWebpackConfig((config) => {
  const tw = enableTailwind(config);
  return {
    ...tw,
    watchOptions: {
      ...tw.watchOptions,
      ignored: ['**/node_modules/**', '**/public/avatar/**', '**/public/scenes/**', '**/public/base-video.mp4'],
    },
  };
});
Config.setWebpackPollingInMilliseconds(1000);
