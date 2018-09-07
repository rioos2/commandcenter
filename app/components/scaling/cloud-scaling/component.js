import Component from '@ember/component';
export default Component.extend({

  modelSpinner: false,

  enableHorizontal: function(){
    return this.get('model.hscaling.horizontal_scaling_rule_apply');
  }.property('model.hscaling.horizontal_scaling_rule_apply'),

  enableVertical: function(){
    return this.get('model.vscaling.vertical_scaling_rule_apply');
  }.property('model.vscaling.vertical_scaling_rule_apply'),

  actions: {
    sendHorizontal() {
      this.toggleProperty('model.hscaling.horizontal_scaling_rule_apply');
      if(this.get('model.vscaling.vertical_scaling_rule_apply')){
        this.toggleProperty('model.vscaling.vertical_scaling_rule_apply');
      }
    },
    sendVertical() {
      this.toggleProperty('model.vscaling.vertical_scaling_rule_apply');
      if(this.get('model.hscaling.horizontal_scaling_rule_apply')){
        this.toggleProperty('model.hscaling.horizontal_scaling_rule_apply');
      }
    },
  }

});
