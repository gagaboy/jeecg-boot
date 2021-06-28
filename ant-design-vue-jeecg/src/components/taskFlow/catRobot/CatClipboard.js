import Clipboard from 'clipboard';

class CatClipboard {
	constructor(page, obj) {
		this.page = page
		this.clipboard = null
		this.success = obj.success
		this.fail = obj.fail
		this.id = obj.id
		this.ref = obj.ref
	}
	initClipboard() {
		var page = this.page
		if(!this.clipboard) {
			this.clipboard = new Clipboard(page.$refs.copyButton);
			this.clipboard.on('success', (e) =>{
	        this.success && this.success()
	    });
	    this.clipboard.on('error', (e) =>{
	        this.fail && this.fail()
	    });
		}
	}
	copyNew() {
		var page = this.page
		page.$nextTick(() => {
			this.initClipboard()
		})
	}
	destroy() {
		this.clipboard && this.clipboard.destroy();
	}
}

export {
	CatClipboard
}
