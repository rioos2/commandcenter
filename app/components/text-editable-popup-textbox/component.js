import Component from '@ember/component';
export default Component.extend({

  editedText: '',
  actions:    {
    clickInputIcon() {
      this.set('showEditBox', false);
    },
    focusOut() {
      this.set('showEditBox', true);
    },

    setPopupData(editedText, targetRef) {
      this.set('showEditBox', true);
      this.sendAction('targetActionName', editedText, targetRef);
    },
  }



});
