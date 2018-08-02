import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';

describe('application-controller', () => {
  setupTest();

  it('exists', function() {
    let controller = this.owner.lookup('controller:application');

    expect(controller).to.be.ok;
  });
});
