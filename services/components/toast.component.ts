// components/toast.component.ts

import test, { expect, Locator, Page } from "@playwright/test";

class ToastComponent {
	readonly page: Page;
	readonly toast: Locator;
	constructor(page: Page) {
		this.page = page;
		this.toast = page.locator("div.Toastify__toast-body:visible");
	}

	async assertMessage(message: string): Promise<void> {
		await expect(this.toast.getByText(message, { exact: true })).toBeVisible();
	}
}

export default ToastComponent;
