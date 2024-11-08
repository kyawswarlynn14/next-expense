
export type TUser = {
    _id: string;
    name: string;
    email: string;
    role: number;
    password?: string;
    createdAt: Date;
    updatedAt: Date;
}

export type TRegisterRes = {
    message: string;
    user: TUser;
}

export type TLoginRes = {
    message: string;
    accessToken: string;
    user: TUser;
}

export type TUpdatePasswordReq = {
    oldPassword: string;
    newPassword: string;
}

export type TUpdateRoleReq = {
    userId: string;
    role: number;
}

export type TCategory = {
    _id: string;
    user: string;
    title: string;
    description: string;
    type: string;
    t1?: string;
    t2?: string;
    t3?: string;
    createdAt: Date;
    updatedAt: Date;
}

export type TCreateCategoryRes = {
    message: string;
    category: TCategory;
}

export type TItem = {
    _id: string;
    user: string;
    category: TCategory;
	title: string;
	type: string;
	amount: number;
	remark: string;
    createdAt: Date;
    updatedAt: Date;
    t1?: string;
    t2?: string;
    t3?: string;
}

export type TCreateItemRes = {
    message: string;
    item: TItem;
}

export type TItemReq = {
    type: string;
    id?: string;
    item: {
        user: string;
        category: string;
        title: string;
        amount: number;
        remark: string;
        createdAt: Date;
        updatedAt: Date;
    };
}