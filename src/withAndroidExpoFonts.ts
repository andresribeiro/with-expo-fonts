import { ConfigPlugin } from "@expo/config-plugins";
import { withDangerousMod } from "@expo/config-plugins";
import { copyFileSync, existsSync, mkdirSync, readdirSync } from "fs";
import { resolve } from "path";
import { PluginConfigType } from "./pluginConfigType";

const ANDROID_FONTS_PATHS = "android/app/src/main/assets/fonts";

export const withAndroidExpoFonts: ConfigPlugin<PluginConfigType> = (config, props) => {
  return withDangerousMod(config, [
    "android",
    (config) => {
      const projectAndroidFontsPath = resolve(
        config.modRequest.projectRoot,
        ANDROID_FONTS_PATHS
      );

      if (!existsSync(projectAndroidFontsPath)) {
        mkdirSync(projectAndroidFontsPath, { recursive: true });
      }

      const fontsFiles = readdirSync(props.path);

      fontsFiles.forEach((fontFile) => {
        copyFileSync(
          `${props.path}/${fontFile}`,
          `${projectAndroidFontsPath}/${fontFile}`
        );
      });

      return config;
    },
  ]);
};