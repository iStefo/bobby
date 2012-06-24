# bobby (the little builder)
Build your JavaScript projects the way you allways wanted!

*bobby* is a **JavaScript preprocessor** introducing `@require('file.js')` calls to easily give your projects a clean structure.

It recoursively parses your files starting at `file1 [file2...]` and include dependencies at the right place, but only once for the whole project. Simply put `@require('path/lib.js')` (CSS style @import will also work) where you want the file to be. Can't be easier.

## Usage
Here's the helpscreen of *bobby*: 

	Usage: bobby [-cvs] [-b path] [-o out] file1 [file2...]

	Options:
	  -c, --compress  Compress output with UglifyJS                  [boolean]
	  -o, --output    Output file. Defaults to stdout              
	  -b, --base      Base directory of scripts relative to current
	  -v, --verbose   Be more verbose and log every step             [boolean]
	  -s, --strict    Exit when a requested file can't be found      [boolean]

The easiest way to combine all the files of your projects in the right order works like this:

`bobby main.js > result.js`

## Tips
*bobby* is now available over npm. Simpy `npm install -g bobby` to get it running.

Alternatively, check out this repository and install via `npm install -g .`.

*bobby* becomes really powerfull when combined with tools like [LiveReload](http://livereload.com) or any other filesystem watcher. This way, *bobby* can build your project on the fly before you had even switched to your comandline (if you hadn't used vim all along, but of course you did...)

## Options, explained
### -c, --compress
Compresses (mangles names and minifies) your scripts through UglifyJS

### -o, --output
Specify a path here that shall be used as ouput. When not given, result will be piped to `stdout` and logs will be written to `bobby.log`. If a output file is given, your terminal will show the most important steps, warnings and errors.

### -b, --base
Specify a directory realtive to current that will be used as base for your *required* scripts (not the start-files and not the output file!)

### -v, --verbose
Be more (really) verbose about requiring files

### -s, --strict
When *bobby* can't find a specified file, it still will continue (if possible). With this option, execution will be aborted when a file can't be read.

## Acknowledgements 
### Sponsor
#### Boinx Software
where I'm proud to work at with all the amazing people. They make [cool software for OS X and iOS](http://boinx.com) and payed me for the hours I worked at *bobby*.

### Libraries
#### optimist
for [comandline option parsing](https://github.com/substack/node-optimist)

#### winston
a library for [asynchronous logging to different transports](https://github.com/flatiron/winston)

#### UglifyJS
for [fast and efficient minifycation](https://github.com/mishoo/UglifyJS)

## License
*bobby* is open source licensend under the MIT License. Don't do anything evil with it, won't you?