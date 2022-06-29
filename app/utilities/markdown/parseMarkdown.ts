import { isClientSide } from "../isClientSide";

const markdownParser = (isClientSide() ? require("safe-marked/lib/browser") : require("safe-marked")).createMarkdown();

export const parseMarkdown = (markdown: string): string => {
    return markdownParser(markdown);
};
