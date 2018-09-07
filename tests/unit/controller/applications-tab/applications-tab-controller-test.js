import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';
import wait from 'ember-test-helpers/wait';

describe('applications-tab-controller', function() { // eslint-disable-line
  setupTest();

  it('exists', function(done) {
    let controller = this.owner.lookup('controller:applications-tab');

    wait().then(() => {

      expect(controller).to.be.ok;
      done();
    });
  });
});
