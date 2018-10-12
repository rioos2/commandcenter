import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';

describe('Unit: Model: team', () => {
  setupTest('team', { needs: [] });

  it('has a type of "team"', function() {
    let model = this.subject();

    expect(model.get('type')).to.equal('team');
  });
});
