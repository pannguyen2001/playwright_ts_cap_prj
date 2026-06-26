// ─── Core imports ────────────────────────────────────────────────────────────
import {
	test as base,
	expect,
	type Page,
	type BrowserContext,
	type TestInfo,
} from "@playwright/test";
import { ProfilePage } from "@/services/pages/profile.page";
import ToastComponent from "@/services/components/toast.component";

// ─── 1. Define the shape of your custom fixtures ─────────────────────────────
//
// This is a plain TypeScript interface. It tells Playwright (and your IDE)
// what new properties will be available inside test({ page, ... }).
//
// Think of it as the "contract" for your fixture.
//
export interface ProfileFixtures {
	profilePage: ProfilePage;
	toast: ToastComponent;
}

export const profileFixtures = base.extend<ProfileFixtures>({
	profilePage: async ({ page }, use, testInfo) => {
		await use(new ProfilePage(page, testInfo));
	},
	toast: async ({ page }, use) => {
		await use(new ToastComponent(page));
	},
});
