import { LinksFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { FC, Fragment } from "react";
import { PathUrl } from "../../../constants/paths/PathUrl";
import { isValidMonth } from "../../../libraries/vallidator/isValidMonth";
import { isValidYear } from "../../../libraries/vallidator/isValidYear";
import { cssLinks } from "../../../utilities/styling/cssLinkDescriptor";
import { BaseMenuSection } from "./BaseMenuSection";
import styles from "./MenuSectionArchives.css";

export const links: LinksFunction = () => cssLinks(styles);

type Year = `${1 | 2}${number}${number}${number}`;
type Month = "01" | "02" | "03" | "04" | "05" | "06" | "07" | "08" | "09" | "10" | "11" | "12";
export type YearMonthFormat = `${Year}-${Month}`;

interface Props {
    yearMonths: YearMonthFormat[];
}

export const MenuSectionArchives: FC<Props> = ({ yearMonths }) => {
    const isValidYearMonth = (yearMonth: YearMonthFormat): boolean => {
        const [year, month] = yearMonth.split("-").map((value) => parseInt(value, 10));
        return isValidMonth(month) && isValidYear(year);
    };

    const sortedYearMonths = Array.from(new Set(yearMonths)).filter(isValidYearMonth).sort().reverse();
    const uniqueYearMonths: Map<number, number[]> = new Map();
    for (const yearMonth of sortedYearMonths) {
        const [year, month] = yearMonth.split("-").map((value) => parseInt(value, 10));
        const existMonths = uniqueYearMonths.get(year);
        uniqueYearMonths.set(year, existMonths ? [month, ...existMonths] : [month]);
    }

    return (
        <BaseMenuSection sectionName={`Archives`}>
            <nav className={`menuSectionArchives`}>
                {Array.from(uniqueYearMonths.keys()).map((year) => (
                    <Fragment key={year}>
                        <div className={`menuSectionArchives__legend`}>
                            <Link className={`menuSectionArchives__item--year`} to={PathUrl.blog.archive.byYear(year)}>
                                {year}
                            </Link>
                        </div>
                        <div className={`menuSectionArchives__legend`}>
                            {uniqueYearMonths.get(year)!.map((month) => (
                                <Link
                                    className={`menuSectionArchives__item--month`}
                                    key={`${year}-${month}`}
                                    to={PathUrl.blog.archive.byYearMonth(year, month)}
                                >
                                    {`${month}`.padStart(2, "0")}
                                </Link>
                            ))}
                        </div>
                    </Fragment>
                ))}
            </nav>
        </BaseMenuSection>
    );
};
