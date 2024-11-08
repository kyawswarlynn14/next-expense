"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { FaArrowsDownToLine, FaTableList } from "react-icons/fa6";
import { GiExpense } from "react-icons/gi";
import { BiSolidCategory } from "react-icons/bi";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { AppState } from "@/store";
import { useLoadUserQuery } from "@/store/apiSlice";
import { useGetCategoreisQuery } from "@/store/category/categoryApi";
import { useGetItemsQuery } from "@/store/item/itemApi";
import { CgProfile } from "react-icons/cg";

const AppStarter = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
	const pathname = usePathname();
	const router = useRouter();
	const { user } = useSelector((state: AppState) => state.auth);
	const { year } = useSelector((state: AppState) => state.item);
    const { isLoading, isSuccess, error, data } = useLoadUserQuery();
    const { isLoading: incomeCatLoading, refetch: incomeCatRefetch } = useGetCategoreisQuery("001");
    const { isLoading: outcomeCatLoading, refetch: outcomeCatRefetch } = useGetCategoreisQuery("002");
    const { refetch: incomeRefetch } = useGetItemsQuery({ type: "001", year});
    const { refetch: outcomeRefetch } = useGetItemsQuery({ type: "002", year});

	const isFirstRender = useRef(true);
	const [loading, setLoading] = useState(true);

	useEffect(()=>{
        if(!isLoading && isSuccess && data) {
			setLoading(false);
		}
		if (error) {
			setLoading(false);
		}
    }, [isSuccess, user, error, isLoading, data]);

	useEffect(() => {
        if(!loading && !(user?._id) && pathname !== '/register') {
			router.push('/login')
		}
    }, [user, loading]);

	useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
        } else {
			incomeCatRefetch();
            outcomeCatRefetch();
            incomeRefetch();
            outcomeRefetch();
        }
    }, [year, user]);

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

							<NavButton
								title="Profile"
								link="/profile"
								icon={<CgProfile />}
							/>
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