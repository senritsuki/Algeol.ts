export const E = 0; //1e-6;

export interface TestData<T> { s: string; v: T; v2: T; }
export const data = <T>(s: string, v: T, v2: T): TestData<T> => ({s, v, v2});
export const dataNum = (s: string, v: number, v2: number) => data<number>(s, v, v2);
export const dataNumArray = (s: string, v: number[], v2: number[]) => data<number[]>(s, v, v2);
export const dataNumArray2 = (s: string, v: number[][], v2: number[][]) => data<number[][]>(s, v, v2);
export const dataStr = (s: string, v: string, v2: string) => data<string>(s, v, v2);

export const evalNum = (v: number, v2: number, e: number) => Math.abs(v2 - v) <= e;
export const evalNumArray = (v: number[], v2: number[], e: number) => v.length === v2.length ? v.map((v, i) => evalNum(v, v2[i], e)).reduce((a, b) => a && b, true) : false;
export const evalNumArray2 = (v: number[][], v2: number[][], e: number) => v.length === v2.length ? v.map((v, i) => evalNumArray(v, v2[i], e)).reduce((a, b) => a && b, true) : false;
export const evalStr = (v: string, v2: string) => v === v2;

export interface TestResult { s: string; b: boolean; }
export interface TestGroupResult { group: string; results: TestResult[]; }
export interface OkNg { ok: number; ng: number; }

export const okng0: OkNg = {ok: 0, ng: 0};
export const countOkNg = (okng: OkNg, r: TestResult): OkNg => ({ok: okng.ok + (r.b === true ? 1 : 0), ng: okng.ng + (r.b === false ? 1 : 0)});
export const mergeOkNg = (a: OkNg, b: OkNg): OkNg => ({ok: a.ok + b.ok, ng: a.ng + b.ng});

export function tests<T>(tds: TestData<T>[], evalFn: (v: T, v2: T, e: number) => boolean, e: number=E): TestResult[] {
    return tds.map(td => {
        const b = evalFn(td.v, td.v2, e);
        const s = `${td.s} -> ${td.v} == ${td.v2}`;
        return {s, b};
    });
}

export function printModule(name: string, groups: TestGroupResult[]): OkNg {
    let okng: OkNg = {ok: 0, ng: 0};
    console.log();
    console.log(name);
    console.log('================================');
    groups.forEach(group => {
        const okng2 = group.results.reduce((okng, r) => countOkNg(okng, r), okng0);
        console.log(`## ${group.group}`);
        group.results.forEach(d => console.log(`- ${d.b}: ${d.s}`));
        console.log(`- ${okng2.ng === 0}: ${okng2.ok} / ${okng2.ok + okng2.ng}`);
        okng = mergeOkNg(okng, okng2);
    });
    console.log('## total');
    console.log(`- ${okng.ng === 0}: ${okng.ok} / ${okng.ok + okng.ng}`);
    console.log();
    return okng;
}
