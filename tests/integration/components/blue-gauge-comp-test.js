import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('blue-gauge-comp', 'Integration | Component | blue gauge comp', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{blue-gauge-comp}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:"
  this.render(hbs`
    {{#blue-gauge-comp}}
      template block text
    {{/blue-gauge-comp}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
