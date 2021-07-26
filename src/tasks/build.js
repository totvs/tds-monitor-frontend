"use strict";

let path = require("path"),
	exorcist = require("exorcist"),
	watchify = require("watchify"),
	babelify = require("babelify"),
	tfilter = require("tfilter"),
	browserifyCss = require("browserify-css"),
	//babelPresetEnv = require('@babel/preset-env'),

	browserify = require("browserify"),
	shelljs = require("shelljs"),
	Q = require("q"),
	pumpPromise = require("pump-promise"),
	source = require("vinyl-source-stream"),
	buffer = require("vinyl-buffer");

/*
var uglifyOptions = {
	output: {
		semicolons: true
	}
};
*/

const extraImports = {
	"lit-html/directives/class-map.js": "lit-html/directives/class-map",
};

module.exports = function (gulp, plugins, basedir, argv) {
	let pkg = require(path.join(basedir, "package.json")),
		jsSrcDir = path.join(basedir, "src", "main", "ts"),
		destFolder = path.join(basedir, "target"),
		finalName = pkg.name.replace(/\//g, "-").replace(/@/g, "");

	return function () {
		return Q()
			.then(() => buildVendor())
			.then(() => buildProject())
			.then(() => copyResources());
	};

	function buildProject() {
		let bundler = null,
			browserifyOptions = {
				basedir: jsSrcDir,
				browserField: false,
				debug: true,
				extensions: [".js", ".ts", ".css"],
			};

		bundler = browserify(browserifyOptions)
			.transform(browserifyCss, {
				onFlush: function (options, done) {
					done(
						[
							`var css = require('lit-element').css;`,
							``,
							`module.exports.style = css\`${options.data}\`;`,
						].join("\n")
					);
				},
			})
			.transform(
				babelify.configure({
					extensions: [".js", ".jsx", ".ts", ".tsx", ".css"],
				})
			);

		Object.keys(pkg.dependencies).forEach((key) => {
			bundler.external(key);
		});

		Object.keys(extraImports).forEach((key) => {
			bundler.external(extraImports[key]);
		});

		bundler.add("index.ts");

		if (argv.watch) {
			console.log(`-> Watching project ${pkg.name}...`);

			bundler = watchify(bundler);
			bundler.on("update", function (files) {
				console.log(`-> Rebuilding project ${pkg.name}...`);
				console.log(
					files.map((file) => file.replace(basedir, "\t")).join("\n")
				);

				rebuild().then(() => console.log("-> Done!"));
			});

			bundler.on("error", console.error);
		}

		shelljs.mkdir("-p", destFolder);

		function rebuild() {
			let srcFile = `${finalName}.min.js`,
				mapFile = path.join(
					destFolder.replace(basedir + path.sep, ""),
					srcFile + ".map"
				);

			return pumpPromise([
				bundler.bundle(),
				exorcist(mapFile),

				source(srcFile),
				buffer(),

				//plugins.sourcemaps.init({ loadMaps: true, largeFile: true }),
				// uglify bagunca o sourcemaps, verificar
				//plugins.uglify(uglifyOptions),
				//plugins.sourcemaps.write('.'),

				gulp.dest(destFolder),
			]);
		}

		return rebuild();
	}

	function buildVendor() {
		let bundler = null,
			browserifyOptions = {
				browserField: true,
				noParse: [],
				debug: true,
			},
			dependencies = new Set();

		Object.keys(pkg.dependencies).forEach((key) => {
			dependencies.add(key);
		});

		//browserifyOptions.noParse = Array.from(dependencies);

		//console.log('no-parse', browserifyOptions.noParse);

		bundler = browserify(browserifyOptions);

		//console.log('babelrc');

		let babelrc = JSON.parse(shelljs.cat(path.join(basedir, ".babelrc")));

		//console.log('babelrc', JSON.stringify(babelrc, null, 4));

		//let includes = new RegExp(`node_modules/(${dependencies.join('|')})`.replace(/[\/\\]/g, '[\\/\\\\]'));

		//console.log(includes);

		let presets = Array.from(babelrc.presets);

		//presets[0][1].modules = false;

		//console.log('presets', JSON.stringify(presets, null, 4));

		//bundler.transform(babelify);

		//bundler.transform(tfilter(babelify, { include: includes }), {
		//bundler.transform(babelify, {
		bundler.transform(tfilter(babelify, { include: /node_modules/ }), {
			global: true,
			extensions: [".js", ".jsx", ".ts", ".tsx"],
			babelrc: false,
			presets: presets,
			plugins: babelrc.plugins,
		});

		dependencies.forEach((key) => {
			bundler.require(require.resolve(key), { expose: key });
		});

		Object.keys(extraImports).forEach((key) => {
			bundler.require(require.resolve(key), {
				expose: extraImports[key],
			});
		});

		shelljs.mkdir("-p", destFolder);

		let vendorFile = `${finalName}-vendor.js`; //path.join(destFolder.replace(basedir + path.sep, ''), srcFile + '.map');

		return pumpPromise([
			bundler.bundle(),
			exorcist(`${destFolder}/${vendorFile}.map`),

			source(vendorFile),
			buffer(),

			//plugins.sourcemaps.init({ loadMaps: true, largeFile: true }),
			// uglify bagunca o sourcemaps, verificar
			//plugins.uglify(uglifyOptions),
			//plugins.sourcemaps.write('.'),

			gulp.dest(destFolder),
		]);
	}

	function copyResources() {
		let srcFolder = path.join(basedir, "src", "main", "resources"),
			srcFiles = path.join(srcFolder, "*"),
			destFolder = path.join(basedir, "target");

		if (argv.watch) {
			gulp.watch(srcFolder, function update(done) {
				console.log("-> Updating resources...");
				shelljs.cp("-ru", srcFiles, destFolder);
				console.log("-> Done!");
				done();
			});
		}

		shelljs.cp("-ru", srcFiles, destFolder);
	}
};
