/* eslint-disable */

import Component from '@ember/component';
import EmberObject from '@ember/object';
import { get, computed } from '@ember/object';
import { filter } from '@ember/object/computed';
import C from 'nilavu/utils/constants';
import { inject as service } from '@ember/service';

export default Component.extend({
  intl:         service(),
  state:        "inactive",  
  isActive:     false,
  showSpinner:             false,
  showalertRuleDescriptionEditBox: true,

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
    return rule.rules[0].description;
  }.property('selectedType'),

  buildTypeText: function() {
    let rule = this.get('model.alertRules').findBy("id", this.get('selectedType'));
    return this.getFromBetween.get(rule.rules[0].description,"{{","}}");
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

  getFromBetween: {
    results:[],
    string:"",
    getFromBetween:function (sub1,sub2) {
        if(this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
        var SP = this.string.indexOf(sub1)+sub1.length;
        var string1 = this.string.substr(0,SP);
        var string2 = this.string.substr(SP);
        var TP = string1.length + string2.indexOf(sub2);
        return this.string.substring(SP,TP);
    },
    removeFromBetween:function (sub1,sub2) {
        if(this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
        var removal = sub1+this.getFromBetween(sub1,sub2)+sub2;
        this.string = this.string.replace(removal,"");
    },
    getAllResults:function (sub1,sub2) {
        // first check to see if we do have both substrings
        if(this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return;

        // find one result
        var result = this.getFromBetween(sub1,sub2);
        // push it to the results array
        this.results.push(result);
        // remove the most recently found one from the string
        this.removeFromBetween(sub1,sub2);

        // if there's more substrings
        if(this.string.indexOf(sub1) > -1 && this.string.indexOf(sub2) > -1) {
            this.getAllResults(sub1,sub2);
        }
        else return;
    },
    get:function (string,sub1,sub2) {
        this.results = [];
        this.string = string;
        this.getAllResults(sub1,sub2);
        return this.results;
    }
  },
  

  actions: {
    selectStorage(type) {
      this.set('selectedType', type);
    },

    setNewDomain(value) {
      set(this, 'showalertRuleDescriptionEditBox', true);
      console.log(value);
      /*if (isEmpty(newDomainName.trim())) {
        get(this, 'notifications').warning(get(this, 'intl').t('validation.domain.required'), {
          autoClear:     true,
          clearDuration: 4200,
          cssClasses:    'notification-warning'
        });
      } else {
        set(this, 'stacksfactoryObjectMeta.name', this.nameSpliter(newDomainName));
      }*/
    },

  }

});
