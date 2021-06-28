
let store = window.localStorage
let localStorage = {
	set: function (key,value) {
		store.setItem(key,value)
		// store.key = value
	},
	get: function (key) {
		return store.getItem(key)
	},
	each: function () {

	},
	remove: function (key) {
		store.removeItem(key)
	},
	clearAll: function () {
		store.clear()
	},
	clearCaches: function () {
		let removeItems = []
		let escapeItems = ['moquiSessionToken','loglevel:webpack-dev-server', 'theme-type', 'localThemes']
		for( let i = 0; i< store.length; i++ ){
			if(!escapeItems.includes(store.key(i))){
				this.remove(store.key(i))
			}
		}
	}
}

export default localStorage