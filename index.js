const http = require("http")

const limit = 2**25

const port = 8080

const options = {
}

const startHTML = `
<!DOCTYPE html>

<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>Check if a number is even</title>
		<style>
			body {
				min-height: 90vh;
				display: flex;
				align-items: center;
				justify-content: center;

				font-family: sans-serif;
			}

			#main {
				width: 30em;
				display: flex;
				flex-direction:column;
				align-items: center;
				justify-content: center;

				background-color: #ddd;
				border-radius: 0.5em;
				overflow: hidden;
			}

			#main > * {
				margin: 0.5em 0;
			}

			#header {
				margin-top: 0;
				align-self: stretch;
				display: flex;
				align-items: center;
				justify-content: center;

				background-color: #723;
				color: #fff;
				font-size: 1.3em;
				font-weight: 600;
				padding: 0.5em;
			}
		</style>
		<script>
			function checkNumber() {
				try {
					const number = Number(document.getElementById("number").value)

					const result = isEven(number)

					if (result == 1) {
						alert(number + " is even!")
					} else if (result == 0) {
						alert(number + " is odd!")
					} else {
						alert("Could not tell :(")
					}
				} catch (err) {
					alert(err)
				} 
			}
		</script>

`

const endHTML = `
		</script>
	</head>
	<body>
		<div id="main">
			<span id="header">Enter a number and check if it is even</span>
			<input type="number" id="number">
			<button type="button" onclick="checkNumber()" id="button">Check</button>
		</div>
	</body>
</html>
`

const server = http.createServer(options, async function(req, res) {
	async function write(data) {
		const backpressure = !res.write(data)

		if (backpressure) {
			await new Promise((resolve) => {res.once('drain', resolve)})
		}
	}

	res.setHeader('Content-Type', 'text/html; charset=utf-8')

	await write(startHTML)

	// Attempt 1

	/*
	await write(`
		<script>
			function isEven(n) {
	`)

	var even = true
	for (var i = 0; i < limit; i++) {
		await write(`
				if (n == ${i}) {
					return ${even + 0}
				}
		`)

		even = !even
	}

	await write(`
			}
		</script>
	`)
	*/



	// Attempt 2

	/*
	await write("<script>var isEven = (n) => ")
	
	var even = true
	for (var i = 0; i < limit; i++) {

		await write(`n==${i}?${even + 0}}:`)

		even = !even
	}

	await write("undefined</script>")
	*/



	// Attempt 3

	/*
	await write("<script>var isEven = (n) => ")
	
	for (var i = 0; i < limit; i += 2) {
		await write(`n==${i}||`)
	}

	await write("0</script>")
	*/



	// Attempt 4 - fromCharCode actually does % 2**16 so it's cheating

	/*
	await write(`
		<script>
			function isEven(n) {
				const c = String.fromCharCode(n)
	`)

	var even = true
	for (var i = 0; i < limit; i++) {
		let ch = String.fromCharCode(i)
		ch = ch.replace(/([`\\])/g, "\\$1")
		ch = ch.replace(/\x00/g, "\\x00") // sending null is buggy

		await write(`
				if (c == \`${ch}\`) {
					return ${even + 0}
				}
		`)

		even = !even
	}

	await write(`
			}
		</script>
	`)
	*/



	// Attempt 5 - again. fromCharCode actually does % 2**16 so it's cheating

	/*
	await write(`
		<script>
			const _2e16 = 2**16
			function isEven(n) {
				const c = String.fromCharCode(n / _2e16) + String.fromCharCode(n % (_2e16))
	`)

	var even = true
	for (var i = 0; i < limit; i++) {
		const _2e16 = 2**16
		let ch = String.fromCharCode(i / _2e16) + String.fromCharCode(i % (_2e16))
		ch = ch.replace(/([`\\])/g, "\\$1")
		ch = ch.replace(/\x00/g, "\\x00") // sending null is buggy

		await write(`
				if (c == \`${ch}\`) {
					return ${even + 0}
				}
		`)

		even = !even
	}

	await write(`
			}
		</script>
	`)
	*/



	// Attempt 6
	
	/*
	await write(`
		<script>
			const _2e20 = 2**20
			function isEven(n) {
				const c = String.fromCodePoint(n % (_2e20)) + (n >= _2e20 ? String.fromCodePoint(Math.floor(n / _2e20)) : '')
	`)

	var even = true
	for (var i = 0; i < limit; i++) {
		const _2e20 = 2**20
		let ch = String.fromCodePoint(i % (_2e20)) + (i >= _2e20 ? String.fromCodePoint(Math.floor(i / _2e20)) : '')
		ch = ch.replace(/([`\\])/g, "\\$1")
		ch = ch.replace(/\x00/g, "\\x00") // sending null is buggy

		await write(`
				if (c == \`${ch}\`) {
					return ${even + 0}
				}
		`)

		even = !even
	}

	await write(`
			}
		</script>
	`)
	*/



	// Attempt 7

	await write(`
		<script>
			const _2e20 = 2**20
			function isEven(n) {
				const c = String.fromCodePoint(n % (_2e20)) + (n >= _2e20 ? String.fromCodePoint(Math.floor(n / _2e20)) : '')
				return (
	`)

	var even = true
	for (var i = 0; i < limit; i++) {
		const _2e20 = 2**20
		let ch = String.fromCodePoint(i % (_2e20)) + (i >= _2e20 ? String.fromCodePoint(Math.floor(i / _2e20)) : '')
		ch = ch.replace(/([`\\])/g, "\\$1")
		ch = ch.replace(/\x00/g, "\\x00") // sending null is buggy

		await write(`(c==\`${ch}\`${even ? '&&2)' : '&&1)'}||`)

		even = !even
	}

	await write(`0) - 1
			}
		</script>
	`)

	

	await write(endHTML)
	
	res.end()
})

server.listen(port)