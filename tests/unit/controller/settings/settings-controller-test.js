import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';

describe('settings-controller', () => {
  setupTest();

  it('exists', function() {
    let controller = this.owner.lookup('controller:settings');

    expect(controller).to.be.ok;
  });
});
