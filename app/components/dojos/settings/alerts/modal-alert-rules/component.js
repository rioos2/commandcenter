/* eslint-disable */

import Component from '@ember/component';
import EmberObject from '@ember/object';
import { set, get, computed } from '@ember/object';
import { filter } from '@ember/object/computed';
import C from 'nilavu/utils/constants';
import { inject as service } from '@ember/service';
import { substrings } from 'nilavu/helpers/substrings';
import { isEmpty } from '@ember/utils';

export default Component.extend({
  intl:          service(),
  notifications: service('notification-messages'),
  state:         "inactive",  
  isActive:      false,
  showSpinner:   false,

  descriptionPlaceHolder: computed('descriptionPlaceHolder', function() {
    return get(this, 'intl').t('dojos.settings.alerts.rules.placeholder');
  }),

  showDropDown: function() {
    return this.get('isActive') ? 'active' : '';
  }.property('isActive'),

  selectedType: function() {
    return this.get('model.alertRules')[0].id;
  }.property('model'),

  selectType: function() {
    let rule = this.get('model.alertRules').findBy("id", this.get('selectedType'));
    return rule.rules[0].reason;
  }.property('selectedType'),  

  inActiveRules: computed('model.alertRules', function() {    
    return this.get('model.alertRules').filter((rule) => {     
      return rule.state == this.get('state');
    });
  }),    

  inActiveRuleTypes: function() {
    return this.get('inActiveRules').map((rule) => {
      return {
        'value': rule.id,
        'text':  rule.rules[0].rule_type,
      }
    });
  }.property('model'),  

  selectedRuleTypes: function() {
    let rule = this.get('model.alertRules').findBy("id", this.get('selectedType'));
    let findedSubStrings = substrings().get(rule.rules[0].description,"{{","}}");
    this.set('splitedRules', findedSubStrings.map((val) => {
      set(this, `showEditBox-${val}`, true);
      return {
        'id': val,
        'label': rule.rules[0].labels[val],
      }
    }));
    this.buildRuleExprJSON(findedSubStrings);
    return this.get('splitedRules');
  }.property('selectedType'),

  buildRuleExprJSON(rules) {
    var jsonObj = {};
    for (var i = 0 ; i < rules.length; i++) {
      jsonObj[rules[i]] = "";
    }
    this.set('rulesExprJSON', jsonObj);
  }, 

  actions: {
    selectStorage(type) {
      this.set('selectedType', type);
    },

    setRuleExpr(value, targetRef) {
      set(this, `showEditBox-${targetRef}`, true);
      if (isEmpty(value.trim())) {
        this.get('notifications').warning(get(this, 'intl').t('dojos.settings.alerts.rules.required'), {
          autoClear:     true,
          clearDuration: 4200,
          cssClasses:    'notification-warning'
        });
      } else {        
        set(this, `rulesExprJSON-${targetRef}`, value);
        document.getElementById(`rulesExprValue-${targetRef}`).innerHTML = value;
      }
    },

    apply() {
      let exprs = this.get('splitedRules');
      let rule = this.get('model.alertRules').findBy("id", this.get('selectedType'));
      let expr = rule.rules[0].expression;
      let flag = true;
      for (var i = 0 ; i < exprs.length; i++) {
        if (isEmpty(this.get(`rulesExprJSON-${exprs[i].id}`))) {
          flag = false;
        } else {
          expr = substrings().replace(expr, `{{${exprs[i].id}}}`, this.get(`rulesExprJSON-${exprs[i].id}`))
        }        
      }
      if (!flag) {
        this.get('notifications').warning(get(this, 'intl').t('dojos.settings.alerts.rules.required'), {
          autoClear:     true,
          clearDuration: 4200,
          cssClasses:    'notification-warning'
        });
        return;
      }

      //update value filled expression into rule object and update it
      rule.rules[0].expression = expr;

      this.set('showSpinner', true);
      if (!error) {
        this.get('store').request(this.rawRequestOpts({
          url:    '/api/v1/alertrules/'+rule.rules[0].id,
          method: 'PUT',
          data:   rule,
        })).then(() => {
          $('#alert_rule_modal').modal('hide');
          this.set('modelSpinner', false);
          this.set('showSpinner', false);
          this.refresh();
        }).catch(() => {
          this.get('notifications').warning(get(this, 'intl').t('dojos.settings.alerts.rules.somethingWrong'), {
            autoClear:     true,
            clearDuration: 4200,
            cssClasses:    'notification-warning'
          });
          this.set('showSpinner', false);
          this.set('modelSpinner', false);
        });
      } else {
        this.set('showSpinner', false);
        this.get('notifications').warning(htmlSafe(this.get('validationWarning')), {
          autoClear:     true,
          clearDuration: 4200,
          cssClasses:    'notification-warning'
        });
      }
    }

  }

});
