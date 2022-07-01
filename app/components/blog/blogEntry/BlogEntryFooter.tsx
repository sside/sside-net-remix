import { Link } from "@remix-run/react";
import { FC } from "react";
import { PathUrl } from "../../../constants/paths/PathUrl";

interface Props {
    metaTags: string[];
}

export const BlogEntryFooter: FC<Props> = ({ metaTags }) => {
    return (
        <footer>
            <span>Meta tag</span>
            <div>
                {metaTags.map((metaTag, index) => (
                    <Link key={metaTag} to={PathUrl.blog.metaTag.byMetaTag(metaTag)}>
                        {metaTag + (metaTags.length - 1 !== index ? "," : "")}
                    </Link>
                ))}
            </div>
        </footer>
    );
};
