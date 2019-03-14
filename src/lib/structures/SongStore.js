const Song = require('./Song');

class SongStore extends Map {
	
	async add(song = {}) {
		if (!song instanceof Song) throw 'SongStore#add requires a valid Song';

		if (this.has(song.id)) return this.set(song.id, await song.combine(this.get(song.id)));

		return this.set(song.id, song);
	}

}

module.exports = SongStore;
