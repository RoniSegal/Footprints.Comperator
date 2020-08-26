const expect = require("chai").expect;
const fs = require("fs")

let FP_1 = JSON.parse(fs.readFileSync("fp1.json").toString());
let FP_2 = JSON.parse(fs.readFileSync("fp2.json").toString());


expect(FP_1.methods).to.have.members(FP_2.methods)
expect(FP_1.branches).to.have.members(FP_2.branches)

const FP_2TestToHits = createTestToHitsMap(FP_2);
const FP_1TestToHits = createTestToHitsMap(FP_1);

expect(Object.keys(FP_2TestToHits)).to.have.members(Object.keys(FP_1TestToHits))

Object.keys(FP_2TestToHits).forEach((testName, index) => {
        expect(FP_2TestToHits[testName].methods).to.have.members(FP_1TestToHits[testName].methods)
        expect(FP_2TestToHits[testName].branches).to.have.members(FP_1TestToHits[testName].branches)

});


function createTestToHitsMap(fp) {
    let map = {};
    fp.executions.forEach(exec => {
        exec.hits.forEach(hit => {
            let branchUIDS = hit.branches.map(branch => fp.branches[branch]);
            let methodUIDS = hit.methods.map(method => fp.methods[method]);
            map[hit.testName] = map[hit.testName] || {branches: [], methods: []};
            map[hit.testName].methods = map[hit.testName].methods.concat(methodUIDS);
            map[hit.testName].branches = map[hit.testName].branches.concat(branchUIDS);

        })
    })
    return map;

}
