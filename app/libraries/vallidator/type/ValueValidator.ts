type ValidationResult = true | string;
export type ValueValidator = (value: string) => ValidationResult;
export type ValuesValidator = (values: string[]) => ValidationResult;
