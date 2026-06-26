// helpers/auth.helper.ts

import { APIRequestContext } from "@playwright/test";
import authData from "../playwright/.auth/user.json";
import { BE_BASE_URL } from "@/configs/constants";

export async function loginByApi(
    request: APIRequestContext,
    form: { email: string; password: string }
) {
    const response = await request.post(
        `${BE_BASE_URL}/api/auth/login`,
        {
            form: form
        },
    );

    return response.json();
}
