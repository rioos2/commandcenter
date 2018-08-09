import BrowserStore from 'nilavu/utils/browser-storage';
import Service from '@ember/service';
// When we open multiple tab window the tab session used as bowser store.
export default Service.extend(BrowserStore, { backing: window.sessionStorage, });
