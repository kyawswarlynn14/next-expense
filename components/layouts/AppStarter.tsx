"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useEffect, useRef } from "react";
import { FaArrowsDownToLine, FaTableList } from "react-icons/fa6";
import { GiExpense } from "react-icons/gi";
import { BiSolidCategory } from "react-icons/bi";
import { IoLogOut } from "react-icons/io5";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "@/store";
import { useLoadUserQuery } from "@/store/apiSlice";
import { userLoggedOut } from "@/store/auth/authSlice";
import { useGetCategoreisQuery } from "@/store/category/categoryApi";
import { useGetItemsQuery } from "@/store/item/itemApi";

const AppStarter = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
	const pathname = usePathname();
	const router = useRouter();
    const dispatch = useDispatch();
	const { user } = useSelector((state: AppState) => state.auth);
	const { year } = useSelector((state: AppState) => state.item);
    const { isLoading, error } = useLoadUserQuery();
    const { isLoading: incomeCatLoading } = useGetCategoreisQuery("001");
    const { isLoading: outcomeCatLoading } = useGetCategoreisQuery("002");
    const { refetch: incomeRefetch } = useGetItemsQuery({ type: "001", year});
    const { refetch: outcomeRefetch } = useGetItemsQuery({ type: "002", year});

	const isFirstRender = useRef(true);

	useEffect(()=>{
        if(!isLoading && (!user || error) && pathname !== '/register') {
            router.push('/login');
        }
    }, [isLoading, user]);

	useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
        } else {
            incomeRefetch();
            outcomeRefetch();
        }
    }, [year]);

	const handleSignout = () => {
        try {
            toast({description: "Sign out successfully!" });
            dispatch(userLoggedOut());
        } catch (error: any) {
            toast({ variant: "destructive", description: error?.message ||"Something went wrong!" });
        }
	}

	return (
		<div className="w-full min-h-screen ">
			{isLoading || incomeCatLoading || outcomeCatLoading ? (
				<p className="font-bold h-screen flex items-center justify-center">
					Checking...
				</p>
			) : (
				<>
					{(pathname !== '/login' && pathname !== '/register') && (
						<nav className="w-[80%] md:w-[70%] bg-slate-200 mx-auto shadow-lg px-4 py-2 flex justify-around rounded-b-lg">
							<NavButton
								title="Expense"
								link="/"
								icon={<GiExpense />}
							/>
							<NavButton
								title="Income"
								link="/income"
								icon={<FaArrowsDownToLine />}
							/>
							<NavButton
								title="Report"
								link="/report"
								icon={<FaTableList />}
							/>
							<NavButton
								title="Category"
								link="/category"
								icon={<BiSolidCategory />}
							/>
							<Button
								variant={"outline"}
								onClick={handleSignout}
								className="flex items-center gap-2"
							>
								<span className="hidden md:block">Logout</span>
								<IoLogOut />
							</Button>
						</nav>
					)}
					<div>
						{children}
					</div>
				</>
			)}
		</div>
	);
};

function NavButton({
	title,
	link,
	icon,
}: {
	title: string;
	link: string;
	icon: JSX.Element;
}) {
	const pathname = usePathname();
	const router = useRouter();

	return (
		<Button
			variant={pathname == link ? "default" : "outline"}
			onClick={() => router.push(link)}
            className="flex items-center gap-2"
		>
			<span className="hidden md:block">{title}</span> {icon}
		</Button>
	);
}

export default AppStarter;