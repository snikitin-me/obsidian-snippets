// https://code.visualstudio.com/docs/editor/userdefinedsnippets
export default class Snippet {
	// constructor() {
	// }
	// "For Loop" is the snippet name. It is displayed via IntelliSense if no description is provided.
	Id: string
	// prefix defines one or more trigger words that display the snippet in IntelliSense.
	// Substring matching is performed on prefixes, so in this case, "fc" could match "for-const".
	Prefix: Array<string>
	// body is one or more lines of content, which will be joined as multiple lines upon insertion.
	// Newlines and embedded tabs will be formatted according to the context in which the snippet is inserted.
	Body: Array<string> = []
	// description is an optional description of the snippet displayed by IntelliSense.
	Description: string = ""

	configure(attributes: any){
		// TODO: hendle MD header settings

		// if ((fmResult.attributes as any).headingPrefix) {
		//   options.headingPrefix = (fmResult.attributes as any).headingPrefix;
		// }
	}
}
