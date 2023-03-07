export function toKebabCase(string: string): string {
	return string.replace(/[A-Z]+(?![a-z])|[A-Z]/g, (match, index) => (index ? "-" : "") + match.toLowerCase());
}

export function toDDMMYYYYWithLeadingZeros(date: Date, separator: string) {
	let day = date.getDate();
	let month = date.getMonth() + 1;
	let year = date.getFullYear();

	let dayString = day.toString().length === 1 ? "0" + day : "" + day;
	let monthString = month.toString().length === 1 ? "0" + month : "" + month;

	return dayString + separator + monthString + separator + year;
}

export function toHHMM(date: Date, separator: string) {
	return date.getHours() + separator + date.getMinutes();
}
