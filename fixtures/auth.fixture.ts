import { test as baseTest, expect, request } from "@playwright/test";
import fs from "fs";
import path from "path";
import authData from "../playwright/.auth/user.json";
import { BE_BASE_URL, FE_BASE_URL } from "@/configs/constants";
import logger from "@/utils/log4js";
import { loginByApi } from "@/utils/auth.helper";
import { Account } from "@/types/common.type";
import { error } from "console";

export * from "@playwright/test";

type WorkerFixtures = {
	workerStorageState: string;
	workerUserInfo: Account;
};

export const authFixtures = baseTest.extend<{}, WorkerFixtures>({
	storageState: ({ workerStorageState }, use) => use(workerStorageState),

	workerUserInfo: [
		async ({ }, use, workerInfo) => {
			const id = workerInfo.parallelIndex;
			const userFile = path.resolve(
				workerInfo.project.outputDir,
				`.auth/${id}-user.json`,
			);

			const user = JSON.parse(
				fs.readFileSync(userFile, "utf8"),
			);

			await use(user);
		},
		{ scope: "worker" },
	],
	workerStorageState: [
		async ({ browser }, use, workerInfo) => {
			const id = workerInfo.parallelIndex;
			const fileName = path.resolve(
				workerInfo.project.outputDir,
				`.auth/${id}.json`,
			);
			const userFile = path.resolve(
				workerInfo.project.outputDir,
				`.auth/${id}-user.json`,
			);

			// if (fs.existsSync(fileName) && fs.existsSync(userFile)) {
			// 	await use(fileName);
			// 	return;
			// }

			const apiContext = await request.newContext();
			let body;
			try {
				body = await loginByApi(apiContext, {
					email: authData.admin.email,
					password: authData.admin.password,
				});
			} finally {
				await apiContext.dispose();
			}

			const context = await browser.newContext();
			await context.addInitScript(
				({ token, user }) => {

					localStorage.setItem("accessToken", token);

					sessionStorage.setItem(
						"persist:root",
						JSON.stringify({
							login: JSON.stringify({
								login: {
									currentUser: user,
									isLoggedIn: true,
									isFetching: false,
									error: false,
								}
							}),
							_persist: JSON.stringify({
								version: 1,
								rehydrated: true
							})
						})
					);

				},
				{
					token: body.accessToken,
					user: body,
				}
			);

			try {
				const page = await context.newPage();

				await page.goto(`${FE_BASE_URL}/login`);
				await page
					.getByRole("textbox", { name: "Email" })
					.fill(authData.admin.email);
				await page
					.getByRole("textbox", { name: "Mật khẩu" })
					.fill(authData.admin.password);
				await page.getByRole("button", { name: "Đăng nhập" }).click();

				await expect(
					page.getByRole("link", { name: "Đăng xuất" })
				).toBeVisible();

				fs.mkdirSync(path.dirname(fileName), { recursive: true });
				await context.storageState({ path: fileName });
				fs.writeFileSync(userFile, JSON.stringify(body, null, 2));

				logger.info(`Auth setup complete for worker ${id}`);

				await use(fileName);
			}
			catch (error) {
				logger.error(`Auth setup failed for worker ${id}`, error);
			}
			finally {
				await context.close();
			}
		},
		{ scope: "worker" },
	],
});