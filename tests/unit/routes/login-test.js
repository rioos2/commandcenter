
import {describe, it} from 'mocha';
import {expect} from 'chai';
import {setupTest} from 'ember-mocha';

describe('Unit: Route: login/index', function () {
    setupTest('route:login/index', {
        needs: [
          'service:session',
          'service:intl',
          'service:access'
        ]
    });

    it('exists', function () {
        let route = this.subject();
        expect(route).to.be.ok;
    });
});
