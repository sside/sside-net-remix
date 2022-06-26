import { LinksFunction } from "@remix-run/node";
import { FC } from "react";
import { PathUrl } from "../../../constants/paths/PathUrl";
import { deleteClient, putClient } from "../../../libraries/api-client/apiClient";
import { DateTimeFormat, formatDate, parseIso8601ToJst } from "../../../libraries/datetime";
import { validateBlogEntryMetaTag } from "../../../libraries/vallidator/validateBlogEntryMetaTag";
import { UpdateMetaTagRestRequest } from "../../../routes/management/meta_tag/$metaTagId/update";
import { BlogMetaTagClientResponse } from "../../../services/blog-meta-tag/types/BlogMetaTagClientResponse";
import { cssLinks } from "../../../utilities/styling/cssLinkDescriptor";
import styles from "./ManagementBlogMetaTagList.css";

export const links: LinksFunction = () => cssLinks(styles);

interface Props {
    blogMetaTags: BlogMetaTagClientResponse[];
}

export const ManagementBlogMetaTagList: FC<Props> = ({ blogMetaTags }) => {
    const renameMetaTag = async (metaTagId: string, metaTagName: string) => {
        const newName = prompt(`Input new meta tag name.`, metaTagName);

        if (!newName) {
            return;
        }
        const validateResult = validateBlogEntryMetaTag(newName);
        if (validateResult !== true) {
            alert(validateResult);
            return;
        }

        try {
            await putClient(PathUrl.management.metaTag.updateById(metaTagId), new UpdateMetaTagRestRequest(newName));
        } catch (e) {
            console.error(e);
            alert(`Blog meta tag update failed.`);
            return;
        }

        location.reload();
    };

    const deleteMetaTag = async (metaTagId: string, metaTagName: string) => {
        const input = prompt(`If you really want delete meta tag, input [${metaTagName}]`);
        if (!input || input !== metaTagName) {
            return;
        }

        try {
            await deleteClient(PathUrl.management.metaTag.deleteById(metaTagId));
        } catch (e) {
            console.error(e);
            return;
        }

        location.reload();
    };

    return (
        <table className={`managementBlogMetaTagList`}>
            <thead className={`managementBlogMetaTagList__header`}>
                <tr>
                    {["name", "created at", "", ""].map((header, index) => (
                        <th key={index} className={`managementBlogMetaTagList__headerItem`}>
                            {header}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className={`managementBlogMetaTagList__body`}>
                {blogMetaTags.map(({ name, id, createdAt }) => (
                    <tr key={id} className={`managementBlogMetaTagList__bodyRow`}>
                        <td className={`managementBlogMetaTagList__bodyItem`}>{name}</td>
                        <td className={`managementBlogMetaTagList__bodyItem`}>
                            {formatDate(parseIso8601ToJst(createdAt), DateTimeFormat.Full)}
                        </td>
                        <td className={`managementBlogMetaTagList__bodyItem`}>
                            <button type={"button"} onClick={async () => await renameMetaTag(id, name)}>
                                RENAME
                            </button>
                        </td>
                        <td className={`managementBlogMetaTagList__bodyItem`}>
                            <button
                                type={"button"}
                                onClick={async () => {
                                    await deleteMetaTag(id, name);
                                }}
                            >
                                REMOVE
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
