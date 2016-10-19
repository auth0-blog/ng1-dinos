'use strict';

var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get('/api/deals', function(req, res) {
	var deals = [
		{
			id: 12231,
			name: 'Playstation 4 500GB Console',
			description: 'The Playstation 4 is the next gen console to own. With the best games and online experience.',
			originalPrice: 399.99,
			salePrice: 299.99
		},
		{
			id: 12234,
			name: 'Galaxy Note 7',
			description: 'The Note 7 has been fixed and will no longer explode. Get it an amazing price!',
			originalPrice: 899.99,
			salePrice: 499.99
		},
		{
			id: 12245,
			name: 'Macbook Pro 2016',
			description: 'The Macbook Pro is the de-facto standard for best in breed mobile computing.',
			originalPrice: 2199.99,
			salePrice: 1999.99
		},
		{
			id: 12267,
			name: 'Amazon Echo',
			description: 'Turn your home into a smart home with Amazon Echo. Just say the word and Echo will do it.',
			originalPrice: 179.99,
			salePrice: 129.99
		},
		{
			id: 12288,
			name: 'Nest Outdoor Camera',
			description: 'The Nest Outdoor camera records and keeps track of events outside your home 24/7.',
			originalPrice: 199.99,
			salePrice: 149.99
		},
		{
			id: 12290,
			name: 'GoPro 4',
			description: 'Record yourself in first person 24/7 with the GoPro 4. Show everyone how exciting your life is.',
			originalPrice: 299.99,
			salePrice: 199.99
		}
	];

	// TODO: sort array by date(?) or let framework do it (probably)

	res.json(deals);
});

app.listen(3001);
console.log('Listening on localhost:3001');