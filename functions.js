let url = "https://obs-timer-api.herokuapp.com";
//let url = "http://localhost:3000"
let interval;

try {
	let t0 = performance.now();

	fetch(url + "/api/timer")
		.then((res) => res.json())
		.then((data) => {
			clearInterval(interval); //Stop the interval
			let t1 = performance.now();

			calculatTime(data.timer, data.submittedOn, t1 - t0);
		});

	const socket = io.connect(url, {
		query: { connectedAt: Date.now() },
	});

	//On submitted new time from obs
	socket.on("emited-counter", (newData, ServerRespondedAt) => {
		clearInterval(interval); //Stop the interval

		serverLatency = ServerRespondedAt - Date.now();

		calculatTime(newData.timer, newData.submittedOn, serverLatency);
	});
} catch (error) {
	console.log(error);
}

//////////////////////////////////////////////////

function calculatTime(videoLength, submittedTime, serverDelai = 0) {
	exactTime = videoLength - (Date.now() - submittedTime) - serverDelai-1;

	let timedFormat = "00:00:00";

	if (exactTime > 0) {
		timedFormat = new Date(exactTime).toISOString().substr(11, 8);
	}

	printTime(timedFormat);
}

function printTime(timedFormat) {
	 	let hours = parseInt(timedFormat.substr(0, 2)),
		min = parseInt(timedFormat.substr(3, 2)) + hours*60,
		sec = parseInt(timedFormat.substr(6, 2)); 
		console.log("init", hours, min, sec);



	//initialize the timer on the DOM

	interval = setInterval(() => {
		console.log("inside or loop after setting ", hours, min, sec);

		if (sec < 0 || min < 0 ) {
			console.log("inside or loop ", hours, min, sec);
			
			clearInterval(interval);
			sec=0, min=0
			console.log("inside or loop after setting ", hours, min, sec);

		}else
		if (sec <= 0 && min <= 0 ) {
			console.log("inside and loop ", min, sec);

			clearInterval(interval);
			sec=0, min=0;
		}else
		
		if (sec > 0) {
			sec--;
		} else if (sec <= 0) {
			console.log("inside if statement");
			if (min > 0) {
				min--;
			}
			sec = 59;
		}

		console.log("final ", hours, min, sec);

		//(document.getElementById("hours").innerText = hours),
			(document.getElementById("minutes").innerText = min),
			(document.getElementById("seconds").innerText = sec);
	}, 1000);
}
