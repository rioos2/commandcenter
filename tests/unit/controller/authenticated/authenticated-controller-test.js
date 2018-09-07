import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';
import wait from 'ember-test-helpers/wait';

describe('authenticated-controller', function() { // eslint-disable-line
  setupTest();

  it('exists', function(done) {
    let controller = this.owner.lookup('controller:authenticated');

    wait().then(() => {

      expect(controller).to.be.ok;
      done();
    });
  });
});
