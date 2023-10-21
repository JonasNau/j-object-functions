/* eslint-disable @typescript-eslint/no-inferrable-types */
import * as lodash from "lodash";

export enum ERemoveDirection {
	START,
	END,
}
export function removeFromArray<T>(
	array: T[],
	value: T,
	removeAll = true,
	checkForDeepObjects = false,
	removeDirection: ERemoveDirection = ERemoveDirection.START
): T[] {
	if (!removeAll) {
		if (removeDirection === ERemoveDirection.START) {
			const index = array.findIndex((predicate) => {
				if (checkForDeepObjects) {
					return lodash.isEqual(value, predicate);
				}
				return predicate === value;
			});
			if (index === -1) return array;
			array.splice(index, 1);
		} else {
			// remove from end
			let indexes = array.map((predicate, index) => {
				if (checkForDeepObjects) {
					if (lodash.isEqual(value, predicate)) {
						return index;
					}
				}
				if (predicate === value) return index;
			});
			if (!indexes.length) return array;
			let lastIndex = indexes[indexes.length - 1];
			if (lastIndex === undefined) return array;
			array.splice(lastIndex, 1);
			return array;
		}
	} else {
		array = array.filter((ele) => {
			if (checkForDeepObjects) {
				return !lodash.isEqual(ele, value);
			}
			let areEqual = ele === value;
			return !areEqual;
		});
	}
	return array;
}

export function removeFromArrayAtIndex<T>(array: T[], index: number): T[] {
	array.splice(index, 1);
	return array;
}

export enum EArrayRearangeDirection {
	FORWARD,
	BACKWARDS,
}

export function moveElementInArrayOneIndex<T>(
	array: T[],
	value: T,
	direction: EArrayRearangeDirection
) {
	const index = array.indexOf(value);
	if (index === -1) {
		return false;
	}

	if (
		direction === EArrayRearangeDirection.FORWARD &&
		index !== array.length - 1
	) {
		array.splice(index, 1);
		array.splice(index + 1, 0, value);
		return true;
	}

	if (direction === EArrayRearangeDirection.BACKWARDS && index !== 0) {
		array.splice(index, 1);
		array.splice(index - 1, 0, value);
		return true;
	}

	return false;
}

export function moveElementInArrayWithIndexInArrayToOtherIndex<T>(
	array: T[],
	index: number,
	direction: EArrayRearangeDirection
) {
	if (index < 0 || index >= array.length) {
		return false;
	}

	if (
		direction === EArrayRearangeDirection.FORWARD &&
		index !== array.length - 1
	) {
		const element = array[index];
		array.splice(index, 1);
		array.splice(index + 1, 0, element);
		return true;
	}

	if (direction === EArrayRearangeDirection.BACKWARDS && index !== 0) {
		const element = array[index];
		array.splice(index, 1);
		array.splice(index - 1, 0, element);
		return true;
	}

	return false;
}

export function parseJSON(
	json: string | object | null | undefined
): object | string | boolean | null {
	if (typeof json === "object") {
		return json;
	}
	try {
		if (!isValidJSON(json)) {
			return null;
		} else {
			let jsonObj = json;

			while (typeof jsonObj === "string" && isValidJSON(jsonObj)) {
				jsonObj = JSON.parse(jsonObj);
			}
			// eslint-disable-next-line @typescript-eslint/ban-types
			if (jsonObj === undefined) {
				return null;
			}
			return jsonObj;
		}
	} catch (e) {
		console.error(e);
		return null;
	}
}

export function isValidJSON(json: string | object | null | undefined): boolean {
	if (json === null || json === undefined) return false;
	if (typeof json === "string" && IsJsonString(json)) {
		return true;
	}
	if (isJSON_Object(json)) {
		return true;
	}
	if (typeof json === "object") {
		return true;
	}
	return false;
}

export function isJSON_Object(data: unknown): boolean {
	if (typeof data === "object") {
		try {
			JSON.stringify(data);
			JSON.parse(JSON.stringify(data));
		} catch (e) {
			return false;
		}
		return true;
	}
	return false;
}

export function IsJsonString(str: string): boolean {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
}

export function isValidType<T>(object: any, type: T): object is T {
	return (
		typeof object === "object" &&
		object !== null &&
		typeof object === typeof type
	);
}

export function findDeeplyAndReturnPath<Obj extends object, T extends object>(
	obj: Obj,
	target: T,
	path: (string | number)[] = []
): (string | number)[] | null {
	debugger;
	for (let [key, value] of Object.entries(obj)) {
		if (obj.hasOwnProperty(key)) {
			if (value === target) {
				return [...path, key];
			} else {
				const found = findDeeplyAndReturnPath(value, target, [...path, key]);
				if (found) {
					return found;
				}
			}
		}
	}
	return null;
}

export function isObjectType(value: unknown): value is object {
	return typeof value === "object" && value !== null;
}

export function insertToArrayAtIndex<T>(
	array: Array<T>,
	value: T,
	index: number
) {
	array.splice(index, 0, value);
}

export function getSubarray<T>(
	array: T[],
	startIndex: number,
	endIndex: number
): T[] {
	if (startIndex < 0 || endIndex > array.length || startIndex >= endIndex) {
		throw new Error("Invalid start or end index");
	}

	return array.slice(startIndex, endIndex + 1);
}

export function getStringValueFromLocalStorage(valueKey: string): string {
	let value = window.localStorage.getItem(valueKey);
	return value ?? "";
}

export function getBooleanValueFromLocalStorage(
	valueKey: string,
	standardValue = false
): boolean {
	let value = window.localStorage.getItem(valueKey);
	let boolean = parseJSON(value);
	if (boolean === false) return false;
	if (boolean === true) return true;
	return standardValue;
}

export function getObjectValueFromLocalStorage(
	valueKey: string,
	standardValue = {}
): object {
	let value = window.localStorage.getItem(valueKey);
	let object = parseJSON(value);
	if (typeof object === "object" && object !== null) return object;
	return standardValue;
}

export function sortingFunctionStringsWithNumbers(
	a: string,
	b: string
): number {
	const rx: RegExp = /(\d+)|(\D+)/g;
	const rd: RegExp = /\d+/;
	const ra: RegExp = /\D+/;

	const aParts: string[] = String(a).match(rx) || [];
	const bParts: string[] = String(b).match(rx) || [];

	while (aParts.length && bParts.length) {
		const aPart: string = aParts.shift()!;
		const bPart: string = bParts.shift()!;

		if (rd.test(aPart) || rd.test(bPart)) {
			if (!rd.test(aPart)) return -1;
			if (!rd.test(bPart)) return 1;
			if (+aPart !== +bPart) return +aPart - +bPart;
		} else {
			if (aPart !== bPart) return aPart < bPart ? -1 : 1;
		}
	}
	return aParts.length - bParts.length;
}

export function getNextEntryOfArrayCycleThrough<T>(array: T[], value: T) {
	let currentIndex = array.indexOf(value);
	if (currentIndex == -1) {
		throw new Error("Value in array not found");
	}

	//next
	let nextIndex = currentIndex + 1;

	if (nextIndex > array.length - 1) {
		nextIndex = 0;
	}
	return array[nextIndex];
}

export function getPreviousEntryOfArrayCycleThrough<T>(array: T[], value: T) {
	let currentIndex = array.indexOf(value);
	if (currentIndex == -1) {
		throw new Error("Value in array not found");
	}

	//next
	let previous = currentIndex - 1;

	if (previous < 0) {
		previous = array.length - 1;
	}
	return array[previous];
}
