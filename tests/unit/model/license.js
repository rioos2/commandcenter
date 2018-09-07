import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';

describe('Unit: Model: license', () => {
  setupTest('license', { needs: [] });

  it('has a type of "license"', function() {
    let model = this.subject();

    expect(model.get('type')).to.equal('license');
  });


});
