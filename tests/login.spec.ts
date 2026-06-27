import { test, expect } from "@/fixtures/index";
import { FE_BASE_URL, PROJECT_NAME, OWNER } from "@/configs/constants";
import { setMetadata } from "@/utils/allure.helpers";
import { LoginTestCase } from "@/types/testcase.type";
import {
	negativeLoginTestCases,
	positiveLoginTestCases,
} from "@/testCases/login.testcase";
import { TestMetadata } from "@/types/common.type";
import logger from "@/utils/log4js";
import { createLogger } from "@/utils/log4js";

const log = createLogger("LoginSpec");

const LOGIN_URL = `${FE_BASE_URL}/login`;

const loginMetaData: TestMetadata = {
	projectName: PROJECT_NAME,
	description: "Test login page",
	feature: ["UI"],
	page: "LOGIN",
	owner: OWNER,
};

test.describe(`${loginMetaData.description} - POSITIVE`, () => {
	// ─── beforeAll: folder cleanup ──────────────────────────────────────────────
	// This stays the same — it's not fixture territory (no page/browser needed).
	test.use({ storageState: undefined });

	positiveLoginTestCases.forEach((testCase: LoginTestCase, index: number) => {
		test(
			testCase.testName,
			async (
				{
					// ── Destructure your fixtures ──────────────────────────────────────────
					//
					// Playwright reads these parameter names and matches them to the fixture
					// definitions in login.fixture.ts. No manual instantiation needed.
					//
					loginPage, // ← LoginPage POM, already constructed with an isolated page
					toast, // ← ToastComponent, already constructed
					goToLogin, // ← async function () => loginPage.goto(BASE_URL)
					browserName, // ← built-in Playwright fixture (string: "chromium" | "firefox" | "webkit")
				},
				TestInfo,
			) => {
				// ── Arrange ─────────────────────────────────────────────────────────────
				//
				// setMetadata is still a plain helper call — not fixture territory.
				setMetadata(loginMetaData, testCase, index);
				let testcaseLogInfo: string = `${TestInfo.testId} - ${TestInfo.project.name} - ${testCase.testName}`;
				log.info(`Starting test: ${testcaseLogInfo}`);

				// goToLogin is the fixture function we defined. Calling it navigates to BASE_URL.
				// This replaces: await loginPage.goto(BASE_URL)
				await goToLogin();

				// ── Browser filter ───────────────────────────────────────────────────────
				//
				// test.skip() with a condition: if this test isn't meant for this browser, skip it.
				// Must be called BEFORE any Act/Assert so Playwright registers the skip early.
				//
				const shouldRun =
					testCase.isAllBrowser || testCase.browserName?.includes(browserName);
				test.skip(
					!shouldRun,
					`Skipping "${testCase.testName}" on ${browserName}`,
				);

				// ── Act ──────────────────────────────────────────────────────────────────
				await loginPage.login(testCase.email, testCase.password);

				// ── Assert ───────────────────────────────────────────────────────────────
				if (testCase.additionalAction === "logout") {
					await loginPage.logout();
					await loginPage.expectUrl(LOGIN_URL);
				}

				if (testCase.expectedResult?.toast) {
					await toast.assertMessage(testCase.expectedResult?.toast);
				}

				log.info(`Test completed: ${testcaseLogInfo}`);

				// ── No manual context.close() needed ─────────────────────────────────────
				// The `isolatedPage` fixture teardown handles it automatically after `use()`.
			},
		);
	});
});
