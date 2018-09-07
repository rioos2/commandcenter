import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';

describe('Unit: Model: wizard', () => {
  setupTest('wizard', { needs: [] });

  it('has a type of "wizard"', function() {
    let model = this.subject();

    expect(model.get('type')).to.equal('wizard');
  });


});
