import { format } from "date-fns";

export const YEARS: number[] = [];
for (let i = 2020; i <= 2030; i++) {
	YEARS.push(i);
}

export const MONTHS = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

export function displayDate(date: Date) {
	return format(date, "dd-MM-yyyy");
}