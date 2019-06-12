function findGetParameter(parameterName) {
	let items = location.search.substr(1).split("&")
	for (var index = 0; index < items.length; index++) {
		let kw = items[index].split("=")
		if (kw[0] === parameterName) { return decodeURIComponent(kw[1]); }
	}
	return undefined
}

(function() {
	const type = findGetParameter('type')
	const time = findGetParameter('time')
	const HIDDEN_CLASSNAME = 'hidden'

	if (type === undefined || time === undefined){
		return
	}

	const settings = document.querySelector('#settings')
	const timer = document.querySelector('#timer')

	const back_btns = Array.from(document.querySelectorAll('.back-btn'))
	back_btns.forEach(btn=>{
		btn.addEventListener('click', ()=>{
			settings.classList.toggle(HIDDEN_CLASSNAME)
			timer.classList.toggle(HIDDEN_CLASSNAME)
		})
		btn.classList.remove(HIDDEN_CLASSNAME)
	})
	

	settings.classList.toggle(HIDDEN_CLASSNAME)
	timer.classList.toggle(HIDDEN_CLASSNAME)
})()