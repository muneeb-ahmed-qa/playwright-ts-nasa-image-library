import test, { expect } from "@playwright/test";
import { NasaImageLibraryPage } from "../../pages/nasaImageLibraryPage";

const keyword = 'moon';

test.describe('Search Media Results Test Suite', () => {
    test('Validate moon image and number of results', async({page}) => {
        const nasa = new NasaImageLibraryPage(page);
        await nasa.searchTheKeyword(keyword);

        await nasa.filterToImageOnly();
        const links = await nasa.getAllImages();
        expect(await links.count()).toBeGreaterThanOrEqual(5);
    }),
    test('Validate Image Title And Nasa Id', async({page}) => {
        const nasa = new NasaImageLibraryPage(page);
        await nasa.searchTheKeyword(keyword);

        await nasa.filterToImageOnly();
        
        await nasa.openFirstResultImage();
        expect(await nasa.getTitle()).toBeVisible({timeout: 60000});
        expect(await nasa.getNasaId()).toBeVisible();
    }),
    test('Validate Preview Image', async({page}) => {
        const nasa = new NasaImageLibraryPage(page);
        await nasa.searchTheKeyword(keyword);

        await nasa.filterToImageOnly();

        await nasa.hoverOnTheFirstImage();
        await nasa.assertPreviewImageLoading();
    })
})