import C from 'nilavu/utils/constants';
import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin'

export default Mixin.create({
  organization:  service(),
  session:       service(),
  'tab-session': service('tab-session'),

  opts(url = '', forceReload = false) {
    let rioos_headers = {
      headers:           {
        'X-AUTH-RIOOS-EMAIL': this.get('session').get('email'),
        'Authorization':      `Bearer ${  this.encodedHeaderFromTabSession() }`,
      },
      url,
      forceReload,
      filter:            false,
      removeAfterDelete: true,
      isForAll:          false,
    };

    return rioos_headers;
  },

  rawRequestOpts(frame) {
    var session = this.get('session');
    let rioos_headers = {
      headers: {
        'X-AUTH-RIOOS-EMAIL': session.get('email'),
        'Authorization':      `Bearer ${  this.encodedHeaderFromTabSession() }`,
      },
      url:    frame.url,
      data:   frame.data,
      method: frame.method
    };

    return rioos_headers;
  },

  rawRequestOptsUsingService(frame) {
    var session = this.get('session');
    let rioos_headers = {
      headers: {
        'X-AUTH-RIOOS-EMAIL': session.get('email'),
        'Authorization':      `Bearer ${  this.encodedHeaderFromService() }`,
      },
      url:    frame.url,
      data:   frame.data,
      method: frame.method
    };

    return rioos_headers;
  },

  encodedHeaderFromTabSession(){
    var session = this.get('session');
    var tabSession = this.get('tab-session');
    var subHeader = {
      'account_id':         session.get(C.SESSION.ACCOUNT_ID) || '',
      'organization':       tabSession.get(C.TABSESSION.ORGANIZATION) || '',
      'team':               tabSession.get(C.TABSESSION.TEAM) || '',
      'token':              session.get('token')
    }

    return btoa(JSON.stringify(subHeader));
  },

  encodedHeaderFromService(){
    var session = this.get('session');
    var subHeader = {
      'account_id':         session.get(C.SESSION.ACCOUNT_ID) || '',
      'organization':       this.get('organization').get('currentOrganization') || '',
      'team':               this.get('organization').get('currentTeam') || '',
      'token':              session.get('token')
    }

    return btoa(JSON.stringify(subHeader));
  }

});
