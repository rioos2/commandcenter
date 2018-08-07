export default Ember.Component.extend({

  editedText1: '',
  editedText2: '',
  actions:     {
    clickInputIcon() {
      this.set('showEditBox', false);
    },
    focusOut() {
      this.set('showEditBox', true);
    },

    setPopupData(editedText1, editedText2) {
      this.sendAction('targetActionName', editedText1, editedText2);
    },
  }



});
