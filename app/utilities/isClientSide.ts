export const isClientSide = (): boolean => {
    return typeof window !== "undefined" && typeof window.navigator !== "undefined" && typeof document !== "undefined";
};
