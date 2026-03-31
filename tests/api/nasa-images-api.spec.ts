import test, { expect, request } from "@playwright/test";
import { nasaSearch, firstSearchItemData, nasaAsset, extractDownloadableUrls } from "../../helpers/nasaApi";

const search_Keyword = 'moon'

test.describe('Search & Fetch Asset Details Test Suite', () => {
    let searchStatus: number;
    let searchBody: any;
    test.beforeEach(async ({ request }) => {
        const { status, body } = await nasaSearch(request, search_Keyword, { media_type: 'image', page: 1 });
        searchStatus = status;
        searchBody = body;
    });
    test('Validate API Status and Items Length', async() => {
        expect(searchStatus).toBe(200);
        expect(searchBody.collection?.items?.length).toBeGreaterThanOrEqual(1);
    });
    test('Validate Title and Nasa ID', async({request}) => {
        expect(searchStatus).toBe(200);
        const data = await firstSearchItemData(searchBody);
        expect(data?.title).toBeTruthy();
        expect(data?.nasa_id).toBeTruthy();
    });
    test('Validate Asset Details', async({request}) => {
        expect(searchStatus).toBe(200);
        const data = await firstSearchItemData(searchBody);

        const nasaId = data!.nasa_id!;
        const title = data!.title!;

        const {sts, bdy} = await nasaAsset(request, nasaId);
        expect(sts).toBe(200);
        const urls = await extractDownloadableUrls(bdy);
        expect(urls.length).toBeGreaterThanOrEqual(1);
        expect(title.length).toBeGreaterThan(0);
    });
    test('Validate Nonsense Search Returns Zero Results', async ({ request }) => {
        const { status, body } = await nasaSearch(request, 'xyznonexistent12345zzz', {
            media_type: 'image',
            page: 1,
        });
        expect(status).toBe(200);
        const items = body.collection?.items ?? [];
        expect(items).toHaveLength(0);
        expect(body.collection?.metadata?.total_hits ?? 0).toBe(0);
    });
})