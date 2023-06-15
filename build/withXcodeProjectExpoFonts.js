"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withXcodeProjectExpoFonts = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const fs_1 = require("fs");
const path_1 = require("path");
// @ts-ignore
const pbxFile_1 = __importDefault(require("xcode/lib/pbxFile"));
const withXcodeProjectExpoFonts = (config, props) => {
    return (0, config_plugins_1.withXcodeProject)(config, async (config) => {
        const groupPath = `.${props.path}`;
        const group = config_plugins_1.IOSConfig.XcodeUtils.ensureGroupRecursively(config.modResults, groupPath);
        const project = config.modResults;
        const opt = {};
        // Unlink old assets
        const groupId = Object.keys(project.hash.project.objects["PBXGroup"]).find((id) => {
            const _group = project.hash.project.objects["PBXGroup"][id];
            return _group.name === group.name;
        });
        if (!project.hash.project.objects["PBXVariantGroup"]) {
            project.hash.project.objects["PBXVariantGroup"] = {};
        }
        const variantGroupId = Object.keys(project.hash.project.objects["PBXVariantGroup"]).find((id) => {
            const _group = project.hash.project.objects["PBXVariantGroup"][id];
            return _group.name === group.name;
        });
        const children = [...(group.children || [])];
        for (const child of children) {
            const file = new pbxFile_1.default((0, path_1.join)(group.name, child.comment), opt);
            file.target = opt ? opt.target : undefined;
            project.removeFromPbxBuildFileSection(file); // PBXBuildFile
            project.removeFromPbxFileReferenceSection(file); // PBXFileReference
            if (group) {
                if (groupId) {
                    project.removeFromPbxGroup(file, groupId); //Group other than Resources (i.e. 'splash')
                }
                else if (variantGroupId) {
                    project.removeFromPbxVariantGroup(file, variantGroupId); // PBXVariantGroup
                }
            }
            project.removeFromPbxResourcesBuildPhase(file); // PBXResourcesBuildPhase
        }
        // Link new assets
        await iterateFontsAsync(props, async (fontFile) => {
            if (!group?.children.some(({ comment }) => comment === fontFile)) {
                // Only write the file if it doesn't already exist.
                config.modResults = config_plugins_1.IOSConfig.XcodeUtils.addResourceFileToGroup({
                    filepath: (0, path_1.join)(groupPath, fontFile),
                    groupName: groupPath,
                    project: config.modResults,
                    isBuildFile: true,
                    verbose: true,
                });
            }
            else {
                console.log("Skipping duplicate: ", fontFile);
            }
        });
        return config;
    });
};
exports.withXcodeProjectExpoFonts = withXcodeProjectExpoFonts;
async function iterateFontsAsync(props, callback) {
    const fontsFiles = (0, fs_1.readdirSync)(props.path);
    for (let index = 0; index < fontsFiles.length; index++) {
        const fontFile = fontsFiles[index];
        if (fontFile.endsWith(".ttf") || fontFile.endsWith(".otf")) {
            await callback(fontFile, index);
        }
    }
}
//# sourceMappingURL=withXcodeProjectExpoFonts.js.map