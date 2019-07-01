'use strict';

let gulp = require('gulp'),
	shelljs = require('shelljs'),
	path = require('path'),
	yargs = require('yargs');

let tasksDir = path.join(__dirname, 'src', 'tasks'),
	tasks = shelljs.ls(tasksDir),
	plugins = {},
	argv = yargs.argv;

tasks.forEach((filename) => {
	let taskname = path.basename(filename, '.js'),
		taskfile = path.join(tasksDir, filename),
		taskaction = require(taskfile)(gulp, plugins, __dirname, argv);

	gulp.task(taskname, taskaction);
});
