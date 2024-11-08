"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { AppState } from "@/store";
import { useLoginMutation, useRegisterMutation } from "@/store/auth/authApi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

type Props = {
	isLogin: boolean;
};

const AuthForm: React.FC<Props> = ({ isLogin }) => {
	const router = useRouter();
	const { user } = useSelector((state: AppState) => state.auth);

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
	});
	const [login, { isLoading: loginLoading, isSuccess: loginSuccess, error: loginError}] = useLoginMutation();
	const [register, { isLoading: registerLoading, isSuccess: registerSuccess, error: registerError}] = useRegisterMutation();

	useEffect(() => {
		if (user && user.email) {
			router.push("/");
		}
	}, [user]);

	useEffect(() => {
		if (loginSuccess) {
			router.push("/");
			toast({ description: "Login successful!" });
		}
		if(loginError) {
			toast({
				variant: "destructive",
				description: (loginError as any)?.message || "Invalid credentials!",
			});
			console.log("login error >>", loginError)
		}
	}, [loginLoading, loginSuccess, loginError]);

	useEffect(() => {
		if (!registerLoading && registerSuccess) {
			toast({ description: "Register successful!" });
			router.push("/login");
		}
		if(registerError) {
			toast({
				variant: "destructive",
				description: (registerError as any)?.message || "Invalid credentials!",
			});
			console.log("register error >>", registerError)
		}
	}, [registerLoading, registerSuccess, registerError]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (formData.password.length < 6) {
			toast({ variant: "destructive", description: "Invalid Password!" });
			return;
		}

		if (isLogin) {
			await login({
				email: formData.email,
				password: formData.password,
			});
		} else {
			await register({
				name: formData.name,
				email: formData.email,
				password: formData.password,
			});
		}
	};

	if (!loginLoading && user) return null;

	return (
		<div className="w-full min-h-screen flex items-center justify-center">
			<Card className="w-[90%] max-w-sm mx-auto">
				<CardHeader>
					<CardTitle className="text-center font-bold text-xl">
						{isLogin ? "Login" : "Register"}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit}>
						{!isLogin && (
							<div className="mb-4">
								<Label htmlFor="name">Name</Label>
								<Input
									id="name"
									type="name"
									name="name"
									value={formData.name}
									onChange={handleChange}
									placeholder="Enter your name"
									className="mt-2"
									required
								/>
							</div>
						)}
						<div className="mb-4">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								placeholder="Enter your email"
								className="mt-2"
								required
							/>
						</div>
						<div className="mb-4">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								name="password"
								value={formData.password}
								onChange={handleChange}
								placeholder="Enter your password"
								className="mt-2"
								required
							/>
						</div>
						<Button type="submit" disabled={loginLoading || registerLoading} className="w-full disabled:cursor-not-allowed">
							{isLogin
								? loginLoading
									? "Login..."
									: "Login"
								: registerLoading
									? "Register..."
									: "Register"
							}
						</Button>
						<div className="w-full flex justify-between items-center mt-3">
							<span>
								{isLogin ? "Don't have an account?" : 'Already have an account?'}
							</span>
							<Link href={isLogin ? '/register' : '/login'} className="text-blue-600 underline">
								{isLogin ? "Register" : "Login"}
							</Link>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};

export default AuthForm;
