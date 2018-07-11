export default Ember.Component.extend({

  editedText: "",
  actions: {
    clickInputIcon() {
      this.set('showIcon', false);
    },
    focusOut() {
      this.set('showIcon', true);
    },

  setPopupData(editedText) {
    this.sendAction('targetActionName',editedText);
  },
}



});
