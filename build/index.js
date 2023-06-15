"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("@expo/config-plugins");
const withAndroidExpoFonts_1 = require("./withAndroidExpoFonts");
const withInfoPlistExpoFonts_1 = require("./withInfoPlistExpoFonts");
const withXcodeProjectExpoFonts_1 = require("./withXcodeProjectExpoFonts");
const withExpoFonts = (config, props) => {
    config = (0, withAndroidExpoFonts_1.withAndroidExpoFonts)(config, props);
    config = (0, withInfoPlistExpoFonts_1.withInfoPlistExpoFonts)(config, props);
    config = (0, withXcodeProjectExpoFonts_1.withXcodeProjectExpoFonts)(config, props);
    return config;
};
const pak = require("../package.json");
exports.default = (0, config_plugins_1.createRunOncePlugin)(withExpoFonts, pak.name, pak.version);
//# sourceMappingURL=index.js.map