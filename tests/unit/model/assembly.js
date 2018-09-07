import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';
import wait from 'ember-test-helpers/wait';

describe('Unit: Model: assembly', () => {
  setupTest('assembly', { needs: [] });

  it('has a type of "assembly"', function(done) {
    let model = this.subject();

    wait().then(() => {
      expect(model.get('type')).to.equal('assembly');
      done();
    });
  });

  it('hasTerminated hasFailed check', function(done) {
    let model = this.subject();

    model.set('status.phase', 'Terminated');
    model.set('object_meta.name', 'rio001');

    expect(model.get('hasTerminated')).to.be.true;
    expect(model.get('object_meta.name')).to.equal('rio001');
    model.set('status.phase', 'FAILURE');
    expect(model.get('hasFailed')).to.be.true;
    done();
  });

  it('host port and enableConsole check', function(done) {
    let model = this.subject();

    model.set('metadata.rioos_sh_vnc_host', '127.0.0.1');
    model.set('metadata.rioos_sh_vnc_port', '8000');
    expect(model.get('host')).to.equal('127.0.0.1');
    expect(model.get('port')).to.equal('8000');
    expect(model.get('enableConsole')).to.be.true;
    done();

  });






});
