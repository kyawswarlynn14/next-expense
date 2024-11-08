"use cleint";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import React, { useEffect, useState } from "react";
import { DatePicker } from "../layouts/DatePicker";
import { BiSolidMessageSquareEdit } from "react-icons/bi";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { TItem } from "@/lib/types";
import { useSelector } from "react-redux";
import { AppState } from "@/store";
import { useCreateItemMutation, useGetItemsQuery, useUpdateItemMutation } from "@/store/item/itemApi";

export default function IncomeForm({
	isUpdate = false,
	item,
}: {
	isUpdate?: boolean;
	item?: TItem;
}) {
	const { user } = useSelector((state: AppState) => state.auth);
	const { year } = useSelector((state: AppState) => state.item);
	const { incomeCategories } = useSelector((state: AppState) => state.category);

	const initialValues = {
		user: user?._id || '',
		title: "",
		category: "",
		amount: 0,
		remark: "",
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	const [formData, setFormData] = useState(initialValues);
	const [open, setOpen] = useState(false);

	const { refetch } = useGetItemsQuery({ type: "001", year})
	const [createItem, {isLoading, isSuccess, error}] = useCreateItemMutation();
	const [updateItem, {isLoading: updateLoading, isSuccess: updateSuccess, error: updateError}] = useUpdateItemMutation();

	useEffect(() => {
		if (isUpdate && item) {
			setFormData({
				user: item._id,
                title: item.title,
				category: item.category._id,
                amount: item.amount,
                remark: item.remark,
                createdAt: item.createdAt,
                updatedAt: new Date(),
            });
		}
	}, [isUpdate, item]);

	useEffect(() => {
		if(!isLoading && isSuccess) {
		  	toast({ description: "Created successfully!" });
			setFormData(initialValues);
		  	refetch();
		}
		if(error) {
		  	toast({ variant: "destructive", description: (error as any)?.message || "Something went wrong!" });
			console.log("create income error >>", error);
		}
	}, [isLoading, isSuccess, error]);

	useEffect(() => {
		if(!updateLoading && updateSuccess) {
		  	toast({ description: "Updated successfully!" });
		  	refetch();
		}
		if(updateError) {
		  	toast({ variant: "destructive", description: (updateError as any)?.message || "Something went wrong!" });
			console.log("update income error >>", updateError);
		}
	}, [updateLoading, updateSuccess, updateError]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[id]: value,
		}));
	};

    const handleDateChange = (selectedDate: Date | undefined) => {
		if (selectedDate) {
			setFormData((prevData) => ({
				...prevData,
				createdAt: selectedDate,
			}));
		}
	};

	const handleSubmit = async () => {
		if (formData.title.trim() === "" || formData.amount < 0) {
			toast({ description: "Please enter valid data" });
			return;
		}

		if (isUpdate && item) {
			await updateItem({
				type: "001",
				id: item._id,
				item: formData
			})
		} else {
			await createItem({
				type: '001',
				item: formData,
			})
		}
		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{isUpdate ? (
					<Button onClick={() => setOpen(true)} className="w-full flex justify-between items-center gap-2">
						<span>Edit</span>
						<BiSolidMessageSquareEdit cursor={"pointer"} size={22} />
					</Button>
				) : (
					<Button size={"sm"} variant="default" onClick={() => setOpen(true)}>New</Button>
				)}
			</DialogTrigger>
			<DialogContent className="w-[90%] rounded-lg sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle className="text-center">{isUpdate ? "Edit" : "New"} Income</DialogTitle>
				</DialogHeader>

				<div className="grid gap-4 py-4">
				<div className="input-container">
						<Label htmlFor="category" className="text-left">
							Category
						</Label>
						<Select 
                        value={formData.category}
                        onValueChange={value => setFormData(prev => ({...prev, category: value}))}
                        >
							<SelectTrigger className="col-span-3">
								<SelectValue
									placeholder={ "Select a category"}
								/>
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectLabel>Categories</SelectLabel>
									    {incomeCategories.map((i) => (
											<SelectItem key={i._id} value={i._id}>
												{i.title}
											</SelectItem>
										))}
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>
					<div className="input-container">
						<Label htmlFor="title" className="text-left">
							Title
						</Label>
						<Input
							id="title"
							value={formData.title}
							onChange={handleChange}
							className="col-span-3"
						/>
					</div>
					<div className="input-container">
						<Label htmlFor="amount" className="text-left">
							Amount
						</Label>
						<Input
							id="amount"
							type="number"
							value={formData.amount}
							onChange={handleChange}
							className="col-span-3"
						/>
					</div>
					<div className="input-container">
						<Label htmlFor="remark" className="text-left">
							Remark
						</Label>
						<Input
							id="remark"
							value={formData.remark}
							onChange={handleChange}
							className="col-span-3"
						/>
					</div>
                    <div className="input-container">
						<Label htmlFor="createdAt" className="text-left">
							Created At
						</Label>
                        <div className="col-span-3">
                            <DatePicker 
                                date={formData.createdAt} 
                                setDate={handleDateChange} 
                            />
                        </div>
					</div>
				</div>
				<DialogFooter>
					<Button type="submit" disabled={isLoading || updateLoading} onClick={handleSubmit}>
						{isLoading || updateLoading ? "Saving..." : "Save"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}