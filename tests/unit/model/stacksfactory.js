import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';

describe('Unit: Model: stacksfactory', () => {
  setupTest('stacksfactory', { needs: [] });

  it('has a type of "stacksfactory"', function() {
    let model = this.subject();

    expect(model.get('type')).to.equal('stacksfactory');
  });


});
