"use client";

import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { MONTHS, YEARS } from "@/lib/services";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "@/store";
import { useGetItemsQuery } from "@/store/item/itemApi";
import { setYear } from "@/store/item/itemSlice";

const Report = () => {
	const dispatch = useDispatch();
	const { incomes, outcomes, year } = useSelector(
		(state: AppState) => state.item
	);
	const { isLoading: incomeLoading } = useGetItemsQuery({ type: "001", year });
	const { isLoading: outcomeLoading } = useGetItemsQuery({ type: "002", year });

	const getMonthName = (monthIndex: number) => {
		return MONTHS[monthIndex];
	};

	const initializeMonthlyData = () => {
		return Object.fromEntries(
			Array.from({ length: 12 }, (_, i) => [getMonthName(i), []])
		);
	};

	const groupedIncomes = incomes.reduce((acc: any, income) => {
		const monthName = getMonthName(new Date(income.createdAt).getMonth());
		acc[monthName].push(income);
		return acc;
	}, initializeMonthlyData());

	const groupedOutcomes = outcomes.reduce((acc: any, outcome) => {
		const monthName = getMonthName(new Date(outcome.createdAt).getMonth());
		acc[monthName].push(outcome);
		return acc;
	}, initializeMonthlyData());

	const totalIncome = Object.values(groupedIncomes)
		.flat()
		.reduce((total: number, income: any) => total + Number(income.amount), 0);

	const totalOutcome = Object.values(groupedOutcomes)
		.flat()
		.reduce((total: number, outcome: any) => total + Number(outcome.amount), 0);

	const totalRemaining = totalIncome - totalOutcome;

	return (
		<div className="w-[98%] md:w-[90%] lg:w-[80%]  mx-auto">
			<div className="py-4">
				<Select
					value={year.toString()}
					onValueChange={(value) => dispatch(setYear(parseInt(value)))}
				>
					<SelectTrigger className="w-[150px]">
						<SelectValue placeholder="Select year" />
					</SelectTrigger>
					<SelectContent className="w-[150px]">
						{YEARS.map((year) => (
							<SelectItem key={year} value={year.toString()}>
								{year}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<Table className="border border-slate-300 shadow-lg">
				<TableCaption>A list of report.</TableCaption>
				<TableHeader>
					<TableRow className="font-bold">
						<TableHead className="w-[25%]">Month</TableHead>
						<TableHead className="w-[25%]">Incomes</TableHead>
						<TableHead className="w-[25%]">Outcomes</TableHead>
						<TableHead className="w-[25%]">Difference</TableHead>
					</TableRow>
				</TableHeader>
				{incomeLoading || outcomeLoading ? (
					<TableBody>
						<TableRow>
							<TableCell></TableCell>
							<TableCell className="text-start font-bold py-2">
								Loading...
							</TableCell>
						</TableRow>
					</TableBody>
				) : (
					<TableBody>
						{Object.keys(initializeMonthlyData()).map((month) => {
							const monthlyIncome = groupedIncomes[month].reduce(
								(total: number, income: any) => total + Number(income.amount),
								0
							);
							const monthlyOutcome = groupedOutcomes[month].reduce(
								(total: number, outcome: any) => total + Number(outcome.amount),
								0
							);
							const monthlyDifference = monthlyIncome - monthlyOutcome;

							return (
								<TableRow key={month}>
									<TableCell className="font-medium">{month}</TableCell>
									<TableCell>{monthlyIncome.toLocaleString()} MMK</TableCell>
									<TableCell>{monthlyOutcome.toLocaleString()} MMK</TableCell>
									<TableCell>{monthlyDifference.toLocaleString()} MMK</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				)}
				<TableFooter>
					<TableRow className="font-bold">
						<TableCell>Total</TableCell>
						<TableCell>{totalIncome.toLocaleString()} MMK</TableCell>
						<TableCell>{totalOutcome.toLocaleString()} MMK</TableCell>
						<TableCell>{totalRemaining.toLocaleString()} MMK</TableCell>
					</TableRow>
				</TableFooter>
			</Table>
		</div>
	);
};

export default Report;
