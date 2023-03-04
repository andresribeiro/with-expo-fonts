import { ConfigPlugin } from "@expo/config-plugins";
import { withDangerousMod } from "@expo/config-plugins";
import { copyFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const ANDROID_FONTS_PATHS = "android/app/src/main/assets/fonts";
const PROJECT_FONTS_PATH = "assets/fonts";

const withExpoFonts: ConfigPlugin = (config) => {
	return withDangerousMod(config, [
		"android",
		(config) => {
			const projectAndroidFontsPath = resolve(
				config.modRequest.projectRoot,
				ANDROID_FONTS_PATHS,
			);

			if (!existsSync(projectAndroidFontsPath)) {
				mkdirSync(projectAndroidFontsPath, { recursive: true });
			}

			const fontsFiles = readdirSync(PROJECT_FONTS_PATH);

			fontsFiles.forEach((fontFile) => {
				copyFileSync(
					`${PROJECT_FONTS_PATH}/${fontFile}`,
					`${projectAndroidFontsPath}/${fontFile}`,
				);
			});

			return config;
		},
	]);
};

export default withExpoFonts;
