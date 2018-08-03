import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';

describe('stack console controller', () => {
  setupTest();

  it('exists', function() {
    let controller = this.owner.lookup('controller:stack/console');

    expect(controller).to.be.ok;
  });
});
