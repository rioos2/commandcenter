import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';

describe('Unit: Model: event', () => {
  setupTest('event', { needs: [] });

  it('has a type of "event"', function() {
    let model = this.subject();

    expect(model.get('type')).to.equal('event');
  });
});
