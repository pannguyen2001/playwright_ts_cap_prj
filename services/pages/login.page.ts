// src/services/pages/login.page.ts
import { type Page, type Locator, expect, TestInfo } from "@playwright/test";
import logger from "@/utils/log4js";
import { BasePage } from "@/services/pages/base.page";

// import { createLogger } from "@/utils/logger";
import { createLogger } from "@/utils/log4js";

const log = createLogger("LoginPage");

export class LoginPage extends BasePage {
	readonly emailInput: Locator;
	readonly passwordInput: Locator;
	readonly loginButton: Locator;

	constructor(page: Page, testInfo?: TestInfo) {
		super(page, testInfo);
		this.emailInput = page.getByRole("textbox", { name: "Email" });
		this.passwordInput = page.getByRole("textbox", { name: "Mật khẩu" });
		this.loginButton = page.getByRole("button", { name: "Đăng nhập" });
	}

	// Actions
	async fillEmail(email: string): Promise<void> {
		await this.emailInput.fill(email);
	}

	async fillPassword(password: string): Promise<void> {
		await this.passwordInput.fill(password);
	}

	async clickLogin(): Promise<void> {
		await this.loginButton.click();
	}

	// Compound Actions
	async login(email: string, password: string): Promise<void> {
		// Don't log the actual password — mask it
		log.info(
			`[${this.testInfo?.testId}][${this.testInfo?.project?.name}][${this.testInfo?.title}] Logging in as "${email || "<empty>"}" / "${password ? "***" : "<empty>"}"`,
		);
		await this.fillEmail(email);
		await this.fillPassword(password);
		await this.clickLogin();
	}
}
