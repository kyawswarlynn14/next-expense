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
import ConfirmDialog from "@/components/layouts/ConfirmDialog";
import { toast } from "@/hooks/use-toast";
import MonthYearPicker from "@/components/layouts/MonthYearPicker";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { TItem } from "@/lib/types";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { CgMoreVerticalO } from "react-icons/cg";
import { useSelector } from "react-redux";
import { AppState } from "@/store";
import { useDeleteItemMutation, useGetItemsQuery } from "@/store/item/itemApi";
import { displayDate } from "@/lib/services";
import IncomeForm from "@/components/forms/IncomeForm";
import IncomeDetail from "@/components/details/IncomeDetail";

const Income = () => {
	const date = new Date();
	const { year, incomes } = useSelector((state: AppState) => state.item);
	const { incomeCategories } = useSelector(
		(state: AppState) => state.category
	);

	const [month, setMonth] = useState(date.getMonth());
	const [showAll, setShowAll] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState("");
	const [filteredIncomes, setFilteredIncomes] = useState<TItem[]>([]);

	const { isLoading, refetch } = useGetItemsQuery({ type: "001", year });
	const [deleteIncome, { isLoading: deleteLoading, isSuccess, error }] =
		useDeleteItemMutation();

	useEffect(() => {
		if (showAll) {
			if (selectedCategory && selectedCategory !== "-") {
				setFilteredIncomes(
					incomes.filter(
						(income) => income.category._id === selectedCategory
					)
				);
			} else {
				setFilteredIncomes(incomes);
			}
		} else {
			const data =
				selectedCategory && selectedCategory !== "-"
					? incomes.filter((income) => {
						const incomeMonth = new Date(income.createdAt).getMonth();
						return (
							incomeMonth === month &&
							income.category._id === selectedCategory
						);
					})
					: incomes.filter((income) => {
						const incomeMonth = new Date(income.createdAt).getMonth();
						return incomeMonth === month;
					});
			setFilteredIncomes(data);
		}
	}, [selectedCategory, incomes, showAll, month, year]);

	useEffect(() => {
		if (!deleteLoading && isSuccess) {
			toast({ description: "Deleted successfully!" });
			refetch();
		}
		if (error) {
			toast({
				variant: "destructive",
				description: (error as any)?.message || "Something went wrong!",
			});
			console.log("delete income error >>", error);
		}
	}, [deleteLoading, isSuccess, error]);

	const totalAmount = filteredIncomes.reduce(
		(a, b) => a + Number(b.amount),
		0
	);

	return (
		<div className="w-[98%] md:w-[90%] lg:w-[80%]  mx-auto">
			<div className="pt-4 flex justify-between items-center">
				<IncomeForm />

				<div className="flex items-center gap-2">
					<Checkbox
						id="showAll"
						checked={showAll}
						onCheckedChange={() => setShowAll((prev) => !prev)}
					/>

					<label
						htmlFor="showAll"
						className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
					>
						Show all?
					</label>
				</div>
			</div>

			<div className="flex items-center justify-between gap-2 py-2">
				<Select
					value={selectedCategory}
					onValueChange={(value) => setSelectedCategory(value)}
				>
					<SelectTrigger className="w-[100px] md:w-[150px]">
						<SelectValue placeholder={"Categories"} />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectItem value={"-"}>All</SelectItem>
							{incomeCategories.map((i) => (
								<SelectItem key={i._id} value={i._id}>
									{i.title}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>

				{!showAll && <MonthYearPicker month={month} setMonth={setMonth} />}
			</div>

			<Table className="border border-slate-300 shadow-lg">
				<TableCaption>A list of incomes.</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[25%] font-bold">Title</TableHead>
						<TableHead className="w-[23%] font-bold">Amount</TableHead>
						<TableHead className="w-[20%] font-bold hidden md:flex items-center justify-center">
							Category
						</TableHead>
						<TableHead className="w-[22%] font-bold">Created At</TableHead>
						<TableHead className="w-[10%] font-bold text-center">
							Action
						</TableHead>
					</TableRow>
				</TableHeader>
				{isLoading ? (
					<TableBody>
						<TableRow>
							<TableCell></TableCell>
							<TableCell></TableCell>
							<TableCell className="text-start font-bold py-2">
								Loading...
							</TableCell>
						</TableRow>
					</TableBody>
				) : (
					<TableBody>
						{filteredIncomes.map((i) => (
                            <TableRow key={i._id}>
                                <TableCell className="font-medium">{i.title}</TableCell>
                                <TableCell>{Number(i.amount).toLocaleString()} MMK</TableCell>
                                <TableCell className="hidden md:block">
                                    {i.category.title}
                                </TableCell>
                                <TableCell>{displayDate(i.createdAt)}</TableCell>
                                <TableCell className="flex items-center justify-center gap-2">
                                    <Popover>
                                        <PopoverTrigger>
                                            <CgMoreVerticalO size={22} />
                                        </PopoverTrigger>
                                        <PopoverContent
                                            side="left"
                                            align="start"
                                            className="w-36 space-y-1"
                                        >
                                            <IncomeDetail item={i} />
                                            <IncomeForm isUpdate={true} item={i} />
                                            <ConfirmDialog
                                                fn={() => deleteIncome({ type: "001", id: i._id })}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>
						))}
					</TableBody>
				)}
				<TableFooter>
					<TableRow className="font-bold">
						<TableCell>Total</TableCell>
						<TableCell>{totalAmount.toLocaleString()} MMK</TableCell>
					</TableRow>
				</TableFooter>
			</Table>
		</div>
	);
};

export default Income;
