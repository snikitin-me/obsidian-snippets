import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { getTagFiles } from "./src/utils/tags";
import VScodeSnippets from "./src/VSCodeSnippets";

// Remember to rename these classes and interfaces!

import SettingsTab, {
	DEFAULT_SETTINGS,
	PluginSettings,
	Settings,
} from "./src/SettingsTab";
import Snippet from 'src/Snippet';

export default class MyPlugin extends Plugin {
	settings: PluginSettings
	vscode: VScodeSnippets

	async onload() {
		await this.loadSettings();

		this.vscode = new VScodeSnippets({
			vscodeSnippetsFolder: this.settings.vscodeSnippetsFolder,
			snippetsPrefix: this.settings.snippetsPrefix
		});

		this.addSnippetRibbonIcon()

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SettingsTab(this.app, this));

		console.log("onload");
	}

	async addSnippetRibbonIcon() {
		try {
			// This creates an icon in the left ribbon.
			const ribbonIconEl = this.addRibbonIcon('dice', 'Export snippets', (evt: MouseEvent) => {

				if (this.settings.snippetsPrefix === "") {
					throw new Error("snippetsPrefix is empty")
				}

				let filesWithTags = getTagFiles(this.app, this.settings.snippetsPrefix)
				this.vscode.saveSnippetsToVScodeFile(filesWithTags)
			});

		} catch (error) {
			console.error(error);
			new Notice(`${error.message}`);
		}
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}