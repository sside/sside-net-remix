import { Link } from "@remix-run/react";
import { FC } from "react";
import { PathUrl } from "../../../constants/paths/PathUrl";
import { BaseMenuSection } from "./BaseMenuSection";

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
            {filteredBlogMetaTagCounts.map(({ name, count }) => (
                <Link key={name} to={PathUrl.blog.metaTag.byMetaTag(name)}>
                    <div>
                        <span>{name}</span>
                        <span>{count}</span>
                    </div>
                </Link>
            ))}
        </BaseMenuSection>
    );
};
