const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const WebpackRecompilationSimulator = require('../webpack-recompilation-simulator')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const GlobalVarReplace = require('../dist')
const rimraf = require('rimraf');


const OUTPUT_DIR = path.join(__dirname, '../examples');
const filename='index_bundle.js'


const options={
    USER_INFO:[{
        name:'hhyang',
        ages:23
    }],
    HHYANG_TEST:true,
    HHYANG_TEST2:"true",
    HHYANG_TEST3:'1784848',
    HHYANG_TEST4:11212,
    HHYANG_TEST5:'',
    HHYANG_TEST6:{
        name:'hhyang',
        ages:23
    }
}


describe('GlobalVarReplaceTest', () => {

    beforeEach(done => {
        rimraf(OUTPUT_DIR, done);
    });

    it('should all be replaced', () => {

        const config = {
            mode:'production',
            entry: path.join(__dirname, 'fixtures/index.js'),
            output: {
              path: OUTPUT_DIR,
              filename
            },
            plugins: [
                new HtmlWebpackPlugin(),
                new GlobalVarReplace({
                    options
                })
            ]
          };

          const compiler   = new WebpackRecompilationSimulator(webpack(config));

          return compiler.run().then(stats=>{
              const text= fs.readFileSync(OUTPUT_DIR+'/'+filename,'utf-8').toString();
              for(let key in options){
                const value =options[key];
                const regText=JSON.stringify(value).replace(/"/g,`'`);

                expect(text).toMatch(regText);
              }
          })

    })

})