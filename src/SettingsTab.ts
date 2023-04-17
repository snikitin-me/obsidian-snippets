import { App, PluginSettingTab, Setting } from "obsidian";
import ExamplePlugin from "../main";

export enum Settings {
	SnippetsPrefix,
	VscodeSnippetsFolder,
}

export interface PluginSettings {
	snippetsPrefix: string;
	vscodeSnippetsFolder: string;
}

export const DEFAULT_SETTINGS: Partial<PluginSettings> = {
	snippetsPrefix: "sn/",
	vscodeSnippetsFolder: "C:/Users/User/AppData/Roaming/Code/User/snippets",
};

export default class SettingsTab extends PluginSettingTab {
	plugin: ExamplePlugin;

	constructor(app: App, plugin: ExamplePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		let { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Snippets prefix tags")
			.setDesc("...")
			.addText((text) =>
				text
					.setPlaceholder("sn/")
					.setValue(this.plugin.settings.snippetsPrefix)
					.onChange(async (value) => {
						this.plugin.settings.snippetsPrefix = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Vscode folder")
			.setDesc("...")
			.addText((text) =>
				text
					.setPlaceholder("C:/Users/Name/AppData/Roaming/Code/User/snippets")
					.setValue(this.plugin.settings.vscodeSnippetsFolder)
					.onChange(async (value) => {
						this.plugin.settings.vscodeSnippetsFolder = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
