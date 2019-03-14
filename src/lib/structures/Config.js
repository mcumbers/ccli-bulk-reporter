class Config {

	constructor(options = {}) {
		if (!options.ccliEmail) throw 'Config requires a ccliEmail';
		if (!options.ccliPassword) throw 'Config requires a ccliPassword';

		this.ccliEmail = options.ccliEmail;
		this.ccliPassword = options.ccliPassword;
		this.headless = options.headless ? options.headless : false;
	}

}

module.exports = Config;
