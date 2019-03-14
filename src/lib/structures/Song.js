class Song {
	constructor(song = {}) {
		if(!song.id) throw 'Song requires a CCLI ID';

		this.id = parseInt(song.id);
		this.print = parseInt(song.print);
		this.digital = parseInt(song.digital);
		this.recording = parseInt(song.recording);
		this.translation = parseInt(song.translation);
	}

	async combine(song = {}){
		if(!song instanceof this) throw 'Song#combine requires a valid Song';
		if(this.id !== song.id) throw 'Song#combine will only combine the same Song';

		this.print += song.print;
		this.digital += song.digital;
		this.recording += song.recording;
		this.translation += song.translation;

		return this;
	}

}

module.exports = Song;
