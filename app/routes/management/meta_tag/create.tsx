import { ActionFunction } from "@remix-run/node";

export class CreateNewMetaTagRequest {
    constructor(readonly metaTagName: string) {}
}

export const action: ActionFunction = async ({ request }) => {};
