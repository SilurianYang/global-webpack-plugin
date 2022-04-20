type objectAny={[propName: string]: any;};
type PromiseNext=({
    finallyReg,
    finallyStr
}:{
    finallyReg:RegExp;
    finallyStr:string
})=>void


type beforeReplaceRule=(
    reg:RegExp,
    key:string,
    value:any,
    next:PromiseNext
)=>void

interface defaultConfig {
    options:objectAny;
    beforeReplace:beforeReplaceRule
}

interface userPostConfig {
    options?:objectAny;
    beforeReplace?:beforeReplaceRule
}

module.exports=  class GlobalVarReplace{

    CONFIG:defaultConfig={
        options:{},
        beforeReplace:(reg,key,value,next)=>{
            next({
                finallyReg:reg,
                finallyStr:JSON.stringify(value).replace(/"/g,`'`)
            });
        }
    }

    constructor(config:userPostConfig={}){
        this.CONFIG={
            ...this.CONFIG,
            ...config
        };
    }

    apply(
        compiler: { hooks: { emit: { tapPromise: (arg0: string, arg1: (compilation: any) => Promise<void>) => void; }; }; }
    ):Boolean{
        if(Object.keys(this.CONFIG.options).length===0){
            return false;
        }
        compiler.hooks.emit.tapPromise('GlobalVarReplace',compilation=>{
            return new Promise<void>(async resolve=>{
                const {chunks,assets}=compilation;

                for(let i=0;i<chunks.length;i++){

                    for(let j=0;j<chunks[i].files.length;j++){
                        const fileName=chunks[i].files[j]

                        const sourceStr:string=assets[fileName].source();
                        const fileContent=await this.variableReplace(sourceStr);
                        assets[fileName]={
                            source:()=>fileContent,
                            size:()=>{
                                return Buffer.byteLength(fileContent, 'utf8');
                            }
                        }

                    }
                }
                resolve();
            })
        })
        return true
    }
    variableReplace(
        sourceStr:string
    ):Promise<string>{
        return new Promise(async resolve=>{
            const {options,beforeReplace}=this.CONFIG;

            const keys=Object.keys(options).sort((a,b)=>b.length-a.length);

            for(let i=0;i<keys.length;i++){
                const key= keys[i];
                const value=options[key];

                const reg=new RegExp(key,'g');
                const {finallyReg,finallyStr}= await new Promise((
                    next:PromiseNext
                )=>{
                    return beforeReplace(reg,key,value,next)
                });
                sourceStr=sourceStr.replace(finallyReg,finallyStr);
            }
    
            return resolve(sourceStr);
        })
    }

}
