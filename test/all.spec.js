const path = require('path')
const webpack = require('webpack')
const WebpackRecompilationSimulator = require('../webpack-recompilation-simulator')
const GlobalVarReplace = require('../dist')


const OUTPUT_DIR = path.join(__dirname, '../examples');

describe('GlobalVarReplaceTest', () => {

    it('should all be replaced', () => {

        const config = {
            mode:'development',
            entry: path.join(__dirname, 'fixtures/index.js'),
            output: {
              path: OUTPUT_DIR
            },
            plugins: [
                new GlobalVarReplace({
                    options:{
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
                })
            ]
          };

          const webpackSimulator  = new WebpackRecompilationSimulator(webpack(config));
          webpackSimulator.run().then(res=>{
              console.log(res)
          })


    })

})