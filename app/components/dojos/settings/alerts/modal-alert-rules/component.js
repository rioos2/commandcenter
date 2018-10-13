/* eslint-disable */
import Component from '@ember/component';
import { set, get, computed } from '@ember/object';
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

  ns: [C.SETTING.EMAIL, C.SETTING.SLACK],

  notifiers: computed('ns', function() {
    const n = get(this, 'ns');

     const abbrev = y => {return { title: y } };

     return  R.map(abbrev, n);
   }),

  didInsertElement() {
    this.set('content', get(this, 'notifiers'));
    this.set('selectedNotifiers', []);
    alert("--- test");
  },

  allRules: computed('model.alertBuiltinRules', function() {
    return this.get('model.alertBuiltinRules.content');
  }),

  ruleById: computed('allRules', 'id', function() {
    const rules = get(this,'allRules');
    const id = get(this, 'id');
alert("ruleById");
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
    const r = get(this, 'allRules');

    const abbrev = x => {
      let rt = "";

      if(!isEmpty(x.rules) && x.rules.firstObject) {
         rt = x.rules.firstObject.rule_type;
      }

      return  { value: x.id, text: rt };
    };
  }),

  labelsBtwn:computed('rule', function() {
    const rule = get(this, 'rule');

    if (isEmpty(rule) || isEmpty(rule.expression)) {
      return {};
    }

    let found = substrings().get(rule.expression,"{{","}}");

    const expand = e => {
      set(this, `showEditBox-${e}`, true);
      return {
        'id': e,
        'label': rule.labels[e],
      }

    }

    set(this, 'unfilled', R.map(expand, found));

    this.asExpression(found);

    return get(this, 'unfilled');
  }),

  asExpression(lbls) {
    let lbs = {};

    const setter = s => lbs[s] = "";

    set(this, 'kvExpression', R.map(setter, lbls));
  },

  actions: {

    ruleChanged(id) {
      const r = get(this, 'ruleById');

      set(this, 'rule', r);
    },

    notifierChanged(notifier) {
     const n = get(this, 'selectedNotifiers');

      n.push(notifier);
      // is this needed ?
      set(this, 'selectedNotifiers', n);
    },

    expressionUpdated(value, targetRef) {

      set(this, `showEditBox-${targetRef}`, true);

      if (isEmpty(value.trim())) {
        this.get('notifications').warning(get(this, 'intl').t('dojos.settings.alerts.rules.required'), {
          autoClear:     true,
          clearDuration: 4200,
          cssClasses:    'notification-warning'
        });
      } else {
        set(this, `kvExpression-${targetRef}`, value);
        document.getElementById(`kvExpressionValue-${targetRef}`).innerHTML = value;
      }
    },

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
            $('#alert_rule_modal').modal('hide');
            set(this, 'modelSpinner', false);
            set(this, 'showSpinner', false);
            this.refresh();
            this.sendAction('doReload');
          }).catch((err) => {
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

    const filled = f => isEmpty(this.get(`asExpression-${f.id}`));

    return R.reduce(true, filled, es);
  },


  build() {
    let exprs = this.get('unfilled');

    const n = get(this, 'selectedNotifiers');

    const contract = c => c.name;

    const frule = get(this, 'ruleById');

    let rule = get(this, 'rule');

    const abbrev = a => {
      const id =`asExpression-${a.id}`;
      //insert expression values into labels
      rule.labels[`${a.id}_value`] = get(this,id);

      //build expression data
      rule.expression = substrings().replace(rule.expression, `{{${a.id}}}`, this.get(id));
    }

    return {
      "object_meta": frule.object_meta,
      "state":    C.SETTING.ACTIVE,
      "rules":    rule,
      "metadata": {"alertbuiltinrule": rule.id},
      "notifiers": R.map(contract,n)
    };

  },

  clear() {
    const u = this.get('unfilled');

    const cr = c =>  {
      set(this, `kvExpression-${c.id}`, '');
      set(this, `kvExpressionValue-${c.id}`, '');
    };

    R.map(cr,u);

  },

  refresh() {
    this.clear();

    const v = get(this, 'formattedRules');

    if (!isEmpty(v)) {
      const v1 = v.firstObject

      $('#alerts_rules_type').val(v1.value).trigger('change');
    }

    this.setProperties({
      selectedNotifiers: [],
    });
  },

})
