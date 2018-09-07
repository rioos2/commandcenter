import { isEmpty, isPresent } from '@ember/utils';
import EmberObject, { computed } from '@ember/object';

// HealthGauges: The builtin dashboard
// An object that has ability to display all the gauges in the format needed.
export default  EmberObject.extend({

  show: computed('model', 'props.[]', function() {

    const model = this.model;

    const hasStuff = isPresent(model) && isPresent(model.counters);

    return this.props.map((p) => {
      if (hasStuff) {
        const counters = model.counters;
        const filtered = counters.filter((f) => f.name === p);
        const counter = filtered.get('firstObject');

        if (!isEmpty(counter)) {

          return   {
            // trim the last character of name which is a comma.
            name: counter.name.replace(/,$/, ''),

            counter: parseInt(counter.counter),

            description: counter.description
          };
        }
      }

      return {

        name: p,

        counter: 0
      };
    });
  }),


});


