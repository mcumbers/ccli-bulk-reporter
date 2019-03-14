# ccli-bulk-reporter
[![Open Issues](https://img.shields.io/github/issues/mcumbers/ccli-bulk-reporter.svg)](https://github.com/mcumbers/ccli-bulk-reporter/issues)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/3294fc403efe4169b186417d9ff0be2a)](https://www.codacy.com?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=mcumbers/ccli-bulk-reporter&amp;utm_campaign=Badge_Grade)
[![David](https://img.shields.io/david/mcumbers/ccli-bulk-reporter.svg?maxAge=3600)](https://david-dm.org/mcumbers/ccli-bulk-reporter/)

<p align="center">
  <img src="https://media.giphy.com/media/7vAgM8ius1aejwy6Rp/giphy.gif" alt="Test Run"/>
</p>

Simple, automated, CCLI Usage Reporting using [puppeteer](https://github.com/GoogleChrome/puppeteer).

## But why

I hate repetitive tasks, and CCLI doesn't have a batch reporting method. (Which is really stupid.)
My solution? Automate it!

## Setup

#### Example index.js:
```js
const { Client, Config } = require('ccli-bulk-reporter');
const config = require('./config.json');
const songs = require('./songs.json');

const myConfig = new Config(config);
const myClient = new Client(myConfig);

myClient.report(songs);
```

#### Example config.json:
```json
{
	"ccliEmail": "",
	"ccliPassword": "",
	"headless": false
}
```
Where `ccliEmail` is your CCLI Email and `ccliPassword` is your CCLI Password.

#### Example songs.json:
```json
[
 {
   "id": 0,
   "print": 0,
   "digital": 0,
   "recording": 0,
   "translation": 0
 },
 {
   "id": 0,
   "print": 0,
   "digital": 0,
   "recording": 0,
   "translation": 0
 }
]
```
Where `id` is the CCLI# of each song and `print`, `digital`, `recording`, and `translation` are the respective counts for each of use types.

#### Getting your song information:
Because I hate repetitive tasks, I simply took the CCLI report from Planning Center, copied it into Excel, saved it as a csv, then converted the csv to json.