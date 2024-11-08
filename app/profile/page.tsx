"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { AppState } from "@/store";
import { userLoggedOut } from "@/store/auth/authSlice";
import {
	useUpdateUserInfoMutation,
	useUpdateUserPasswordMutation,
} from "@/store/user/userApi";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoLogOut } from 'react-icons/io5'

export default function Profile() {
    const dispatch = useDispatch();
	const { user } = useSelector((state: AppState) => state.auth);
    const [ userInfo, setUserInfo ] = useState({
        name: user?.name || "",
        email: user?.email || "",
    })

    const [ userPwd, setUserPwd ] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    })

	const [updateUserInfo, { isLoading, isSuccess, error }] =
		useUpdateUserInfoMutation();
	const [
		updateUserPassword,
		{ isLoading: pwdLoading, isSuccess: pwdSuccess, error: pwdError },
	] = useUpdateUserPasswordMutation();

    useEffect(() => {
		if (isSuccess) {
			toast({ description: "Updated info successfully!" });
		}
		if(error) {
			toast({
				variant: "destructive",
				description: (error as any)?.data?.message || "Something went wrong!",
			});
			console.log("update info error >>", error)
		}
	}, [isLoading, isSuccess, error]);

    useEffect(() => {
		if (pwdSuccess) {
			toast({ description: "Updated password successfully!" });
            setUserPwd({ newPassword: "", oldPassword: "", confirmPassword: ""})
		}
		if(pwdError) {
			toast({
				variant: "destructive",
				description: (pwdError as any)?.data?.message || "Something went wrong!",
			});
			console.log("update info error >>", pwdError)
		}
	}, [pwdLoading, pwdSuccess, pwdError]);

    const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target;
		setUserInfo((prevData) => ({
			...prevData,
			[id]: value,
		}));
	};

    const handleInfoSubmit = async () => {
        if(userInfo.name.trim() === "" || userInfo.email.trim() === "") {
            toast({
                variant: "destructive",
                description: "Please enter name and email!"
            });
            return;
        }
        await updateUserInfo(userInfo);
    }

    const handlePwdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target;
		setUserPwd((prevData) => ({
			...prevData,
			[id]: value,
		}));
	};

    const handlePwdSubmit = async () => {
        if(userPwd.oldPassword.trim() === "" || userPwd.newPassword.trim() === "" || userPwd.confirmPassword.trim() === "") {
            toast({
                variant: "destructive",
                description: "Please enter all fields!"
            });
            return;
        } else if (userPwd.oldPassword.length < 6 || userPwd.newPassword.length < 6 || userPwd.confirmPassword.length < 6) {
            toast({
                variant: "destructive",
                description: "Password must be atleast 6 characters!"
            });
            return;
        } else if (userPwd.newPassword !== userPwd.confirmPassword) {
            toast({
                variant: "destructive",
                description: "Passwords do not match!"
            });
            return;
        }
        await updateUserPassword({
            newPassword: userPwd.newPassword,
            oldPassword: userPwd.oldPassword,
        })
    }

    const handleSignout = () => {
        try {
            toast({description: "Sign out successfully!" });
            dispatch(userLoggedOut());
        } catch (error: any) {
            toast({ variant: "destructive", description: error?.message ||"Something went wrong!" });
        }
	}

	return (
        <div className="w-full px-2 py-4 md:pt-6 flex flex-col items-center justify-center">
            <Tabs defaultValue="account" className="w-full max-w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="password">Password</TabsTrigger>
                </TabsList>
                <TabsContent value="account">
                    <Card>
                        <CardHeader>
                            <CardTitle>Account</CardTitle>
                            <CardDescription>
                                Make changes to your account here. Click save when you're done.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" value={userInfo.name} onChange={handleInfoChange} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" value={userInfo.email} onChange={handleInfoChange} />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" disabled={isLoading} onClick={handleInfoSubmit}>
                                {isLoading ? "Saving.." : "Save"}
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="password">
                    <Card>
                        <CardHeader>
                            <CardTitle>Password</CardTitle>
                            <CardDescription>
                                Change your password here. After saving, you'll be logged out.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="oldPassword">Current password</Label>
                                <Input id="oldPassword" type="password" value={userPwd.oldPassword} onChange={handlePwdChange} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="newPassword">New password</Label>
                                <Input id="newPassword" type="password" value={userPwd.newPassword} onChange={handlePwdChange} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="confirmPassword">Confirm password</Label>
                                <Input id="confirmPassword" type="password" value={userPwd.confirmPassword} onChange={handlePwdChange} />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" disabled={pwdLoading} onClick={handlePwdSubmit}>
                                {pwdLoading ? "Saving.." : "Save"}
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>

            <Button
                variant={"destructive"}
                onClick={handleSignout}
                className="flex items-center gap-2 w-40 mt-4"
            >
                <span className="hidden md:block">Logout</span>
                <IoLogOut />
            </Button>
        </div>
	);
}
