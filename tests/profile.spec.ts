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
	page: "PROFILE",
	owner: OWNER,
};

const log = createLogger(METADATA.page);

test.use({
	role: "teacher",
});

test.describe(`${METADATA.description}`, () => {
	positiveProfileTestCases.forEach(
		(testCase: ProfileTestCase, index: number) => {
			test(
				testCase.testName,
				async ({ profilePage, toast, account }, TestInfo) => {
					// ── Arrange ─────────────────────────────────────────────────────────────
					//
					// setMetadata is still a plain helper call — not fixture territory.
					setMetadata(METADATA, testCase, index);
					let testcaseLogInfo: string = `${TestInfo.testId} - ${TestInfo.project.name} - ${testCase.testName} - ${testCase.testCaseType}`;
					log.info(`Starting test: ${testcaseLogInfo}`);
					

					await profilePage.goto(
						`${FE_BASE_URL}/profile/${account._id}`,
					);

					await expect(profilePage.page).toHaveURL(
						`${FE_BASE_URL}/profile/${account._id}`,
					);
					await profilePage.isVisible(profilePage.logoutBtn);
					await profilePage.logout();
					await profilePage.expectUrl(`${FE_BASE_URL}/login`);
				},
			);
		},
	);
});
