import VSCodeSnippets from "./VSCodeSnippets";
import Snippet from "./Snippet";
import fs from "fs";
import path from "path";

const snippetsPrefix = "sn/";
const VSSnippets = new VSCodeSnippets({
	snippetsPrefix: snippetsPrefix, // without '#'
});

describe("Name of the group", () => {
	it("should parse Snippet Id", () => {
		let tokens = [{ raw: "#" + snippetsPrefix }];
		const id = VSSnippets.parseSnippetId(tokens);

		expect(tokens.length).toBe(0);
		expect(id).toBe("#" + snippetsPrefix);
	});

	it("should parse Snippet Header", () => {
		let tokens = [{ type: "heading", depth: 1, text: "Snippet header" }];
		const header = VSSnippets.parseSnippetHeader(tokens);

		expect(tokens.length).toBe(0);
		expect(header).toBe("Snippet header");
	});

	it("should parse Snippet Description", () => {
		let tokens = [
			{ type: "heading", depth: 2, text: "Description" }, // must start from Description
			{ type: "text", raw: "Description line 1" },
			{ type: "text", raw: "Description line 2" },
		];

		const description = VSSnippets.parseSnippetDescription(tokens);

		expect(tokens.length).toBe(0);
		expect(description).toBe("Description line 1\nDescription line 2");
	});

	it("should parse Snippet Body", () => {
		let tokens = [{ type: "code", text: "Code line 1\nCode line 2" }];

		const description = VSSnippets.parseSnippetBody(tokens);

		expect(tokens.length).toBe(0);
		expect(description).toMatchObject(["Code line 1", "Code line 2"]);
	});

	it("it should handle markdown snippet", () => {

		const filePath = path.resolve(__dirname, '../example/Hello world.md')
		const fileContent = fs.readFileSync(filePath, 'utf8');

		let snippets = VSSnippets.createSnippetsFromMDFile(filePath, fileContent);

		expect(snippets.length).toBe(2);

		expect(snippets[0]!.Id).toBe("#sn/test/snippet-1");
		expect(snippets[0]!.Prefix).toEqual("#sn/test/snippet-1");
		// FIXME: \n\n\n should be removed
		expect(snippets[0]!.Description).toBe("Line 1...\nLine 2...\n[link](http://snikitin.me)\n\n\n");
		expect(snippets[0]!.Body).toEqual([
			"for (const ${2:element} of ${1:array}) {",
			"    \\t$0",
			"}",
		]);

		// TODO test for multiple lines
	})

	it("Should throw an error when the snippet is empty", () => {

		const filePath = path.resolve(__dirname, '../example/Null.md')
		const fileContent = fs.readFileSync(filePath, 'utf8')

		expect(() => VSSnippets.createSnippetsFromMDFile(filePath, fileContent)).toThrow(`Snippet format incorrect! Snippet file path: ${filePath}.`)
	})
});
