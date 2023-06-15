import { ConfigPlugin, createRunOncePlugin } from "@expo/config-plugins";

import { withAndroidExpoFonts } from "./withAndroidExpoFonts";
import { withInfoPlistExpoFonts } from "./withInfoPlistExpoFonts";
import { withXcodeProjectExpoFonts } from "./withXcodeProjectExpoFonts";
import { PluginConfigType } from "./pluginConfigType";

const withExpoFonts: ConfigPlugin<PluginConfigType> = (config, props) => {
  config = withAndroidExpoFonts(config, props);
  config = withInfoPlistExpoFonts(config, props);
  config = withXcodeProjectExpoFonts(config, props);

  return config;
};

const pak = require("../package.json");
export default createRunOncePlugin(withExpoFonts, pak.name, pak.version);
