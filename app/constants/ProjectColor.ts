export const ProjectColor = {
    Primary: "blue",
    Danger: "red",
    Yellow: "yellow",
    Orange: "orange",
    Red: "red",
    Magenta: "magenta",
    Violet: "violet",
    Blue: "blue",
    Cyan: "cyan",
    Green: "green",
    Gray: "gray",
};
export type ProjectColor = typeof ProjectColor[keyof typeof ProjectColor];
