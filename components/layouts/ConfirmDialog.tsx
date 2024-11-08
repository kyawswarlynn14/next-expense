"use cleint";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "../ui/alert-dialog";
import { MdDelete } from "react-icons/md";
import { Button } from "../ui/button";

export default function ConfirmDialog({fn}: {fn: () => void}) {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button className="w-full flex justify-between items-center gap-2">
					<span>Delete</span>
					<MdDelete cursor={"pointer"} size={22} color="red" />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent className="w-[90%] rounded-lg sm:max-w-[425px]">
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete your
						data from our servers.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={fn}>Continue</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}