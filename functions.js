var passage, chars, words, last_word, completed_chars=0, start=false, aTimer, clock, attempt, mistakes, not_mistakes, wpm, accuracy, wpm_list=[], acc_list=[], data_chart, config, m_config, char_mistakes, char_mistakes_amts;

window.onload = function() {
	// check if cookies already exist, if not, create them
	if (!is_cookie("wpm_list")) document.cookie = "wpm_list=;";
	if (!is_cookie("acc_list")) document.cookie = "acc_list=;";
	if (!is_cookie("char_mistakes")) document.cookie = "char_mistakes=;"

	// scrape the cookies and store the informaiton in their respective variables
	wpm_list = get_cookie("wpm_list").split(",").map(Number);
	acc_list = get_cookie("acc_list").split(",").map(Number);
	if (wpm_list[0] == "" || acc_list[0] == "") {
		acc_list = [];
		wpm_list = [];
	}
	attempt = wpm_list.length;
	var attempt_list = [];
	for (var i = 1; i <= wpm_list.length; i++) attempt_list.push(i);

	// create a config variable for the chart for wpm and accuracy
	config = {
		type: 'line',
		data: {
			labels: attempt_list,
			datasets: [{
					label: 'speed (wpm)',
					backgroundColor: 'lime',
					borderColor: 'lime',
					data: wpm_list,
					fill: false,
				}, {
					label: 'accuracy (%)',
					fill: false,
					backgroundColor: 'cyan',
					borderColor: 'cyan',
					data: acc_list,
				}]
		},
		options: {
			responsive: true,
			label: {
				color: 'white'
			},
			title: {
				display: true,
				text: 'speed and acc over time'
			},
			tooltips: {
				mode: 'index',
				intersect: false,
			},
			hover: {
				mode: 'nearest',
				intersect: true
			},
			scales: {
				xAxes: [{
					display: true,
					scaleLabel: {
						display: true,
						labelString: 'attempt'
					}
				}],
				yAxes: [{
					display: true,
					scaleLabel: {
						display: true,
						labelString: ''
					},
					ticks: {
		                beginAtZero: true
		            }
				}]
			}
		}
	};

	// scrape the cookies to get past data
	set_mistake_lists();

	// create config variable for the chart for missed chars
	m_config = {
		type: 'bar',
		data: {
			labels: char_mistakes,
			datasets: [{
				label: '# missed (count)',
				backgroundColor: 'red',
				borderWidth: 1,
				data: char_mistakes_amts
			}]
		},
		options: {
			responsive: true,
			legend: {
				position: 'top',
			},
			title: {
				display: true,
				text: 'missed chars'
			},
			scales: {
				xAxes: [{
					display: true,
					scaleLabel: {
						display: true,
						labelString: 'chars'
					}
				}],
		        yAxes: [{
		            ticks: {
		                beginAtZero: true
		            }
		        }]
		    }
		}
	}

	// create the charts
	var ctx = document.getElementById('myChart');
	data_chart = new Chart(ctx, config);

	var m_ctx = document.getElementById('mistakes_chart');
	mistakes_chart = new Chart(m_ctx, m_config);

	// update past stats if they exist
	if (attempt > 0)	update_overall_stats();
};

// start the typing test when user presses the enter key when the game is not already ongoing
document.addEventListener("keydown", function(e) {
	if (!start) {
		if (e.keyCode == 13) {
			start = true;
			attempt++;
			get_new_passage();
		}
	}
});

// scrape the char_mistakes cookie for past data on missed chars
function set_mistake_lists() {
	// "char_mistakes=a:5,b:6,c:9"
	all_mistakes = get_cookie("char_mistakes").split(",");
	char_mistakes = [];
	char_mistakes_amts = [];
	for (var i = 0; i < all_mistakes.length; i++) {
		s = all_mistakes[i].split(":");
		char_mistakes.push(s[0]);
		char_mistakes_amts.push(Number(s[1]));
	}
	if (char_mistakes[0] == "" || char_mistakes_amts[0] == ""){
		char_mistakes = [];
		char_mistakes_amts = [];
	}
}

//
function is_cookie(s) {
	c = document.cookie.split("; ");
	for (var i = 0; i < c.length; i++) {
		sub_cookie = c[i].split("=");
		if (sub_cookie[0] == s) {
			return true;
		}
	}
	return false;
}
function get_cookie(s) {
	c = document.cookie.split("; ");
	for (var i = 0; i < c.length; i++) {
		sub_cookie = c[i].split("=");
		if (sub_cookie[0] == s) {
			return sub_cookie[1];
		}
	}
}

function update_stats() {
	wpm = (completed_chars/5)/(clock/60000);
	wpm = Math.round(wpm * 10) / 10;
	document.getElementById("wpm").innerText = wpm + " wpm";
	// accuracy = 100 - (mistakes*100/completed_chars);
	accuracy = not_mistakes*100/(mistakes + not_mistakes)
	accuracy = Math.round(accuracy * 10) / 10;
	document.getElementById("accuracy").innerText = accuracy + " %";
}

function start_timer() {
	aTimer.start();
}

function get_new_passage() {
	wpm = 0;
	accuracy = 0;
	mistakes = 0;
	not_mistakes = 0;
	clock = 0;

    var data = new FormData();
    data.append('func', "get_passage");

    var xhttp = new XMLHttpRequest();
    xhttp.open('POST', './helper.php', true);
    xhttp.onload = function () {
		passage = this.responseText;
		chars = passage.split("");
		words = passage.split(" ");
		last_word = words[words.length - 1];
		fill_passage();
		start_timer();
		stat_updater = setInterval(update_stats, 500);
    };
    xhttp.send(data);
}

function fill_passage() {
	document.getElementById("timer").innerHTML = "";
	aTimer = new Stopwatch(document.getElementById("timer"));
	e = document.getElementById("inp");
	e.disabled = false;
	e.placeholder = "start typing...";
	e.select();
	document.getElementById("passage-container").innerHTML = "";

	completed_chars = 0;

	for (var i = 0; i < passage.length; i++) {
		elem = document.createElement("span");
		elem.classList.add("pchar");
		elem.id = "c" + i;
		elem.innerText = passage[i];
		document.getElementById("passage-container").appendChild(elem);
	}
}

function check_input() {
	inp = document.getElementById("inp").value;

	if (chars[completed_chars + inp.length - 1] == inp.substring(inp.length - 1, inp.length)) not_mistakes++;
	else mistakes++;

	for (var i = 0; i < completed_chars; i++) {
		document.getElementById("c" + i).style.textDecoration = "none";
	}
	for (var i = completed_chars; i < passage.length; i++) {
		if (i < inp.length + completed_chars) {
			document.getElementById("c" + i).style.textDecoration = "none";
			if (inp[i - completed_chars] == chars[i]) {
				color_c(i, "-right");
			} else {
				add_missed_char(chars[i]);
				color_c(i, "-wrong");
			}
		} else {
			if (i == inp.length + completed_chars) {
				document.getElementById("c" + i).style.textDecoration = "underline magenta";
			} else {
				document.getElementById("c" + i).style.textDecoration = "none";
			}
			color_c(i, "");
		}
	}
	if (inp == passage.substring(completed_chars, passage.length) && completed_chars + inp.length == passage.length) {
		finish_passage();
	}
	if (inp.substring(inp.length - 1, inp.length) == " ") {
		if (inp == passage.substring(completed_chars, completed_chars + inp.length)) {
			completed_chars += inp.length;
			document.getElementById("inp").value = "";
		}
	}
}

function sort_mistakes() {

}

function add_missed_char(c) {
	if (char_mistakes.includes(c)){
		char_mistakes_amts[char_mistakes.indexOf(c)] += 1;
	} else {
		char_mistakes.push(c);
		char_mistakes_amts.push(1);
	}
	sort_mistakes();
	update_missed_char_chart(c);
}

function update_missed_char_chart(c){
	console.log("updating missed char chart");
	present_chars = m_config.data.labels;
	if (!present_chars.includes(c)) {
		m_config.data.labels.push(c);
	}
	mistakes_chart.update();
}

function color_c(n, t) {
	c = document.getElementById("c" + n);
	c.classList.remove("pchar");
	c.classList.remove("pchar-wrong");
	c.classList.remove("pchar-right");
	c.classList.add("pchar" + t);
}

function finish_passage() {
	update_data(attempt, wpm, accuracy);
	update_overall_stats();
	update_cookies(wpm, accuracy);

	e = document.getElementById("inp");
	e.value = "";
	e.placeholder = "press \'enter\' to restart";
	e.disabled = true;
	start = false;
	aTimer.stop();
	clearInterval(stat_updater);
}

function update_cookies(wpm, acc) {
	wpm_cookie = get_cookie("wpm_list");
	if (wpm_cookie.length == 0) {
		document.cookie = "wpm_list=" + wpm + ";";
	} else {
		document.cookie = "wpm_list=" + wpm_cookie + "," + wpm + ";";
	}

	acc_cookie = get_cookie("acc_list");
	if (acc_cookie.length == 0) {
		document.cookie = "acc_list=" + acc + ";";
	} else {
		document.cookie = "acc_list=" + acc_cookie + "," + acc + ";";
	}

	mistakes_cookie = "";
	for (var i = 0; i < char_mistakes.length; i++) {
		if (i == 0)	mistakes_cookie += char_mistakes[i] + ":" + char_mistakes_amts[i];
		else mistakes_cookie += "," + char_mistakes[i] + ":" + char_mistakes_amts[i];
	}
	document.cookie = "char_mistakes=" + mistakes_cookie + ";";
}

function update_overall_stats() {
	avg_wpm = wpm_list.reduce((a,b) => a + b, 0) / wpm_list.length;
	avg_acc = acc_list.reduce((a,b) => a + b, 0) / acc_list.length;
	document.getElementById("avg_wpm").innerText = Math.round(avg_wpm * 10)/10 + " wpm";
	document.getElementById("avg_acc").innerText = Math.round(avg_acc * 10)/10 + " %";
	std = Math.sqrt(wpm_list.map(x => Math.pow(x - avg_wpm,2)).reduce((a,b) => a + b)/wpm_list.length);
	document.getElementById("std").innerText = Math.round(std * 100)/100 + " wpm";
}

function update_data(attempt, wpm, acc) {
	// updating the chart
	if (config.data.datasets.length > 0) {
		config.data.labels.push(attempt);
		config.data.datasets[0].data.push(wpm);
		config.data.datasets[1].data.push(acc);
		data_chart.update();
	}
}

var Stopwatch = function(elem, options) {

  var timer = createTimer(),
      offset,
      interval;

  // default options
  options = options || {};
  options.delay = options.delay || 1;

  // append elements
  elem.appendChild(timer);

  // initialize
  reset();

  // private functions
  function createTimer() {
    return document.createElement("span");
  }

  function start() {
    if (!interval) {
      offset   = Date.now();
      interval = setInterval(update, options.delay);
    }
  }

  function stop() {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  }

  function reset() {
    clock = 0;
    render(0);
  }

  function update() {
    clock += delta();
    render();
  }

  function getTime() {
	  return clock/1000;
  }

  function render() {
    timer.innerHTML = Math.round(clock/10)/100 + " s";
  }

  function delta() {
    var now = Date.now(),
        d   = now - offset;

    offset = now;
    return d;
  }

  // public API
  this.start  = start;
  this.stop   = stop;
  this.reset  = reset;
};

function mergeSort (arr) {
	if (arr.length === 1) {
		// return once we hit an array with a single item
		return arr
	}

	const middle = Math.floor(arr.length / 2) // get the middle item of the array rounded down
	const left = arr.slice(0, middle) // items on the left side
	const right = arr.slice(middle) // items on the right side

 	return merge(
		mergeSort(left),
		mergeSort(right)
 	)
}

// compare the arrays item by item and return the concatenated result
function merge (left, right) {
 	let result = []
 	let indexLeft = 0
 	let indexRight = 0

 	while (indexLeft < left.length && indexRight < right.length) {
		if (left[indexLeft] < right[indexRight]) {
	     	result.push(left[indexLeft])
	     	indexLeft++
		} else {
	     	result.push(right[indexRight])
	     	indexRight++
		}
 	}
	return result.concat(left.slice(indexLeft)).concat(right.slice(indexRight))
}
