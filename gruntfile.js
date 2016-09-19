module.exports = function(grunt){

	grunt.initConfig({
		watch:{
			jade:{
				files:['/app/views/**'],
				options:{
					livereload:true
				}
			},
			js:{
				files:['public/js/**','models/**/*.js','schemas/**/*.js'],
				//tasks:['jshint'],
				options:{
					livereload:true
				}
			}
		},

		nodemon:{
			dev:{
				script: 'app.js',
				options:{
					//files:'app.js',
					args: ['dev'],
					cwd: __dirname,
      				ignore: ['node_modules/**'],
					watchedExtensions:['js'],
					watchedFolders:['./'],
					debug:true,
					delayTime:1,
					env:{
						PORT:3000
					}
				}
			}
		},

		concurrent:{
			tasks:['nodemon','watch'],
			options:{
				logConcurrentOutput:true
			}
		},

		mochaTest:{
			options:{
				reporter:'spec'
			},
			src:['test/**/*.js']
		}
	})

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-mocha-test');//做单元测试使用

	grunt.option('force',true)//防止语法错误导致服务停机
	grunt.registerTask('default',['concurrent'])//默认任务
	grunt.registerTask('test',['mochaTest'])
}