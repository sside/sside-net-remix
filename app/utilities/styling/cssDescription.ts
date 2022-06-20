import { LinkDescriptor } from "@remix-run/node";

export const cssDescription = (style: string): LinkDescriptor => ({
    rel: "stylesheet",
    href: style,
});

export const cssLinks = (...styles: string[]): LinkDescriptor[] =>
    styles.map((style) => ({
        rel: "stylesheet",
        href: style,
    }));
