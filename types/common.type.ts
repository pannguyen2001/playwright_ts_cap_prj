import {
	Priority,
	Feature,
	PROJECT_NAME,
	OWNER,
	TestPage,
} from "@/configs/constants";

export interface TestMetadata {
	feature: Feature[];
	page: TestPage;
	projectName?: string;
	description?: string;
	owner?: string;
	type?: string;
}

export type Role = "admin" | "student" | "teacher";

export type RoleConfig = {
	role: Role;
	credentials: { email: string; password: string };
};

export interface Account {
	_id: string;
	role_name: Role;
	full_name: string;
	email: string;
	password: string;
	date_of_birth: string;
	gender: "Nữ" | "Nam" | "Khác";
	is_deleted: boolean;
	accessToken: string;
	address: string;
	phone_number: string;
	avatar: string;
	status: string;
	messageFromSystem?: Array<string>;
	seenMessage?: Array<string>;
	created_on?: string;
	modified_on?: string;
	created_by?: string;
	modified_by?: string;
}
