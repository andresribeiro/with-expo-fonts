import {
  ConfigPlugin,
  IOSConfig,
  withXcodeProject,
} from "@expo/config-plugins";
import { readdirSync } from "fs";
import { join } from "path";
import { PluginConfigType } from "./pluginConfigType";
// @ts-ignore
import pbxFile from "xcode/lib/pbxFile";

export const withXcodeProjectExpoFonts: ConfigPlugin<PluginConfigType> = (
  config,
  props
) => {
  return withXcodeProject(config, async (config) => {
    const groupPath = `.${props.path}`;
    const group = IOSConfig.XcodeUtils.ensureGroupRecursively(
      config.modResults,
      groupPath
    );
    const project = config.modResults;
    const opt: any = {};

    // Unlink old assets

    const groupId = Object.keys(project.hash.project.objects["PBXGroup"]).find(
      (id) => {
        const _group = project.hash.project.objects["PBXGroup"][id];
        return _group.name === group.name;
      }
    );
    if (!project.hash.project.objects["PBXVariantGroup"]) {
      project.hash.project.objects["PBXVariantGroup"] = {};
    }
    const variantGroupId = Object.keys(
      project.hash.project.objects["PBXVariantGroup"]
    ).find((id) => {
      const _group = project.hash.project.objects["PBXVariantGroup"][id];
      return _group.name === group.name;
    });

    const children = [...(group.children || [])];

    for (const child of children as {
      comment: string;
      value: string;
    }[]) {
      const file = new pbxFile(join(group.name, child.comment), opt);
      file.target = opt ? opt.target : undefined;

      project.removeFromPbxBuildFileSection(file); // PBXBuildFile
      project.removeFromPbxFileReferenceSection(file); // PBXFileReference
      if (group) {
        if (groupId) {
          project.removeFromPbxGroup(file, groupId); //Group other than Resources (i.e. 'splash')
        } else if (variantGroupId) {
          project.removeFromPbxVariantGroup(file, variantGroupId); // PBXVariantGroup
        }
      }
      project.removeFromPbxResourcesBuildPhase(file); // PBXResourcesBuildPhase
    }

    // Link new assets

    await iterateFontsAsync(props, async (fontFile) => {
      if (
        !group?.children.some(
          ({ comment }: { comment: string }) => comment === fontFile
        )
      ) {
        // Only write the file if it doesn't already exist.
        config.modResults = IOSConfig.XcodeUtils.addResourceFileToGroup({
          filepath: join(groupPath, fontFile),
          groupName: groupPath,
          project: config.modResults,
          isBuildFile: true,
          verbose: true,
        });
      } else {
        console.log("Skipping duplicate: ", fontFile);
      }
    });

    return config;
  });
};

async function iterateFontsAsync(
  props: PluginConfigType,
  callback: (fontFile: string, index: number) => Promise<void>
) {
  const fontsFiles = readdirSync(props.path);

  for (let index = 0; index < fontsFiles.length; index++) {
    const fontFile = fontsFiles[index];
    if (fontFile.endsWith(".ttf") || fontFile.endsWith(".otf")) {
      await callback(fontFile, index);
    }
  }
}
