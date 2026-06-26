import { test, expect } from "@/fixtures/index";
import { FE_BASE_URL, PROJECT_NAME, OWNER } from "@/configs/constants";
import { setMetadata } from "@/utils/allure.helpers";
import { ProfileTestCase } from "@/types/testcase.type";
import { TestMetadata } from "@/types/common.type";
import { createLogger } from "@/utils/log4js";
import { positiveProfileTestCases } from "@/testCases/profile.testcase";

const METADATA: TestMetadata = {
	projectName: PROJECT_NAME,
	description: "Test login page",
	feature: ["UI"],
	page: "DASHBOARD",
	owner: OWNER,
};

const log = createLogger(METADATA.page);


test.describe(`${METADATA.description} - POSITIVE`, () => {
	// ─── beforeAll: folder cleanup ──────────────────────────────────────────────
	// This stays the same — it's not fixture territory (no page/browser needed).

	positiveProfileTestCases.forEach(
		(testCase: ProfileTestCase, index: number) => {
			test(testCase.testName, async ({ profilePage, toast, workerUserInfo }, TestInfo) => {
				// ── Arrange ─────────────────────────────────────────────────────────────
				// setMetadata is still a plain helper call — not fixture territory.
				setMetadata(METADATA, testCase, index);
				let testcaseLogInfo: string = `${TestInfo.testId} - ${TestInfo.project.name} - ${testCase.testName}`;
				log.info(`Starting test: ${testcaseLogInfo}`);

				// goToLogin is the fixture function we defined. Calling it navigates to BASE_URL.
				// This replaces: await loginPage.goto(BASE_URL)
				await profilePage.goto(
					`${FE_BASE_URL}/profile/${workerUserInfo._id}`
				);
				// console.log(
				// 	await profilePage.page.evaluate(() => ({
				// 		localStorage: {
				// 			accessToken: localStorage.getItem("accessToken"),
				// 			userId: localStorage.getItem("userId"),
				// 			full_name: localStorage.getItem("full_name"),
				// 		},
				// 		sessionStorage: Object.keys(sessionStorage),
				// 	}))
				// );
				await expect(profilePage.page).toHaveURL(`${FE_BASE_URL}/profile/${workerUserInfo._id}`);
				await profilePage.isVisible(profilePage.logoutBtn)
				await profilePage.logout();
				await profilePage.expectUrl(`${FE_BASE_URL}/login`);
			});
		},
	);
});
