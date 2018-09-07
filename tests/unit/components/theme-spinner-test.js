import { describe, it } from 'mocha';
import { expect } from 'chai';
import { setupComponentTest } from 'ember-mocha';

describe('Unit: Component: theme-spinner', () => {
  setupComponentTest('theme-spinner', {
    unit: true
    // specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar']
  });

  it('renders', function() {

    // creates the component instance
    let component = this.subject();
    // this need to be set as true because this component only shown by 'show' property
    // component.set('show', true);

    expect(component._state).to.equal('preRender');

    // renders the component on the page
    this.render();
    expect(component._state).to.equal('inDOM');
  });
});
