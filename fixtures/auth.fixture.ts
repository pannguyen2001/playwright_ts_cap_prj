import {
	test as baseTest,
	Browser,
	expect,
	request,
	WorkerInfo,
} from "@playwright/test";
import fs from "fs";
import path from "path";
import authData from "../playwright/.auth/user.json";
import { FE_BASE_URL } from "@/configs/constants";
import logger from "@/utils/log4js";
import { loginByApi } from "@/utils/auth.helper";
import { Account, Role, RoleConfig } from "@/types/common.type";

export * from "@playwright/test";


const ROLES: RoleConfig[] = Object.entries(authData).map(([_, value]) => ({
	role: value.role as Role,
	credentials: {
		email: value.email,
		password: value.password,
	},
}));

type RoleAuthMap = Record<Role, { storageStatePath: string; account: Account }>;

type WorkerFixtures = {
	workerStorageState: RoleAuthMap;
};

async function setupRoleAuth(
	browser: Browser,
	role: Role,
	credentials: { email: string; password: string },
	workerInfo: WorkerInfo,
): Promise<{ storageStatePath: string; accountBody: Account }> {
	const id = workerInfo.parallelIndex;
	const suffix =
		`${workerInfo.project.name}-${workerInfo.parallelIndex}`;

	const authPath = path.resolve(
		workerInfo.project.outputDir,
		`.auth/${role}Auth-${suffix}.json`,
	);
	const infoFile = path.resolve(
		workerInfo.project.outputDir,
		`.auth/${role}Info-${suffix}.json`,
	);

	const MAX_AGE_MS = 1000 * 60 * 30;

	if (
		fs.existsSync(authPath) &&
		fs.existsSync(infoFile)
	) {
		const stat = fs.statSync(authPath);
		if (Date.now() - stat.mtimeMs < MAX_AGE_MS) {
			logger.info(
				`Using cached auth for ${role}`
			);
			return {
				storageStatePath: authPath,
				accountBody: JSON.parse(
					fs.readFileSync(infoFile, "utf8")
				) as Account,
			};
		}
	}

	const apiContext = await request.newContext();
	const context = await browser.newContext();
	let accountBody: Account;
	try {
		accountBody = await loginByApi(apiContext, credentials);

		await context.addInitScript(
			({ token }) => {
				localStorage.setItem("accessToken", token);
			},
			{ token: accountBody.accessToken },
		);

		const page = await context.newPage();


		await page.goto(`${FE_BASE_URL}/login`);
		await page
			.getByRole("textbox", { name: "Email" })
			.fill(credentials.email);
		await page
			.getByRole("textbox", { name: "Mật khẩu" })
			.fill(credentials.password);
		await page.getByRole("button", { name: "Đăng nhập" }).click();

		await expect(
			page.getByRole("link", { name: "Đăng xuất" })
		).toBeVisible();


		fs.mkdirSync(path.dirname(authPath), { recursive: true });
		await context.storageState({ path: authPath });
		fs.writeFileSync(infoFile, JSON.stringify(accountBody, null, 2));

		logger.info(`Auth setup complete for ${role}, email ${credentials.email}, worker ${id}`);
	}
	catch (error) {
		logger.error(`Auth setup failed for ${role}, worker ${id}`, error);
		throw error;
	}
	finally {
		await apiContext.dispose();
		await context.close();
	}

	return { storageStatePath: authPath, accountBody };
}

export const authFixtures = baseTest.extend<
	{ role: Role; account: Account },
	WorkerFixtures
>({
	role: ["admin", { option: true }], // override via test.use({ role: "admin" })

	workerStorageState: [
		async ({ browser }, use, workerInfo) => {
			const results = {} as RoleAuthMap;


			for (const { role, credentials } of ROLES) {
				const { storageStatePath, accountBody } = await setupRoleAuth(
					browser,
					role,
					credentials,
					workerInfo,
				);

				results[role] = {
					storageStatePath: storageStatePath,
					account: accountBody,
				};
			}

			await use(results);
		},
		{ scope: "worker" },
	],

	storageState: async (
		{ workerStorageState, role },
		use
	) => {
		await use(
			workerStorageState[role].storageStatePath
		);
	},

	account: async (
		{ workerStorageState, role },
		use
	) => {
		await use(workerStorageState[role].account);
	},
});
