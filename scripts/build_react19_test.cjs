const webpack=require('webpack'),path=require('path');
webpack({mode:'development',entry:path.resolve('tests/fixtures/react19.js'),output:{path:path.resolve(process.argv[2]),filename:'react19.js'},resolve:{modules:[path.resolve('node_modules'),'node_modules']},devtool:false},(error,stats)=>{
 if(error||stats.hasErrors()){process.stderr.write(String(error||stats.toString({all:false,errors:true})));process.exitCode=1;}
});
