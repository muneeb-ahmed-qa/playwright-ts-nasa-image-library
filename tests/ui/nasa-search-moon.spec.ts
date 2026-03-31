import test, { expect } from "@playwright/test";
import { NasaImageLibraryPage } from "../../pages/nasaImageLibraryPage";

const keyword = 'moon';

test.describe('Search Media Results Test Suite', () => {
    let nasa: NasaImageLibraryPage;

    test.beforeEach(async({page}) => {
        nasa = new NasaImageLibraryPage(page);
        await nasa.searchTheKeyword(keyword);
        await nasa.filterToImageOnly();
    });
    test('Validate moon image and number of results', async() => { 
        const links = await nasa.getAllImages();
        expect(await links.count()).toBeGreaterThanOrEqual(5);
    });
    test('Validate Image Title And Nasa Id', async() => {
        await nasa.openFirstResultImage();
        expect(await nasa.getTitle()).toBeVisible({timeout: 60000});
        expect(await nasa.getNasaId()).toBeVisible();
    });
    test('Validate Preview Image', async() => {
        await nasa.hoverOnTheFirstImage();
        await nasa.assertPreviewImageLoading();
    });
})