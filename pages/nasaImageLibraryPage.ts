import { expect, Locator, Page } from "@playwright/test";

export class NasaImageLibraryPage {
    private readonly searchBox;
    private readonly videosFilterButton;
    private readonly audioFilterButton;
    private readonly updateButton;
    private readonly resultImages;
    private readonly title;

    constructor(private readonly page: Page) {
        this.searchBox = page.getByRole('textbox');
        this.videosFilterButton = page.getByRole('option', { name: 'Videos' });
        this.audioFilterButton = page.getByRole('option', { name: 'Audio' });
        this.updateButton = page.getByText('Update', { exact: true });
        this.resultImages = page.locator('a.image-asset[href^="/details/"]');
        this.title = page.locator('#details-info').locator('div.details-title');
    }

    public async goToTheURL():Promise<void>{
        await this.page.goto('/');
        await expect(this.searchBox).toBeVisible({timeout: 30000});
    }
    public async searchTheKeyword(keyword:string):Promise<void>{
        await this.goToTheURL();
        await this.searchBox.fill(keyword);
        await this.searchBox.press('Enter');
        await expect(this.page.locator('#search-results_container')).toBeVisible({timeout:120000});

    }
    public async filterToImageOnly():Promise<void>{
        await this.videosFilterButton.click();
        await this.audioFilterButton.click();
        await this.updateButton.click();
        await expect(this.page.locator('#search-results_container')).toBeVisible({timeout:90000});

    }
    public async getAllImages():Promise<Locator>{
        return this.resultImages;
    }
    public async openFirstResultImage():Promise<void>{
        await this.resultImages.first().click();
    }
    public async getTitle():Promise<Locator>{
        await this.title.waitFor({state: 'visible'});
        return await this.title;
    }
    public async getNasaId():Promise<Locator>{
        return await this.page.locator('#details-nasa-id');
    }
    public async navigateBackToPreviousPage():Promise<void>{
        await this.page.goBack();
        await expect(this.page.locator('#search-results_container')).toBeVisible({timeout:90000});

    }
    public async hoverOnTheFirstImage():Promise<void>{
        await this.resultImages.first().hover();
    }
    public async assertPreviewImageLoading():Promise<void>{
        const previewImage = this.page.locator('//*[contains(@id, "popover_")]')
        expect(previewImage).toBeVisible();
    }

}