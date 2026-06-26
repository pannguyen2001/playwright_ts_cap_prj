import { type Page, type Locator, expect, TestInfo } from "@playwright/test";
import { FE_BASE_URL, timestamp } from "@/configs/constants";

// import { createLogger } from "@/utils/logger";
import { createLogger } from "@/utils/log4js";

const log = createLogger("BasePage");

export abstract class BasePage {
	readonly page: Page;
	readonly url: string;
	readonly logoutBtn: Locator;
	readonly testInfo: TestInfo;

	constructor(page: Page, testInfo?: TestInfo) {
		this.page = page;
		this.testInfo = testInfo;
		this.logoutBtn = page.getByRole("link", { name: "Đăng xuất" });
	}

	async goto(url: string): Promise<void> {
		log.info(
			`[${this.testInfo?.testId}][${this.testInfo?.project?.name}][${this.testInfo?.title}] Navigating to ${url}`,
		);
		await this.page.goto(url);
	}

	async reload() {
		await this.page.reload();
	}
	async screenshot(name: string) {
		await this.page.screenshot({
			path: `./screenshots/${timestamp()}_${name}.png`,
		});
	}

	async reocordVideo(name: string) {
		await this.page.video().saveAs(`./videos/${timestamp()}_${name}.webm`);
	}
	async waitForSelector(selector: string) {
		await this.page.waitForSelector(selector);
	}

	async waitForTimeout(timeout: number) {
		await this.page.waitForTimeout(timeout);
	}

	async logout() {
		await expect(this.logoutBtn).toBeVisible();
		await expect(this.logoutBtn).toBeEnabled();

		await this.logoutBtn.click();

		await this.page.waitForLoadState("networkidle");
		log.info(
			`[${this.testInfo?.testId}][${this.testInfo?.project?.name}][${this.testInfo?.title}] Logout complete`,
		);
	}

	async expectUrl(url: string): Promise<void> {
		await expect.soft(this.page).toHaveURL(url);
	}

	async isVisible(locator: Locator) {
		await expect(locator).toBeVisible();
	}
}
