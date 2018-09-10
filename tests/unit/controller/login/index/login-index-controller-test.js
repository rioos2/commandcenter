import { describe, it } from 'mocha';
import { expect } from 'chai';
import { setupTest } from 'ember-mocha';
import EmberObject from '@ember/object';

describe('Unit: Controller: editor', () => {
  setupTest('controller:login/index', {
    needs: [
      'service:access',
      'service:intl',
    ]
  });

  // Replace this with your real tests.
  it('editor controller exists', function() {
    let controller = this.subject();

    controller.set('session', EmberObject.create({
      controller: {},
      service:    {},
    }));

    expect(controller).to.be.not_ok;
  });

  it('set username and password test', function() {
    let ctrl = this.subject();
    let controller = this.subject();

    controller.set('session', EmberObject.create({
      controller: {},
      service:    {},
    }));
    ctrl.set('username', 'riouser');
    expect(ctrl.get('username')).to.equal('riouser');

  });
});
