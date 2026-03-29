import test, { expect } from "@playwright/test";
import { firstSearchItemData, nasaSearch } from "../../helpers/nasaApi";
import { NasaImageLibraryPage } from "../../pages/nasaImageLibraryPage";
import { normalizeTitle, extractNasaId } from '../../helpers/normalizeText';


const keyword = 'moon'

test.describe('API To UI Consistency Test Suite', () => {
    test('Validate UI Title and API Titles', async({page, request}) => {
        const nasa = new NasaImageLibraryPage(page);

        const {status, body} = await nasaSearch(request, keyword, {media_type: 'image', page: 1});
        expect(status).toBe(200);
        // console.log(JSON.stringify(body.collection?.items?.[0], null, 2));
        const firstItem = firstSearchItemData(body);
        const apiNasaId = firstItem!.nasa_id!;
        const apiTitle = firstItem!.title!;

        await nasa.goToTheURL();
        await nasa.searchTheKeyword(keyword);
        await nasa.filterToImageOnly();
        await nasa.openFirstResultImage();

        const titleLocator = await nasa.getTitle();
        const uiTitle = await (titleLocator).innerText();
        const nasaIdLocator = await nasa.getNasaId();
        const uiNasaID = await (nasaIdLocator).innerText();

        expect(normalizeTitle(apiTitle)).toBe(normalizeTitle(uiTitle));
        expect(extractNasaId(apiNasaId)).toBe(extractNasaId(uiNasaID));
    })
})