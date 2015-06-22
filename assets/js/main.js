require('angular');

var net = require('net');

var client = new net.Socket();
var gem_count = 0;
var behavior_count = 0;

client.connect(9696, '127.0.0.1', function() {
	console.log('Connected');
});

client.on('data', function(data) {
	var raw_messages = data.toString().split('\n').filter(function(elem) {
		return elem === 0 || elem;
	});
	var messages = [];

	raw_messages.forEach(function(raw_message) {
		messages.push(JSON.parse(raw_message));
	});

	messages.forEach(function(message) {
		var payload = message.payload;

		switch (payload.command) {
		case 'ADD_GEM':
			var el = document.querySelector('#gem-list ul');
			payload.data.forEach(function(datum) {
				var li = document.createElement("li");

				if (gem_count++ % 2 === 0) {
					li.className = 'odd';
				}

				li.innerHTML = datum;
				li.onclick = function() {
					client.write('GET_BEHAVIORS ' + this.innerHTML + '\n');
				};

				el.appendChild(li);
			});

			break;
		case 'ADD_BEHAVIOR':
			var el = document.querySelector('#behavior-list ul');
			payload.data.forEach(function(datum) {
				var li = document.createElement("li");

				if (behavior_count++ % 2 === 0) {
					li.className = 'odd';
				}

				li.innerHTML = datum;
				li.onclick = function() {
					client.write('GET_METHODS ' + this.innerHTML + '\n');
				};

				el.appendChild(li);
			});

			break;
		case 'ADD_METHOD':
			var el = document.querySelector('#method-list ul');
			payload.data.forEach(function(datum) {
				var li = document.createElement("li");

				if (behavior_count++ % 2 === 0) {
					li.className = 'odd';
				}

				li.innerHTML = datum;
				li.onclick = function() {
					client.write('SHOW_SOURCE ' + this.innerHTML + '\n');
				};

				el.appendChild(li);
			});

			break;
		}
	});
});

client.on('close', function() {
	console.log('Connection closed');
});
