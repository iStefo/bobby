var argv = require('optimist')
		.usage('Usage: $0 [-cvs] [-b path] [-o out] file1 [file2...]')
		.boolean('c')
		.alias('c','compress')
		.describe('c', 'Compress output with UglifyJS')
		.alias('o','output')
		.describe('o', 'Output file. Defaults to stdout')
		.alias('b','base')
		.describe('b', 'Base directory of scripts relative to current')
		.boolean('v')
		.alias('v','verbose')
		.describe('v', 'Be more verbose and log every step')
		.boolean('s')
		.alias('s','strict')
		.describe('s', 'Exit when a requested file can\'t be found')
		.demand(1)
		.argv,
	path = require('path'),
	util = require('util'),
	fs = require('fs'),
	winston = require('winston');

if (argv.c) {
	var jsp = require('uglify-js').parser;
	var pro = require('uglify-js').uglify;
}

builder = {
	baseDir: null,
	loaded: {},
	buffer: '',
	gotError: false
}

var loggingLevels = {
  levels: { step: 0, info: 1, warn: 2, error: 3 },
  colors: { step: 'grey', info: 'white', warn: 'yellow', error: 'red' }
};
var logger = new winston.Logger({ transports: [ ], levels: loggingLevels.levels, exitOnError: false });
winston.addColors(loggingLevels.colors);

if (argv.o) {
	logger.add(winston.transports.Console, { 'timestamp': false, 'colorize': true, 'level': (argv.v) ? 'step' : 'info' });
} else {
	logger.add(winston.transports.File, { 'filename': 'bobby.log', json: false, timestamp: true, 'level': (argv.v) ? 'step' : 'info' });
}

logger.on('logging', function (transport, level, msg, meta) {
	if (level === 'error') {
		console.log('Exit due to previous error.');
		process.exit(1);
	}
});

// dertermine base directory
builder.baseDir = path.normalize(path.join(process.cwd(), argv.b));
if (!path.existsSync(builder.baseDir)) {
	logger.error('Base dir ' + builder.baseDir + ' doesn\'t exist');
}

var readParseAdd = function readParseAdd(fileName) {
	var data, lines;
	if (!builder.loaded[fileName]) {
		try {
			data = fs.readFileSync(path.join(builder.baseDir,fileName), 'utf8');
		} catch (err) {
			if (argv.s) {
				logger.error(err.toString());
			} else {
				logger.warn('Unable to read file \'' + fileName + '\'');
			}
			return;
		}
		builder.loaded[fileName] = true;
		logger.step('Read file \'' + fileName + '\' and marked as loaded');
		lines = data.split('\n');
		lines.forEach(function(line, lineNumber) {
			var matches = line.match(/^@(require|import)\([\"\']?([^\"\'\)]*)[\"\']?\)/);
			if (matches && matches.length > 1) {
				// found require statement
				logger.step('\tfound @' + matches[1] + ' statement in ' + fileName + ':' + lineNumber);
				// validate path
				if (matches.length === 3 && matches[2].length > 2 && !matches[2].match(/[,|]+/)) {
					var newFile = matches[2];
					logger.step('\t...referencing to \'' + newFile + '\'');
					readParseAdd(newFile);
				} else {
					logger.warn('Invalid path in ' + fileName + ':' + lineNumber + ': \'' + line + '\'');
				}
			} else {
				// add line to buffer
				builder.buffer += line + '\n';
			}
		});
  } else {
  	logger.step('Requested file \'' + fileName + '\', but allready loaded');
  }
};

logger.info('Start reading files with base directory \'' + builder.baseDir + '\'');
argv._.forEach(function(file) {
	readParseAdd(file);
});
// if logging is too slow to end process (asnyc logging to file): don't produce any output after error!
if (builder.gotError) {
	process.exit(1);
}
// uglify if wanted
if (argv.c) {
	logger.step('Compress buffer with UglifyJS');
	var ast = jsp.parse(builder.buffer);
	ast = pro.ast_mangle(ast);
	ast = pro.ast_squeeze(ast);
	builder.result = pro.gen_code(ast);
	logger.info('Compressed result (' + builder.buffer.length + 'b -> ' + builder.result.length + 'b, ' + (100* builder.result.length/builder.buffer.length).toFixed(2) + '%)');
} else {
	builder.result = builder.buffer;
}
if (argv.o) {
	logger.info('Write result to file \'' + path.join(process.cwd(),argv.o) + '\'');
	try {
		fs.writeFileSync(path.join(process.cwd(),argv.o), builder.result, 'utf8');
	} catch (err) {
		logger.error(err);
	}
} else {
	console.log(builder.result);
}
