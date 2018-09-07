import BrowserStore from 'nilavu/utils/browser-storage';
import C from 'nilavu/utils/constants';
import Service from '@ember/service';


export default Service.extend(BrowserStore, {
  backing: window.localStorage,

  // Multiple browser windows to the same URL will send 'storage' events
  // between each other when a setting changes.
  init() {
    this._super();
    $(window).on('storage', (event) => {
      var key = event.originalEvent.key;
      var old = event.originalEvent.oldValue;
      var neu = event.originalEvent.newValue;

      if (old !== neu) {
        this.notifyPropertyChange(key);

        if (key === C.SESSION.ACCOUNT_ID && old && neu && old !== neu) {
          // If the active user changes, flee
          try {
            window.lc('application').send('logout');
          } catch (e) {}
        }
      }
    });
  },
});
