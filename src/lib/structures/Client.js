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
		const page = await browser.newPage();

		await this.ccliLogin(page);
		await this.ccliInit(page);
		await this.reportCycle(page);
		await browser.close();

		console.log('Terminating Session.');
		return;
	}

	async reportCycle(page) {
		console.log('Beginning Individual Song Reports...');
		for await (const song of this.songs) {
			console.log(`Reporting Song: CCLI#${song[1].id}`);
			await page.type('#SearchTerm', song[1].id.toString(), { delay: 100 });
			await page.click(`[onclick="return $('#SearchTerm').val() != '' && $('#SearchTerm').val() != ''"]`);
			await page.waitForSelector('#searchResults');

			if (await page.$('.ss-pd')) continue;

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
		console.log('Finished Reporting.');
	}

	async ccliLogin(page) {
		console.log('Logging into CCLI Reporting.');
		await page.goto('https://profile.ccli.com/account/signin?appContext=OLR&returnUrl=https%3a%2f%2folr.ccli.com%3a443%2f');
		await page.type('#EmailAddress', this.settings.ccliEmail, { delay: 25 });
		await page.type('#Password', this.settings.ccliPassword, { delay: 25 });
		await page.click('#Sign-In');
		await page.waitForSelector('#SearchTerm');
		console.log('Logged into CCLI Reporting.');
	}

	async ccliInit(page) {
		console.log('Making sure the reporting fields will be there...');
		await page.type('#SearchTerm', '3350395', { delay: 50 });
		await page.click(`[onclick="return $('#SearchTerm').val() != '' && $('#SearchTerm').val() != ''"]`);
		await page.waitForSelector('#showReportWindow');
		await page.click('#showReportWindow');
		await page.waitForSelector('[name="PrintCount"]');
		await page.click('.application-name');
	}

}

module.exports = Client;
