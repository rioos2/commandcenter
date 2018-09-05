import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';
import { run } from '@ember/runloop';
import wait from 'ember-test-helpers/wait';

describe('application-controller', () => {
  setupTest();
  this.timeout(15000);
  it('exists', function(done) {
    setTimeout(done, 15000);
    run(() => {
      let controller = this.owner.lookup('controller:application');

      expect(controller).to.be.ok;
    });
    wait().then(() => {
      done();
    });
  });
});
