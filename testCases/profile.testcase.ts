import { FE_BASE_URL, EMAIL, PASSWORD, USER_NAME } from "@/configs/constants";
import { ProfileTestCase } from "@/types/testcase.type";

// Should isolate positive case and negative case
export const positiveProfileTestCases: ProfileTestCase[] = [
	{
		testName: "Check login profile successfully",
		description: "Login successfully and go to profile",
		email: EMAIL,
		password: PASSWORD,
		priority: "CRITICAL",
		isAllBrowser: true,
		testCaseType: "POSITIVE",
		expectedResult: {
			toast: "Đăng nhập thành công!",
		},
	},
];
