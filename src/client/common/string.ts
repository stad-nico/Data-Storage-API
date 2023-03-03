export function toKebabCase(string: string): string {
	return string.replace(/[A-Z]+(?![a-z])|[A-Z]/g, (match, index) => (index ? "-" : "") + match.toLowerCase());
}
