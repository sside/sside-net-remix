import { LinksFunction } from "@remix-run/node";
import { TagifySettings } from "@yaireo/tagify";
import Tags from "@yaireo/tagify/dist/react.tagify";
import tagifyStyles from "@yaireo/tagify/dist/tagify.css";
import { FC } from "react";
import { validateBlogEntryMetaTag } from "../../../../libraries/vallidator/validateBlogEntryMetaTag";
import { cssLinks } from "../../../../utilities/styling/cssLinkDescriptor";
import customTagifyStyles from "./blogMetaTagTagify.css";

export const links: LinksFunction = () => cssLinks(tagifyStyles, customTagifyStyles);

interface Props {
    metaTags: string[];
    autoCompleteMetaTags: string[];
    idMustBeUniqueInPage: string;
    name: string;
}

export const BlogMetaTagInputBody: FC<Props> = ({ metaTags, idMustBeUniqueInPage, name, autoCompleteMetaTags }) => {
    const settings: TagifySettings = {
        id: idMustBeUniqueInPage,
        whitelist: autoCompleteMetaTags,
        validate: ({ value }) => validateBlogEntryMetaTag(value),
        originalInputValueFormat: (tagDatas) => tagDatas.map(({ value }) => value).join(","),
    };
    return <Tags className={`blogMetaTagTagify`} name={name} settings={settings} defaultValue={metaTags} />;
};
