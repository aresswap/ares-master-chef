const MasterChef = artifacts.require("MasterChef");
// 0x809Efde6011DD5D641394f03f3F260B43D083a32 (Ares Token)
// 0xEa93df45a8e574E2499728A04cbC39387d03cC0C (DAres Token)
module.exports = function (deployer) {
  deployer.deploy(MasterChef, "0x809Efde6011DD5D641394f03f3F260B43D083a32","0xEa93df45a8e574E2499728A04cbC39387d03cC0C","0x8587d0FECb4F222fC833cf999F68DE5664078F46","5419500");
};

// 1642344279
// 5419456
// 5419500