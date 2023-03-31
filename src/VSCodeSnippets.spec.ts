import { jest } from '@jest/globals';

describe("VSCode snippets class", () => {

	it("Should parse snippet", () => {
		const header = "Snippet header"
		expect(header).toBe("Snippet header");
	});

});
