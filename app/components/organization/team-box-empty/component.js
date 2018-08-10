import Component from '@ember/component';

export default Component.extend({

  actions: {
    doAction() {
      this.sendAction('btnAction');
    }
  }
});
