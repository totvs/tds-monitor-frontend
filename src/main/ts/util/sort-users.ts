import { SortOrder } from "../monitor-user-list-column-header";
import { MonitorUserRow } from "../monitor-user-list";

const sortNumber = (a: number, b: number) => a - b;
const sortString = (a: string, b: string) => {
	var valueA = a.toUpperCase();
	var valueB = b.toUpperCase();

	if (valueA < valueB)
		return -1;

	if (valueA > valueB)
		return 1;

	return 0;
};

export function sortUsers(column: ColumnKey, order: SortOrder) {
	return (a: MonitorUserRow, b: MonitorUserRow) => {
		let result = 0;
		const valueA = a[column],
			valueB = b[column];

		if ((typeof valueA === 'number') && (typeof valueB === 'number')) {
			result = sortNumber(valueA, valueB);
		}
		else {
			result = sortString(valueA as string, valueB as string);
		}

		if (order === SortOrder.Ascending)
			return -result;

		return result
	};
}
