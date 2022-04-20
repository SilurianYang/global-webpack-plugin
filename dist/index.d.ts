declare type objectAny = {
    [propName: string]: any;
};
declare type PromiseNext = ({ finallyReg, finallyStr }: {
    finallyReg: RegExp;
    finallyStr: string;
}) => void;
declare type beforeReplaceRule = (reg: RegExp, key: string, value: any, next: PromiseNext) => void;
interface defaultConfig {
    options: objectAny;
    beforeReplace: beforeReplaceRule;
}
interface userPostConfig {
    options?: objectAny;
    beforeReplace?: beforeReplaceRule;
}
