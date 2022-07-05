import { LinksFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { FC } from "react";
import { PathUrl } from "../../../constants/paths/PathUrl";
import { cssLinks } from "../../../utilities/styling/cssLinkDescriptor";
import { BaseMenuSection } from "./BaseMenuSection";
import styles from "./MenuSectionBlogMetaTags.css";

export const links: LinksFunction = () => cssLinks(styles);

export interface BlogMetaTagCount {
    name: string;
    count: number;
}

interface Props {
    blogMetaTagCounts: BlogMetaTagCount[];
}

export const MenuSectionBlogMetaTags: FC<Props> = ({ blogMetaTagCounts }) => {
    const filteredBlogMetaTagCounts = blogMetaTagCounts.filter(({ count }) => count >= 1);

    return (
        <BaseMenuSection sectionName={`Meta tags`}>
            <nav className={`menuSectionBlogMetaTags`}>
                {filteredBlogMetaTagCounts.map(({ name, count }) => (
                    <Link
                        className={`menuSectionBlogMetaTags__link`}
                        key={name}
                        to={PathUrl.blog.metaTag.byMetaTag(name)}
                    >
                        <div>
                            <span>{name}</span>
                            <span className={`menuSectionBlogMetaTags__linkCount`}>{count}</span>
                        </div>
                    </Link>
                ))}
            </nav>
        </BaseMenuSection>
    );
};
