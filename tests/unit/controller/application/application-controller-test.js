import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';
import EmberObject from '@ember/object';

describe('Unit: Controller: application', () => {
  setupTest('controller:application', {
    needs: [
      'service:settings',
      'service:tooltipService',
      'service:resourceActions',
      'queryParams',
      'redirectTo'
    ]
  });
  it('application controller exists', function() {
    let controller = this.subject();

    controller.set('session', EmberObject.create({
      resourceActions: {},
      service:         {},
    }));

    expect(controller).to.be.not_ok;
  });

});
