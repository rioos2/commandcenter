import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';

describe('applications-tab-controller', () => {
  setupTest();

  it('exists', function() {
    let controller = this.owner.lookup('controller:applications-tab');

    expect(controller).to.be.ok;
  });
});
