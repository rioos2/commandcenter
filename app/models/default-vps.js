const DefaultVps = Ember.Object.extend({});

DefaultVps.reopenClass({
  computeType: "gpu",
  domain: "rioosbox.com",
  region: "chennai",
  cpuCore: 2,
  ram: 1,
  storage: 20,
  network:"private_ipv4",
  destro:"ubuntu",
  destroVersion: "14.04",
  secret: "SSH-1(RSA)",
  secretTypes: ["SSH-1(RSA)", "SSH-1(RSA2)", "SSH-1(RSA3)"],
  bitsInKey: "2048",

});
export default DefaultVps;
