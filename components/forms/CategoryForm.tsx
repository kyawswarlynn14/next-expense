"use client";

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
import { BiSolidMessageSquareEdit } from "react-icons/bi";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { TCategory } from "@/lib/types";
import { useSelector } from "react-redux";
import { AppState } from "@/store";
import { useCreateCategoryMutation, useUpdateCategoryMutation } from "@/store/category/categoryApi";

export default function CategoryForm({ 
	isUpdate = false,
	item,
    refetch,
}: { 
	isUpdate?: boolean,
	item?: TCategory,
    refetch: () => void,
}) {
	const { user } = useSelector((state: AppState) => state.auth);
	const initialValues = {
		user: user?._id || '',
		title: "",
		type: "",
		description: "",
	};
	const [formData, setFormData] = useState(initialValues);
	const [open, setOpen] = useState(false);

    const [createCategory, {isLoading, isSuccess, error}] = useCreateCategoryMutation();
    const [updateCategory, {isLoading: updateLoading, isSuccess: updateSuccess, error: updateError}] = useUpdateCategoryMutation();

	useEffect(() => {
		if(isUpdate && item) {
			setFormData({
				user: item.user,
				type: item.type,
				title: item.title,
				description: item.description,
			});
		}
	}, [isUpdate, item])

    useEffect(() => {
		if(!isLoading && isSuccess) {
		  	toast({ description: "Created successfully!" });
			setFormData(initialValues);
		  	refetch();
		}
		if(error) {
		  	toast({ variant: "destructive", description: (error as any)?.message || "Something went wrong!" });
			console.log("create category error >>", error);
		}
	}, [isLoading, isSuccess, error]);

	useEffect(() => {
		if(!updateLoading && updateSuccess) {
		  	toast({ description: "Updated successfully!" });
		  	refetch();
		}
		if(updateError) {
		  	toast({ variant: "destructive", description: (updateError as any)?.message || "Something went wrong!" });
			console.log("update category error >>", updateError);
		}
	}, [updateLoading, updateSuccess, updateError]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[id]: value,
		}));
	};

	const handleSubmit = async () => {
		if (formData.title.trim() === "") {
			toast({ description: "Please enter a valid category title" });
			return;
		}
		if(isUpdate && item) {
			await updateCategory({
                _id: item._id,
                ...formData
            })
		} else {
			await createCategory(formData)
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
					<DialogTitle className="text-center">{isUpdate ? "Edit" : "New"} Category</DialogTitle>
				</DialogHeader>

				<div className="grid gap-4 py-4">
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
						<Label htmlFor="type" className="text-left">
							Type
						</Label>
						<Select 
                        value={formData.type}
                        onValueChange={value => setFormData(prev => ({...prev, type: value}))}
                        >
							<SelectTrigger className="col-span-3">
								<SelectValue
									placeholder={"Select a type"}
								/>
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectLabel>Types</SelectLabel>
										<SelectItem value={"001"}>
											Income
										</SelectItem>
										<SelectItem value={"002"}>
											Outcome
										</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>
					<div className="input-container">
						<Label htmlFor="description" className="text-left">
							Description
						</Label>
						<Input
							id="description"
							value={formData.description}
							onChange={handleChange}
							className="col-span-3"
						/>
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