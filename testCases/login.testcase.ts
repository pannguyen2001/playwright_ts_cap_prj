import { FE_BASE_URL, PASSWORD, EMAIL } from "@/configs/constants";
import { LoginTestCase } from "@/types/testcase.type";

// Should isolate positive case and negative case
export const positiveLoginTestCases: LoginTestCase[] = [
	{
		testName: "Login with correct user name and password",
		description: "Successful login with valid credentials",
		email: EMAIL,
		password: PASSWORD,
		role: "admin",
		priority: "CRITICAL",
		isAllBrowser: true,
		testCaseType: "POSITIVE",
		expectedResult: {
			// url: FE_BASE_URL,
			toast: "Đăng nhập thành công!",
		},
	},
	{
		testName: "Logout successfully",
		description: "User can logout and return to login page",
		email: EMAIL,
		password: PASSWORD,
		priority: "CRITICAL",
		role: "admin",
		isAllBrowser: true,
		additionalAction: "logout",
		testCaseType: "POSITIVE",
		expectedResult: {
			url: `${FE_BASE_URL}/login`,
		},
	},
];

export const negativeLoginTestCases: LoginTestCase[] = [
	{
		testName: "Login with incorrect user name",
		description: "Login fails with invalid email",
		email: "abc",
		password: PASSWORD,
		priority: "CRITICAL",
		role: "admin",
		isAllBrowser: true,
		testCaseType: "NEGATIVE",
		expectedResult: {
			url: "https://hrm.anhtester.com",
			toast: "Invalid Login Credentials.",
		},
	},
	{
		testName: "Login with incorrect password",
		description: "Login fails with invalid password",
		email: EMAIL,
		password: "abcdefghi",
		priority: "CRITICAL",
		role: "admin",
		isAllBrowser: true,
		testCaseType: "NEGATIVE",
		expectedResult: {
			url: "https://hrm.anhtester.com",
			toast: "Invalid Login Credentials.",
		},
	},
	{
		testName: "Login with password does not meet min length.",
		description: "Login fails with password length less than 6 characters.",
		email: EMAIL,
		password: "abc",
		priority: "CRITICAL",
		role: "admin",
		isAllBrowser: true,
		testCaseType: "NEGATIVE",
		expectedResult: {
			url: "https://hrm.anhtester.com",
			toast: "Your password is too short, minimum 6 characters required.",
		},
	},
	{
		testName: "Login with empty user name",
		description: "Login fails when email is empty",
		email: "",
		password: PASSWORD,
		priority: "CRITICAL",
		role: "admin",
		isAllBrowser: true,
		testCaseType: "NEGATIVE",
		expectedResult: {
			url: "https://hrm.anhtester.com",
			toast: "The email field is required.",
		},
	},
	{
		testName: "Login with empty password",
		description: "Login fails when password is empty",
		email: EMAIL,
		password: "",
		role: "admin",
		priority: "CRITICAL",
		isAllBrowser: true,
		testCaseType: "NEGATIVE",
		expectedResult: {
			url: "https://hrm.anhtester.com",
			toast: "The password field is required.",
		},
	},
	{
		testName: "Login with empty user name and password",
		description: "Login fails when both fields are empty",
		email: "",
		password: "",
		priority: "CRITICAL",
		role: "admin",
		isAllBrowser: true,
		testCaseType: "NEGATIVE",
		expectedResult: {
			url: "https://hrm.anhtester.com",
			toast: "The email field is required.",
		},
	},
	{
		testName: "Login with both incorrect user name and password",
		description: "Login fails with completely invalid credentials",
		email: "abcdef123",
		password: "abcdef",
		priority: "CRITICAL",
		role: "admin",
		isAllBrowser: true,
		testCaseType: "NEGATIVE",
		expectedResult: {
			url: "https://hrm.anhtester.com",
			toast: "Invalid Login Credentials.",
		},
	},
];
