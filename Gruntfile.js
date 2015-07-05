module.exports = function(grunt) {

	grunt.initConfig({

		// Import package manifest
		pkg: grunt.file.readJSON("package.json"),

		// Banner definitions
		meta: {
			banner: "/*\n" +
				" *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n" +
				" *  <%= pkg.description %>\n" +
				" *  <%= pkg.homepage %>\n" +
				" *\n" +
				" *  Made by <%= pkg.author.name %>\n" +
				" *  Under <%= pkg.license %> License\n" +
				" */\n"
		},

		// Concat definitions
		concat: {
			options: {
				banner: "<%= meta.banner %>"
			},
			dist: {
				src: ["src/guard.js"],
				dest: "dist/guard.js"
			}
		},

		// Lint definitions
		jshint: {
			files: ["src/guard.js"],
			options: {
				jshintrc: ".jshintrc"
			}
		},

		// Minify definitions
		uglify: {
			my_target: {
				src: ["dist/guard.js"],
				dest: "dist/guard.min.js"
			},
			options: {
				banner: "<%= meta.banner %>"
			}
		},

		// Compile sass
		compass: {
			dist: {
				options: {
					sassDir: 'src/sass/',
		      cssDir: 'dist/',
		      environment: 'production'
		    },
			},
			demo: {
				options: {
				sassDir: 'demo/sass/',
				cssDir: 'demo/',
				environment: 'production'
			}
		}
	},

		// watch for changes to source
		// Better than calling grunt a million times
		// (call 'grunt watch')
		watch: {
		    files: ['src/*'],
		    tasks: ['default'],
				compass: {
					files: ['demo/sass/demo.scss'],
					tasks: ['compass:demo']
				}
		}

	});

	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-compass");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-watch");

	grunt.registerTask("build", ["concat", "uglify", "compass"]);
	grunt.registerTask("default", ["build"]);
	grunt.registerTask("travis", ["default"]);

};
