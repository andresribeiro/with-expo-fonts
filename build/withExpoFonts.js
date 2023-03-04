"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("@expo/config-plugins");
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const ANDROID_FONTS_PATHS = "android/app/src/main/assets/fonts";
const PROJECT_FONTS_PATH = "assets/fonts";
const withExpoFonts = (config) => {
    return (0, config_plugins_1.withDangerousMod)(config, [
        "android",
        (config) => {
            const projectAndroidFontsPath = (0, node_path_1.resolve)(config.modRequest.projectRoot, ANDROID_FONTS_PATHS);
            if (!(0, node_fs_1.existsSync)(projectAndroidFontsPath)) {
                (0, node_fs_1.mkdirSync)(projectAndroidFontsPath, { recursive: true });
            }
            const fontsFiles = (0, node_fs_1.readdirSync)(PROJECT_FONTS_PATH);
            fontsFiles.forEach((fontFile) => {
                (0, node_fs_1.copyFileSync)(`${PROJECT_FONTS_PATH}/${fontFile}`, `${projectAndroidFontsPath}/${fontFile}`);
            });
            return config;
        },
    ]);
};
exports.default = withExpoFonts;
//# sourceMappingURL=withExpoFonts.js.map