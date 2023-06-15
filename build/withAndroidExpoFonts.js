"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withAndroidExpoFonts = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const fs_1 = require("fs");
const path_1 = require("path");
const ANDROID_FONTS_PATHS = "android/app/src/main/assets/fonts";
const withAndroidExpoFonts = (config, props) => {
    return (0, config_plugins_1.withDangerousMod)(config, [
        "android",
        (config) => {
            const projectAndroidFontsPath = (0, path_1.resolve)(config.modRequest.projectRoot, ANDROID_FONTS_PATHS);
            if (!(0, fs_1.existsSync)(projectAndroidFontsPath)) {
                (0, fs_1.mkdirSync)(projectAndroidFontsPath, { recursive: true });
            }
            const fontsFiles = (0, fs_1.readdirSync)(props.path);
            fontsFiles.forEach((fontFile) => {
                (0, fs_1.copyFileSync)(`${props.path}/${fontFile}`, `${projectAndroidFontsPath}/${fontFile}`);
            });
            return config;
        },
    ]);
};
exports.withAndroidExpoFonts = withAndroidExpoFonts;
//# sourceMappingURL=withAndroidExpoFonts.js.map