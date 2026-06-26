import moment from "moment-timezone";
const { loadEnvFile } = require("node:process");

// Loads environment variables from the default .env file
loadEnvFile();

const USER_NAME: string | undefined = process.env.USER_NAME;
const PASSWORD: string | undefined = process.env.PASSWORD;
const EMAIL: string | undefined = process.env.EMAIL;
const LOG_FOLDER_PATH: string | undefined = process.env.LOG_FOLDER_PATH;
const DATE_TIME_FORMAT: string = "YYYY-MM-DD HH:mm:ss";
const DATE_FORMAT: string = "YYYY-MM-DD";
const PROJECT_NAME: string | undefined = process.env.PROJECT_NAME;
const OWNER: string | undefined = process.env.OWNER;
const BE_BASE_URL: string = process.env.BE_BASE_URL;
const FE_BASE_URL: string = process.env.FE_BASE_URL;

enum PriorityEnum {
	CRITICAL = "critical",
	MAJOR = "major",
	NORMAL = "normal",
	MINOR = "minor",
}
type Priority = keyof typeof PriorityEnum;

enum FeatureEnum {
	UI = "UI",
	API = "API",
	FUNCTIONALITY = "FUNCTIONALITY",
	NON_FUNCTIONALITY = "NON_FUNCTIONALITY",
}
type Feature = keyof typeof FeatureEnum;

enum BrowserEnum {
	CHROME = "chrome",
	FIREFOX = "firefox",
	EDGE = "edge",
	WEBKIT = "webkit",
}
type Browser = keyof typeof BrowserEnum;

enum TestPageEnum {
	LOGIN = "login",
	DASHBOARD = "dashboard",
}
type TestPage = keyof typeof TestPageEnum;

enum TestcaseTypeEnum {
	POSITIVE = "positive",
	NEGATIVE = "negative",
}

type TestcaseType = keyof typeof TestcaseTypeEnum;

export {
	USER_NAME,
	PASSWORD,
	EMAIL,
	LOG_FOLDER_PATH,
	DATE_FORMAT,
	DATE_TIME_FORMAT,
	PROJECT_NAME,
	OWNER,
	BE_BASE_URL,
	FE_BASE_URL,
	PriorityEnum,
	Priority,
	FeatureEnum,
	Feature,
	BrowserEnum,
	Browser,
	TestPageEnum,
	TestPage,
	TestcaseTypeEnum,
	TestcaseType,
};

export function timestamp(): string {
	return moment
		.tz(new Date(), "Asia/Ho_Chi_Minh")
		.format("YYYY-MM-DD HH-mm-ss");
}
