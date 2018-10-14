import Component from '@ember/component';
import {
  set,
  get,
  computed
} from '@ember/object';

import C from 'nilavu/utils/constants';
import { inject as service } from '@ember/service';
import { substrings } from 'nilavu/helpers/substrings';
import { isEmpty } from '@ember/utils';
import DefaultHeaders from 'nilavu/mixins/default-headers';
import  R  from 'ramda';

export default Component.extend(DefaultHeaders, {
  intl:          service(),
  notifications: service('notification-messages'),

  showSpinner:   false,

  // The default notifiers, this may not be needed.
  ns: [C.SETTING.EMAIL, C.SETTING.SLACK],

  // The notifiers to show
  notifiers: computed('ns', function() {
    const n = get(this, 'ns');

    const abbrev = (y) => {
      return  { title: y }
    };

    return  R.map(abbrev, n);
  }),

  // The built in rules
  allRules: computed('model.alertBuiltinRules', function() {
    return this.get('model.alertBuiltinRules.content');
  }),

  defaultRuleId: computed('allRules', function() {
    const rrs = get(this, 'allRules');

    const rr1 = rrs.firstObject;

    if (!isEmpty(rr1)) {
      return rr1.id;
    }

    return '';

  }),

  // The set rule by id
  ruleById: computed('allRules', 'selectedRuleId', function() {
    const rules = get(this, 'allRules');
    const id = get(this, 'selectedRuleId');

    return R.find(R.propEq('id', id))(rules);
  }),

  rule: computed('ruleById', function() {
    const r = get(this, 'ruleById');

    if (!isEmpty(r) && !isEmpty(r.rules)) {
      return r.rules.firstObject;
    }

    return {};
  }),

  formattedRules: computed('allRules', function() {
    const ar = get(this, 'allRules');

    const abbrev = (x) => {
      let rt = '';

      if (!isEmpty(x.rules) && x.rules.firstObject) {
        rt = x.rules.firstObject.rule_type;
      }

      return  {
        value: x.id,

        text: rt
      };
    };

    return R.map(ar, abbrev);

  }),

  labelsBtwn: computed('rule', function() {
    const rule = get(this, 'rule');

    if (isEmpty(rule) || isEmpty(rule.expression)) {
      return {};
    }

    let found = substrings().get(rule.expression, '{{', '}}');

    const expand = (e) => {
      set(this, `showEditBox-${ e }`, true);

      return {
        'id': e,

        'label': rule.labels[e],
      }
    }

    set(this, 'unfilled', R.map(expand, found));

    this.asExpression(found);

    return get(this, 'unfilled');
  }),

  didInsertElement() {
    this.set('content', get(this, 'notifiers'));
    this.set('selectedRuleId', get(this, 'defaultRuleId'));
    this.set('selectedNotifiers', []);
  },



  asExpression(lbls) {
    let lbs = {};

    const setter = (s) => lbs[s] = '';

    set(this, 'kvExpression', R.map(setter, lbls));
  },

  actions: {   // eslint-disable-line

    //
    ruleChanged(id) {
      const r = get(this, 'ruleById');

      set(this, 'rule', r);
    },

    // When a notifier is selected, add it in selectedNotifiers
    notifierChanged(notifier) {
      const n = get(this, 'selectedNotifiers');

      n.push(notifier);
      // is this needed ?
      set(this, 'selectedNotifiers', n);
    },

    // When the expression label values are updated
    expressionUpdated(value, targetRef) {

      set(this, `showEditBox-${ targetRef }`, true);

      if (isEmpty(value.trim())) {
        this.get('notifications').warning(get(this, 'intl').t('dojos.settings.alerts.rules.required'), {
          autoClear:     true,
          clearDuration: 4200,
          cssClasses:    'notification-warning'
        });
      } else {
        set(this, `kvExpression-${ targetRef }`, value);
        document.getElementById(`kvExpressionValue-${ targetRef }`).innerHTML = value;
      }
    },

    // Submit the rule. See if the labels in expression are filled.
    submit() {
      if (!this.hasFilled()) {
        this.get('notifications').warning(get(this, 'intl').t('dojos.settings.alerts.rules.required'), {
          autoClear:     true,
          clearDuration: 4200,
          cssClasses:    'notification-warning'
        });

        return;
      } else {
        set(this, 'showSpinner', true);

        this.get('store').request(this.rawRequestOpts({
          url:    '/api/v1/alertrules',
          method: 'POST',
          data:   this.build(),
        })).then(() => {
          $('#alert_rule_modal').modal('hide'); // eslint-disable-line
          set(this, 'modelSpinner', false);
          set(this, 'showSpinner', false);
          this.refresh();
          this.sendAction('doReload');
        }).catch((_) => {
          this.get('notifications').warning(get(this, 'intl').t('dojos.settings.alerts.rules.somethingWrong'), {
            autoClear:     true,
            clearDuration: 4200,
            cssClasses:    'notification-warning'
          });
          set(this, 'showSpinner', false);
          set(this, 'modelSpinner', false);
        });
      }
    }
  },

  hasFilled() {
    const es = this.get('unfilled');

    const filled = (f) => isEmpty(this.get(`asExpression-${ f.id }`));

    return R.reduce(true, filled, es);
  },


  build() {
    let uf = this.get('unfilled');

    const fullRule = get(this, 'ruleById');

    let rule = get(this, 'rule');

    const replacer = (a) => {
      const id = `asExpression-${ a.id }`;

      // insert expression values into labels
      rule.labels[`${ a.id }_value`] = get(this, id);

      // build expression data
      rule.expression = substrings().replace(rule.expression, `{{${ a.id }}}`, this.get(id));
    }

    // Replace the expression with the filled label values.
    R.map(replacer, uf);

    return {
      'object_meta': fullRule.object_meta,

      'state':    C.SETTING.ACTIVE,

      'rules':    rule,

      'metadata': { 'alertbuiltinrule': rule.id },

      'notifiers': R.map((c) => c.name, get(this, 'selectedNotifiers'))
    };

  },

  clear() {
    const u = this.get('unfilled');

    const cr = (c) =>  {

      set(this, `kvExpression-${ c.id }`, '');
      set(this, `kvExpressionValue-${ c.id }`, '');

    };

    R.map(cr, u);

  },

  refresh() {
    this.clear();

    const v = get(this, 'formattedRules');

    if (!isEmpty(v)) {
      const v1 = v.firstObject

      $('#alerts_rules_type').val(v1.value).trigger('change'); // eslint-disable-line
    }

    this.setProperties({ selectedNotifiers: [] });
  },

})
