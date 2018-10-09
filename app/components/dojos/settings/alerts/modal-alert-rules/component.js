/* eslint-disable */

import Component from '@ember/component';
import EmberObject from '@ember/object';
import { set, get, computed } from '@ember/object';
import { filter } from '@ember/object/computed';
import C from 'nilavu/utils/constants';
import { inject as service } from '@ember/service';
import { substrings } from 'nilavu/helpers/substrings';
import { isEmpty } from '@ember/utils';
import DefaultHeaders from 'nilavu/mixins/default-headers';

const {  A } = Ember;

export default Component.extend(DefaultHeaders, {
  intl:          service(),
  notifications: service('notification-messages'),
  isActive:      false,
  showSpinner:   false,
  multipleValue: new A([]),
  options: new A(C.SETTING.NOTIFIERS),

  descriptionPlaceHolder: computed('descriptionPlaceHolder', function() {
    return get(this, 'intl').t('dojos.settings.alerts.rules.placeholder');
  }),

  alertActions: function() {
    return [C.SETTINGS.EMAIL, C.SETTINGS.SLACK];
  },

  builtinRules: computed('model.alertBuiltinRules', function() {
    return this.get('model.alertBuiltinRules.content');
  }),

  showDropDown: function() {
    return this.get('isActive') ? 'active' : '';
  }.property('isActive'),

  selectedType: function() {
    return this.get('builtinRules')[0].id;
  }.property('model'),

  selectType: function() {
    let rule = this.get('builtinRules').findBy("id", this.get('selectedType'));
    return rule.rules[0].reason;
  }.property('selectedType'),  

  rulesForSelectBox: function() {
    return this.get('builtinRules').map((rule) => {
      return {
        'value': rule.id,
        'text':  rule.rules[0].rule_type,
      }
    });
  }.property('model'),  

  selectedRuleTypes: function() {
    let rule = this.get('builtinRules').findBy("id", this.get('selectedType'));
    let findedSubStrings = substrings().get(rule.rules[0].expression,"{{","}}");
    set(this, 'splitedRules', findedSubStrings.map((val) => {
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
    set(this, 'rulesExprJSON', jsonObj);
  }, 

  actions: {
    selectStorage(type) {
      set(this, 'selectedType', type);
    },

    handleMultiSelect(options) {
      set(this, 'alertActions', options);
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
      if (!this.validate()) {
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
            data:   this.buildAlertRules(),
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

  validate() {
    let exprs = this.get('splitedRules');     
    let flag = true;
    for (var i = 0 ; i < exprs.length; i++) {
      if (isEmpty(this.get(`rulesExprJSON-${exprs[i].id}`))) {
        flag = false;
      } 
    }      
    return flag;
  },

  buildAlertActions() {
    return get(this, 'alertActions').map((val) => {
      return val.name
    });
  },

  buildAlertRules() {
    let exprs = this.get('splitedRules');
    let rule = this.get('builtinRules').findBy("id", this.get('selectedType'));
    let expr = rule.rules[0].expression;
    let labels = rule.rules[0].labels;
    let flag = true;
    for (var i = 0 ; i < exprs.length; i++) {        
      //insert expression values into labels
      labels[`${exprs[i].id}_value`] = this.get(`rulesExprJSON-${exprs[i].id}`);

      //build expression data
      expr = substrings().replace(expr, `{{${exprs[i].id}}}`, this.get(`rulesExprJSON-${exprs[i].id}`))
    }      

    //update value filled expression into rule object and update it
    rule.rules[0].expression = expr;

    rule.rules[0].labels = labels;   

    let alertrule = {
      "object_meta": rule.object_meta,
      "state":    C.SETTING.ACTIVE,
      "rules":    rule.rules,
      "metadata": {"alertbuiltinrule": rule.id},
      "notifiers": buildAlertActions(),
    };

    return alertrule;
  },

  clearExprs() {
    let exprs = this.get('splitedRules');     
    for (var i = 0 ; i < exprs.length; i++) {
      set(this, `rulesExprJSON-${exprs[i].id}`, '');
      set(this, `rulesExprValue-${exprs[i].id}`, '');
    }      
  },

  refresh() {
    this.clearExprs();
    $('#alerts_rules_type').val(this.get('rulesForSelectBox')[0].value).trigger('change');
    this.setProperties({
      alertActions: [],
      multipleValue: new A([])
    });
  },

})