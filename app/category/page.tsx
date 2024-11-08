"use client";

import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import ConfirmDialog from "@/components/layouts/ConfirmDialog";
import { toast } from "@/hooks/use-toast";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { CgMoreVerticalO } from "react-icons/cg";
import { useSelector } from "react-redux";
import { AppState } from "@/store";
import { useDeleteCategoryMutation, useGetCategoreisQuery } from "@/store/category/categoryApi";
import { useEffect } from "react";
import CategoryForm from "@/components/forms/CategoryForm";

const Category = () => {
	const { incomeCategories, outcomeCategories } = useSelector((state: AppState) => state.category);

    const { isLoading: incomeCatLoading, refetch } = useGetCategoreisQuery("001");
    const { isLoading: outcomeCatLoading, refetch: outcomeRefetch } = useGetCategoreisQuery("002");
    const [deleteCategory, { isLoading, isSuccess, error }] = useDeleteCategoryMutation();

    useEffect(() => {
        if(!isLoading && isSuccess) {
          toast({ description: "Deleted successfully!" });
          refetch();
          outcomeRefetch();
        }
        if(error) {
          toast({ variant: "destructive", description: (error as any)?.message || "Something went wrong!" });
                console.log("delete category error >>", error);
        }
      }, [isLoading, isSuccess, error]);

	return (
		<div className="w-[98%] md:w-[90%] lg:w-[80%]  mx-auto">
			<div className="py-4">
				<CategoryForm refetch={() => {
                    refetch();
                    outcomeRefetch();
                }} />
			</div>

			<Table className="border">
				<TableCaption>A list of expense categories.</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[30%] font-bold">Title</TableHead>
						<TableHead className="w-[20%] font-bold">Type</TableHead>
						<TableHead className="w-[40%] font-bold">Description</TableHead>
						<TableHead className="w-[10%] font-bold text-center">
							Action
						</TableHead>
					</TableRow>
				</TableHeader>
				{incomeCatLoading || outcomeCatLoading ? (
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
						{[...incomeCategories, ...outcomeCategories].map((i) => (
							<TableRow key={i._id}>
								<TableCell className="font-medium">{i.title}</TableCell>
								<TableCell className="font-medium">
									{i?.type === "001"
										? "Income"
										: i?.type === "002"
										? "Outcome"
										: "Unknown"}
								</TableCell>
								<TableCell>{i.description}</TableCell>
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
											<CategoryForm isUpdate={true} item={i} refetch={() => {
                                                refetch();
                                                outcomeRefetch();
                                            }} />
											<ConfirmDialog fn={() => deleteCategory(i._id)} />
										</PopoverContent>
									</Popover>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				)}
			</Table>
		</div>
	);
};

export default Category;
