import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';

describe('Unit: Model: reports', () => {
  setupTest('reports', { needs: [] });

  it('has a type of "reports"', function() {
    let model = this.subject();

    expect(model.get('type')).to.equal('reports');
  });


});
