import { ConfigPlugin, withInfoPlist } from "expo/config-plugins";
import { PluginConfigType } from "./pluginConfigType";

import { readdirSync } from "fs";

function ensureKey(arr: string[], key: string) {
  if (!arr.find((mode) => mode === key)) {
    arr.push(key);
  }
  return arr;
}

export const withInfoPlistExpoFonts: ConfigPlugin<PluginConfigType> = (
  config,
  props
) => {
  if (!props.path) return config;
  return withInfoPlist(config, (config) => {
    if (!Array.isArray(config.modResults.UIAppFonts)) {
      config.modResults.UIAppFonts = [];
    }

    const fontsFiles = readdirSync(props.path);

    fontsFiles.forEach((fontFile) => {
      if (fontFile.endsWith(".ttf") || fontFile.endsWith(".otf")) {
        config.modResults.UIAppFonts = ensureKey(
          config.modResults.UIAppFonts as string[],
          fontFile
        );
      }
    });

    // Prevent empty array
    if (!config.modResults.UIAppFonts.length) {
      delete config.modResults.UIAppFonts;
    }

    return config;
  });
};
