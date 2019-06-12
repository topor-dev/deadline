(function() {
	const UPDATE_INTERVAL = 1000 / 8
	const HIDDEN_CLASSNAME = 'hidden'
	const death_block = document.querySelector('#timer #death')
	const scalable_block = document.querySelector('#timer .timeline .scalable-block')
	const line_container = document.querySelector('#timer .timeline')

	function out_error(text) {
		alert(text)
	}
	function finish_countdown() {
		death_block.style.background = "inherit"
		let e = document.querySelector('.deadline-text>span+span');
		if (e) { e.classList.add(HIDDEN_CLASSNAME); }
		alert("Time's up")
	}
	const type_variants = ['at', 'to']

	const type = findGetParameter('type')
	const time = findGetParameter('time')

	if (type === undefined || time === undefined){
		return
	}

	if (type_variants.indexOf(type) < 0){
		out_error(`ValueError: type "${type}" not in allowed types`)
		return;
	}

	// yep, there are two colons after question mark
	// first (?: - not consider parenthesises content as group
	// second : - part of target str
	const time_re = /^([01]?[0-9]|2[0-3]):([0-5]?[0-9])(?::([0-5]?[0-9]))?$/

	const groups = time_re.exec(time); // [match, group[0], ...,] or null
	if (groups === null){
		out_error(`ValueError: time "${time}" not satisfy the mask`)
		return
	}
	let h = parseInt(groups[1], 10),
		m = parseInt(groups[2], 10),
		s = parseInt(groups[3], 10); // may be undefined

	let now = new Date()
	let to_time = new Date();
	switch(type){
		case 'at':
			to_time.setHours(h)
			to_time.setMinutes(m)
			to_time.setSeconds(s || to_time.getSeconds())
			if (now > to_time){ // e.g. now 22:05, timer set to 3:00
				to_time.setDate(to_time.getDate() + 1)
			}
			break
		case 'to':
			to_time.setHours(to_time.getHours() + h)
			to_time.setMinutes(to_time.getMinutes() + m)
			to_time.setSeconds(to_time.getSeconds() + (s || 0))
			break;
	}

	const total_ms = (to_time - now)
	const total_steps = total_ms / UPDATE_INTERVAL

	const DEATH_LEFT_SHIFT = 10
	let scalable_width_init = scalable_block.clientWidth
	let death_left_init = death_block.offsetLeft - DEATH_LEFT_SHIFT

	function timeout_callback() {
		let pixels_per_step = (line_container.clientWidth - scalable_width_init) / total_steps
		let diff_time = to_time - Date.now()
		let current_step = (total_ms - diff_time) / UPDATE_INTERVAL
		// update
		scalable_block.style.width = parseInt(scalable_width_init + pixels_per_step*current_step) + 'px'
		death_block.style.left = parseInt(death_left_init + pixels_per_step*current_step - DEATH_LEFT_SHIFT) + 'px'

		if (current_step >= total_steps){
			finish_countdown()
			return;
		}
		setTimeout(timeout_callback, UPDATE_INTERVAL)
	}
	timeout_callback()
})()