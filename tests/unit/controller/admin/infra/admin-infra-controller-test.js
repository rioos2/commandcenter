import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';

// import { run } from '@ember/runloop';
// import wait from 'ember-test-helpers/wait';

describe('Unit: Controller: admin/infra', () => {
  setupTest('controller:admin/infra', {});

  // Replace this with your real tests.
  it('exists', function() {
    let controller = this.subject();

    expect(controller).to.be.ok;
  });
});
