# build.js
Build your JavaScript projects the way you allways wanted!

*build.js* is a JavaScript **preprocessor** introducing `@require('file.js')` calls to easily give your projects a clean structure.

It recoursively parses your files starting at `file1 [file2...]` and include dependencies at the right place, but only once for the whole project. Simply put `@require('path/lib.js')` (CSS style @import will also work) where you want the file to be. Can't be easier.

## Usage
Here's the helpscreen of build.js: 

	Usage: build.js [-cvs] [-b path] [-o out] file1 [file2...]

	Options:
	  -c, --compress  Compress output with UglifyJS                  [boolean]
	  -o, --output    Output file. Defaults to stdout              
	  -b, --base      Base directory of scripts relative to current
	  -v, --verbose   Be more verbose and log every step             [boolean]
	  -s, --strict    Exit when a requested file can't be found      [boolean]

The easiest way to combine all the files of your projects in the right order works like this:

`build.js main.js > result.js`

## Options, explained
### -c, --compress
Compresses (mangles names and minifies) your scripts through UglifyJS

### -o, --output
Specify a path here that shall be used as ouput. When not given, result will be piped to `stdout` and logs will be written to `buildjs.log`. If a output file is given, your terminal will show the most important steps, warnings and errors.

### -b, --base
Specify a directory realtive to current that will be used as base for your *required* scripts (not the start-files and not the output file!)

### -v, --verbose
Be more (really) verbose about requiring files

### -s, --strict
When build.js can't find a specified file, it still will continue (if possible). With this option, execution will be aborted when a file can't be read.

## Acknowledgements 
### Libraries
#### optimist
for [comandline option parsing](https://github.com/substack/node-optimist)

#### winston
a library for [asynchronous logging to different transports](https://github.com/flatiron/winston)

#### UglifyJS
for [fast and efficient minifycation](https://github.com/mishoo/UglifyJS)