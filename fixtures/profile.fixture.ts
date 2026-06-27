// ─── Core imports ────────────────────────────────────────────────────────────
import {
	test as base,
	expect,
	type Page,
	type BrowserContext,
	type TestInfo,
} from "@playwright/test";
import { ProfilePage, TeacherProfilePage } from "@/services/pages/profile.page";
import ToastComponent from "@/services/components/toast.component";


export interface ProfileFixtures {
	profilePage: ProfilePage;
	toast: ToastComponent;
	teacherProfilePage: TeacherProfilePage;
}

export const profileFixtures = base.extend<ProfileFixtures>({
	profilePage: async ({ page }, use, testInfo) => {
		await use(new ProfilePage(page, testInfo));
	},

	toast: async ({ page }, use) => {
		await use(new ToastComponent(page));
	},

	teacherProfilePage: async ({ page }, use, testInfo) => {
		await use(new ProfilePage(page, testInfo));
	},
});
