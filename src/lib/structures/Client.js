const puppeteer = require('puppeteer');

const Song = require('./Song');
const Config = require('./Config');
const SongStore = require('./SongStore');

class Client {

	constructor(config = {}) {
		if (!(config instanceof Config)) throw 'Client requires a valid Config';
		this.settings = config;
		this.songs = new SongStore;
	}

	async report(songArray = []) {
		for await (const song of songArray) {
			const newSong = new Song(song);
			await this.songs.add(newSong);
		}

		const browser = await puppeteer.launch({ headless: this.settings.headless });

		await this.reportCycle(browser);
		await browser.close();
		return;
	}

	async reportCycle(browser) {
		const page = await browser.newPage();

		await page.goto('https://profile.ccli.com/account/signin?appContext=OLR&returnUrl=https%3a%2f%2folr.ccli.com%3a443%2f');
		await page.type('#EmailAddress', this.settings.ccliEmail, { delay: 25 });
		await page.type('#Password', this.settings.ccliPassword, { delay: 25 });
		await page.click('#Sign-In');
		await page.waitForSelector('#SearchTerm');
		await page.type('#SearchTerm', '3350395', { delay: 50 });
		await page.click(`[onclick="return $('#SearchTerm').val() != '' && $('#SearchTerm').val() != ''"]`);
		await page.waitForNavigation();
		await page.waitForSelector('#showReportWindow');
		await page.click('#showReportWindow');
		await page.waitForSelector('[name="PrintCount"]');
		await page.click('.application-name');

		for await (const song of this.songs) {
			console.log(song);
			await page.waitForSelector('#SearchTerm');
			await page.type('#SearchTerm', song[1].id.toString(), { delay: 100 });
			await page.click(`[onclick="return $('#SearchTerm').val() != '' && $('#SearchTerm').val() != ''"]`);
			await page.waitForNavigation();
			await page.waitForSelector('[name="PrintCount"]');

			await page.focus('#SearchTerm');
			await page.keyboard.press('Tab', { delay: 50 });
			await page.keyboard.press('Tab', { delay: 50 });
			await page.keyboard.type(song[1].print.toString(), { delay: 100 });
			await page.keyboard.press('Tab', { delay: 50 });
			await page.keyboard.type(song[1].digital.toString(), { delay: 100 });
			await page.keyboard.press('Tab', { delay: 50 });
			await page.keyboard.type(song[1].recording.toString(), { delay: 100 });
			await page.keyboard.press('Tab', { delay: 50 });
			await page.keyboard.type(song[1].translation.toString(), { delay: 100 });

			await page.click(`[onclick="ga('send','event', 'Add CCL Activity', 'Select', 'Add to Report button in Search Results')"]`);
			await page.waitForSelector(`[onclick="ga('send','event', 'Delete CCL Activity', 'Select', 'Delete button in song row')"]`);
			await page.click('#showReportWindow');
			await page.waitForSelector('.reportExpandButton');
			await page.click('.application-name');
			await page.waitForSelector('#SearchTerm');
		}
	}

}

module.exports = Client;
