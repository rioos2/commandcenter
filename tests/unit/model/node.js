import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';

describe('Unit: Model: node', () => {
  setupTest('node', { needs: [] });

  it('has a type of "node"', function() {
    let model = this.subject();

    expect(model.get('type')).to.equal('node');
  });


});
