export class MicroCMSClient {
    serviceDomain;
    apiKey;
    constructor(serviceDomain, apiKey) {
        this.serviceDomain = serviceDomain;
        this.apiKey = apiKey;
    }
    async request(endpoint) {
        const url = `https://${this.serviceDomain}.microcms.io/api/v1/${endpoint}`;
        const response = await fetch(url, {
            headers: {
                'X-MICROCMS-API-KEY': this.apiKey,
            },
        });
        if (!response.ok) {
            throw new Error(`microCMS API error: ${response.status}`);
        }
        return response.json();
    }
    async getPosts(limit = 10, offset = 0) {
        return this.request(`posts?limit=${limit}&offset=${offset}`);
    }
    async getPost(id) {
        return this.request(`posts/${id}`);
    }
    async getPostBySlug(slug) {
        const response = await this.request(`posts?filters=slug[equals]${slug}`);
        if (response.contents.length === 0) {
            throw new Error('Post not found');
        }
        return response.contents[0];
    }
}
