"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withInfoPlistExpoFonts = void 0;
const config_plugins_1 = require("expo/config-plugins");
const fs_1 = require("fs");
function ensureKey(arr, key) {
    if (!arr.find((mode) => mode === key)) {
        arr.push(key);
    }
    return arr;
}
const withInfoPlistExpoFonts = (config, props) => {
    if (!props.path)
        return config;
    return (0, config_plugins_1.withInfoPlist)(config, (config) => {
        if (!Array.isArray(config.modResults.UIAppFonts)) {
            config.modResults.UIAppFonts = [];
        }
        const fontsFiles = (0, fs_1.readdirSync)(props.path);
        fontsFiles.forEach((fontFile) => {
            if (fontFile.endsWith(".ttf") || fontFile.endsWith(".otf")) {
                config.modResults.UIAppFonts = ensureKey(config.modResults.UIAppFonts, fontFile);
            }
        });
        // Prevent empty array
        if (!config.modResults.UIAppFonts.length) {
            delete config.modResults.UIAppFonts;
        }
        return config;
    });
};
exports.withInfoPlistExpoFonts = withInfoPlistExpoFonts;
//# sourceMappingURL=withInfoPlistExpoFonts.js.map