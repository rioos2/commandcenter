import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';

describe('Unit: Model: datacenter', () => {
  setupTest('datacenter', { needs: [] });

  it('has a type of "datacenter"', function() {
    let model = this.subject();

    expect(model.get('type')).to.equal('datacenter');
  });
});
