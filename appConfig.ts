const ABOUT_SECTION_MESSAGE_MARKDOWN = `Blog持ってないとたまに不便なので作りました。`;
const ONLINE_ACTIVITIES_MESSAGE_MARKDOWN = `コメント不可なので、ご意見とかはこちらに。`;

export interface OnlineActivity {
    serviceName: string;
    accountName: string;
    serviceUrl?: URL;
}

interface AppConfig {
    global: {
        siteName: string;
        ownerName: string;
    };
    auth: {
        sessionExpireDay: number;
    };
    blog: {
        indexEntriesCount: number;
        pagingItemCount: number;
        maxTitleLength: number;
        maxSlugLength: number;
        maxMetaTagLength: number;
    };
    menu: {
        about: {
            messageMarkdown: string;
        };
        onlineActivity: {
            messageMarkdown: string;
            activities: OnlineActivity[];
        };
        latestEntries: {
            entriesCount: number;
        };
    };
}

export const appConfig: AppConfig = {
    global: {
        siteName: "sside.net",
        ownerName: "sside",
    },
    auth: {
        sessionExpireDay: 365,
    },
    blog: {
        indexEntriesCount: 2,
        pagingItemCount: 2,
        maxTitleLength: 512,
        maxSlugLength: 255,
        maxMetaTagLength: 64,
    },
    menu: {
        about: {
            messageMarkdown: ABOUT_SECTION_MESSAGE_MARKDOWN,
        },
        onlineActivity: {
            messageMarkdown: ONLINE_ACTIVITIES_MESSAGE_MARKDOWN,
            activities: [
                {
                    serviceName: `Twitter`,
                    accountName: `@sside`,
                    serviceUrl: new URL(`https://www.twitter.com/sside/`),
                },
                {
                    serviceName: `Steam`,
                    accountName: `sside`,
                    serviceUrl: new URL(`https://steamcommunity.com/id/sside/`),
                },
                {
                    serviceName: `Xbox`,
                    accountName: `sside net`,
                    serviceUrl: new URL(`https://live.xbox.com/ja-JP/Profile?Gamertag=sside%20net/`),
                },
                { serviceName: `Nintendo`, accountName: `sside [Switch friend code: SW-7280-6189-9608]` },
                {
                    serviceName: `PSN`,
                    accountName: `sside_net`,
                    serviceUrl: new URL(`https://my.playstation.com/sside_net/`),
                },
            ],
        },
        latestEntries: {
            entriesCount: 6,
        },
    },
};
