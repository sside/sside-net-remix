import { customAlphabet } from "nanoid";

const NUMBER_CHARACTER = "1234567890";
const LOWER_CASE_ALPHABET_CHARACTERS = "abcdefghijklmnopqrstuvwxyz";
const UPPER_CASE_ALPHABET_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const ALPHABET_CHARACTERS = LOWER_CASE_ALPHABET_CHARACTERS + UPPER_CASE_ALPHABET_CHARACTERS;

const ATTRIBUTE_CHARACTERS = "-_" + NUMBER_CHARACTER + ALPHABET_CHARACTERS;

const DEFAULT_NANOID_SIZE = 16;

export const createUniqueAttribute = (prefix = ``, suffix = ``, size = DEFAULT_NANOID_SIZE): string => {
    return prefix + customAlphabet(ATTRIBUTE_CHARACTERS)(size) + suffix;
};
