let suffixes = ["", "K", "M", "G", "T", "P", "E", "Z", "Y"];

/**
 * Formats a number with a byte size suffix
 *
 * @example
 * 1395 -> 1.40 KB
 * 134773 -> 135 KB
 * @param number
 */
export function withByteSizeSuffix(number: number): string {
	let length = number.toString().length;
	let suffixIndex = Math.ceil(length / 3 - 1);
	let divided = number / 10 ** (suffixIndex * 3);
	let string = divided.toFixed(3 - divided.toString().split(".")[0].length);
	return string + " " + suffixes[suffixIndex] + "B";
}
