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
        siteRoot: string;
    };
    auth: {
        sessionExpireDay: number;
    };
    analytics: {
        googleTagId: string;
    };
    sentry: {
        dsn: string;
    };
    blog: {
        indexEntriesCount: number;
        pagingItemCount: number;
        maxTitleLength: number;
        maxSlugLength: number;
        maxMetaTagLength: number;
        feed: {
            recentEntriesCount: number;
        };
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
        siteRoot: "https://sside.net/",
    },
    auth: {
        sessionExpireDay: 365,
    },
    analytics: {
        googleTagId: "G-MW2KXZTQLB",
    },
    blog: {
        indexEntriesCount: 2,
        pagingItemCount: 2,
        maxTitleLength: 512,
        maxSlugLength: 255,
        maxMetaTagLength: 64,
        feed: {
            recentEntriesCount: 20,
        },
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
                    accountName: `ssidenet`,
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
    sentry: {
        dsn: "https://1b59d601df2a4f0e90fac511487069cf@o1359620.ingest.sentry.io/6647362",
    },
};
