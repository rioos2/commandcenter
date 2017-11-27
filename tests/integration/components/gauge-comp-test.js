import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('gauge-comp', 'Integration | Component | gauge comp', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{gauge-comp}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:"
  this.render(hbs`
    {{#gauge-comp}}
      template block text
    {{/gauge-comp}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
