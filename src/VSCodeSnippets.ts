import { App, TFile } from "obsidian";
import * as fs from 'fs';
import * as path from 'path';
import Snippet from "./Snippet";
import { marked } from 'marked'
import { Settings } from "./SettingsTab";
import fm from 'front-matter';

export default class VSCodeSnippets {
	/**
	 * @public
	*/
	vscodeSnippetsFolder: string
	vscodeSnippetsFileName: string
	snippetsPrefix: string

	constructor(config: { vscodeSnippetsFolder?: any; snippetsPrefix: any; }) {

		this.vscodeSnippetsFolder = config.vscodeSnippetsFolder;
		this.snippetsPrefix = config.snippetsPrefix

		// TODO add config.vscodeSnippetsFileName ? join to vscodeSnippetsFolder
		this.vscodeSnippetsFileName = "obsidian.code-snippets"
	}

	async saveSnippetsToVScodeFile(filesWithTags: TFile[] ){
		if(this.vscodeSnippetsFolder === ""){
			throw new Error("Setting vscodeSnippetsFolder is empty")
		}

		const allSnippets = await this.convertToVScodeSnippetFile(filesWithTags);

		let jsonContent = JSON.stringify(allSnippets, null, 2);
		const normalizedNewPath = path.join(this.vscodeSnippetsFolder, this.vscodeSnippetsFileName);

		fs.writeFile(normalizedNewPath, jsonContent, 'utf8', function (err) {
			if (err) {
				console.log("An error occured while writing JSON Object to File.");
				return console.log(err);
			}

			console.log("JSON file has been saved.");
		});
	}

	async convertToVScodeSnippetFile(filesWithTags: TFile[]){
		let snippets: any = {}
		for await (const file of filesWithTags) {

			// FIXME error break all snippets!?
			try {
				const fileContent = await file.vault.read(file)
				this.createSnippetsFromMDFile(fileContent).forEach(snippet => {

					if(snippets[snippet!.Id]){
						throw new Error(`Dublicated snippet id(${snippet!.Id})`)
					}

					snippets[snippet!.Id] = this.convertToVsCodeFormat(snippet);
				})
			} catch(e) {
				console.log(file.path, e)
			}
		}

		return snippets
	}

	createSnippetsFromMDFile(fileContent: string) {

		if(!this.snippetsPrefix){
			throw new Error("Setting snippetsPrefix is undefined!")
		}

		if(this.snippetsPrefix.startsWith('#')){
			throw new Error("Setting snippetsPrefix must not start with '#' !")
		}

		let snippets = [];
		let snippet: Snippet | undefined;

			const fmResult = fm(fileContent);
			const tokens = marked.lexer(fmResult.body);

		while (tokens.length) {
			let settings, description, id, body

			if(this.isNewSnippet(tokens[0])){
				if(snippet !== undefined){
					snippets.push(snippet)
				}
				snippet = new Snippet()
				snippet.configure(fmResult.attributes)
			}

			if ((description = this.parseSnippetDescription(tokens))) {
				snippet!.Description = description;
			} else if ((id = this.parseSnippetId(tokens))) {
				snippet!.Id = id
				snippet!.Prefix = id // TODO handle mutiple prefixes
			} else if ((body = this.parseSnippetBody(tokens))) {
				snippet!.Body = body
			} else {
				tokens.shift()
			}
		}

		// if(snippet!.Prefix[0] == null){
		if(!snippet!.Prefix){
			throw new Error("Snippet prefix is not found!")
		}

		// add last snippet to snippets object
		snippets.push(snippet)

		return snippets;
	}

	convertToVsCodeFormat(snippet: Snippet | undefined){
		return {
			description: snippet!.Description,
			body: snippet!.Body,
			prefix: [snippet!.Prefix]
		}
	}

	parseSnippetId(tokens: any) {
		let id;

		let token = tokens[0];

		if (token.raw.startsWith('#' + this.snippetsPrefix)) {
			id = token.raw.trim()
			if(!id){
				throw new Error("Snippet Id is undefined!");
			}
			tokens.shift()
		}


		return id;
	}

	parseSnippetHeader(tokens: any) {
		let header;

		let token = tokens[0];

		if (token.type === "heading" && token.depth === 1) {

			header = token.text
			tokens.shift()
		}


		return header;
	}

	isNewSnippet(token: any){
		return (token.type === "heading" && token.depth === 1)
	}

	parseSnippetDescription(tokens: any) {

		const description = []
		let token = tokens[0];

		if (token.type === "heading"
			&& token.depth === 2
			&& token.text.startsWith("Description")) {

			tokens.shift()

			while ((token = tokens[0])) {
				// if next block of code
				if(token.type === "heading" && token.depth === 2 ){
					break
				}

				description.push(token.raw)
				tokens.shift()
			}
		}

		return description.join('\n')
	}

	parseSnippetBody(tokens: any): Array<any> {
		let body;

		let token = tokens[0];

			if(token.type === "code"){
				body = token.text.split("\n")
				tokens.shift()
			}

		return body;
	}
}
