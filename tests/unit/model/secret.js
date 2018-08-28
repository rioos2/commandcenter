import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';

describe('Unit: Model: secret', () => {
  setupTest('secret', { needs: [] });

  it('has a type of "secret"', function() {
    let model = this.subject();

    expect(model.get('type')).to.equal('secret');
  });


});