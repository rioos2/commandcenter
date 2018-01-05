import Ember from 'ember';
import DefaultHeaders from 'nilavu/mixins/default-headers';

export default Ember.Route.extend(DefaultHeaders, {
  session: Ember.inject.service(),

  activate: function() {
    this.send('unfixedTop');
    this.send('unfixedBottom');
  },
  deactivate: function() {
    this.send('unfixedTop');
    this.send('unfixedBottom');
  },

  logData: function(){
    return {
            certisficated_date: 'Oct 12, 2017',
            state: 'platinum',
            image: '../images/user/paul.png',
            alert: {
                type: 'warning',
                message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
            },
            data: [
                {info: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis', ipaddress: '10.192.168.0.105', date:'10 Oct, 2017 10:31:06', alert:true},
                {info: 'Changing of email', ipaddress: '10.192.168.0.105', date:'10 Oct, 2017 10:31:06', alert:true},
                {info: 'Login from Windows 10 in Chrome 61.0.3.3163', ipaddress: '10.192.168.0.105', date:'10 Oct, 2017 10:31:06', alert:true},
                {info: 'Changing of email', ipaddress: '10.192.168.0.105', date:'10 Oct, 2017 10:31:06', alert:true},
                {info: 'Login from Windows 10 in Chrome 61.0.3.3163', ipaddress: '10.192.168.0.105', date:'10 Oct, 2017 10:31:06', alert:true},
              ]
        }
  },

  model: function() {
    const self = this;
    const store = this.get('store');
    return store.find('account', null,this.opts('accounts/' + self.get('session').get("id"))).then((account) => {
      return $.extend(account, self.logData());
    }).catch(function() {
      self.set('loading', false);
    });
  },

});
