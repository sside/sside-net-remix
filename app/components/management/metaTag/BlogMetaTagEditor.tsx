import { BlogMetaTag } from "@prisma/client";
import { LinksFunction } from "@remix-run/node";
import { FC, useEffect, useState } from "react";
import { isClientSide } from "../../../utilities/isClientSide";
import { cssLinks } from "../../../utilities/styling/cssLinkDescriptor";
import styles from "./BlogMetaTagEditor.css";
import choicesBaseStyles from "choices.js/public/assets/styles/base.min.css";
import choicesStyles from "choices.js/public/assets/styles/choices.min.css";

export const links: LinksFunction = () => cssLinks(styles, choicesBaseStyles, choicesStyles);

interface Props {
    metaTags: BlogMetaTag[];
}

export const BlogMetaTagEditor: FC<Props> = ({ metaTags }) => {
    const META_TAG_LIST_ID = "metaTagList";
    const [tags, setTags] = useState(metaTags);

    useEffect(() => {
        if (isClientSide()) {
            const Choices = require("choices.js");
            new Choices(document.getElementById(META_TAG_LIST_ID)!, {});
        }
    });

    return (
        <form>
            <select id={META_TAG_LIST_ID} name={META_TAG_LIST_ID} multiple hidden>
                {tags.map(({ id, name }) => (
                    <option key={id} value={name}>
                        {name}
                    </option>
                ))}
            </select>
        </form>
    );
};
