/**
 * Interfaccia generica per i post WordPress
 */
interface Post {
    id: number;
    date: string;
    date_gmt: string;
    guid: {
        rendered: string;
    };
    modified: string;
    modified_gmt: string;
    slug: string;
    status: string;
    author: number;
    type: string;
    link: string;
    title: {
        rendered: string;
        raw: string;
    };
    content: {
        rendered: string;
        raw: string;
    };
    template: string;
    acf: {
        [key: string]: any; // Per consentire campi ACF dinamici
    };
    _links: {
        self: Array<{
            href: string;
            targetHints?: {
                allow: string[];
            };
        }>;
        collection: Array<{
            href: string;
        }>;
        about: Array<{
            href: string;
        }>;
        "wp:attachment": Array<{
            href: string;
        }>;
        curies: Array<{
            name: string;
            href: string;
            templated: boolean;
        }>;
        [key: string]: any; // Per consentire altri tipi di link
    };
}

export default Post;