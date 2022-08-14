import { FC, Fragment } from "react";

interface Props {
    googleTagId: string;
}

export const GoogleAnalytics: FC<Props> = ({ googleTagId }) => (
    <Fragment>
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${googleTagId}`} />
        <script
            dangerouslySetInnerHTML={{
                __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${googleTagId}');`,
            }}
        />
    </Fragment>
);
