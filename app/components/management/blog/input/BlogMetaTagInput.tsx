import { LinksFunction } from "@remix-run/node";
import { FC } from "react";
import { BlogInputContainer, links as blogInputContainerLinks } from "./BlogInputContainer";
import { BlogMetaTagInputBody, links as blogMetaTagInputBodyLinks } from "./BlogMetaTagInputBody";

export const links: LinksFunction = () => [...blogInputContainerLinks(), ...blogMetaTagInputBodyLinks()];

interface Props {
    metaTags: string[];
    autoCompleteMetaTags: string[];
    idMustBeUniqueInPage: string;
    name: string;
}

export const BlogMetaTagInput: FC<Props> = ({ metaTags, autoCompleteMetaTags, name, idMustBeUniqueInPage }) => (
    <BlogInputContainer label={`META TAGS`} htmlFor={name}>
        <BlogMetaTagInputBody
            metaTags={metaTags}
            autoCompleteMetaTags={autoCompleteMetaTags}
            idMustBeUniqueInPage={idMustBeUniqueInPage}
            name={name}
        />
    </BlogInputContainer>
);
