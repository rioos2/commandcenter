import Ember from 'ember';
import {
  alternateLabel
} from 'nilavu/utils/platform';
import Terminal from 'npm:xterm';
import DefaultHeaders from 'nilavu/mixins/default-headers';

export default Ember.Component.extend(DefaultHeaders, {
  userStore: Ember.inject.service('user-store'),
  instance: null,
  command: null,
  cols: 80,
  rows: 24,
  alternateLabel: alternateLabel,
  showProtip: true,

  status: 'connecting',
  error: null,
  socket: null,
  term: null,
  socketError: true,

  didInsertElement: function() {
    this._super();
    Ember.run.next(this, 'exec');
  },

  exec: function() {
    var instance = this.get('instance');
    var opt = {
      id: instance.id,
      host: instance.host,
      accountid: instance.accid
    };
    this.getUrl(opt);
  },

  getUrl: function(option) {
    return this.get('userStore').rawRequest(this.rawRequestOpts({
      url: "/api/v1/accounts/"+option.accountid+"/assemblys/" + option.id+"/exec",
      method: 'GET',
    })).then((xhr) => {
      console.log('Socket Url => ',xhr.body.url);
      this.connect(xhr.body.url, xhr.body.target);
    }).catch((res) => {
      console.log('Socket getUrl error => ',res);
      this.set('status', 'somethingWrong');
      this.set('socketError', true);
    });
  },

  connect: function(url, target) {
    var socket = new WebSocket("wss://" + window.location.host + url + "?target="+target, 'base64.channel.k8s.io');
    this.set('socket', socket);

     socket.onopen = () => {
       this.set('status', 'initializing');

       var term = new Terminal({
         cols: this.get('cols'),
         rows: this.get('rows'),
         useStyle: true,
         screenKeys: true,
         cursorBlink: true
       });
       this.set('term', term);

       term.cursorHidden = true;
       term.refresh(term.x, term.y);

       term.resize(this.get('cols'), this.get('rows'));
       socket.send("4" + btoa(unescape(encodeURIComponent('{"Width":' + this.get('cols') + ',"Height":' + this.get('rows') + '}'))));

       term.on('data', function(data) {
         // console.log('To Server:',data);
         socket.send("0" + btoa(unescape(encodeURIComponent(data)))); // jshint ignore:line
       });

       term.open(this.$('.shell-body')[0]);
     };

     socket.onmessage = (ev) => {
       // console.log('From Server:',ev);

       this.set('status', 'connected');
       var term = this.get('term');
       this.sendAction('connected');

       var data = ev.data.slice(1);
       this.set('socketError',false);
       switch (ev.data[0]) {
         case '1':
         case '2':
         case '3':
           term.write(decodeURIComponent(escape(atob(data))));
           break;
       }
     };

     socket.onclose = () => {
       try {
         this.set('status', 'closed');
         term.destroy();
         if (!this.get('userClosed')) {
           this.sendAction('dismiss');
         }
       } catch (e) {}
     };
   },

   disconnect: function() {
     this.set('status', 'closed');
     this.set('userClosed', true);

     var term = this.get('term');
     if (term) {
       term.destroy();
       this.set('term', null);
     }

     var socket = this.get('socket');
     if (socket) {
       socket.close();
       this.set('socket', null);
     }

     this.sendAction('disconnected');
   },

   willDestroyElement: function() {
     this.disconnect();
     this._super();
   },

   actions: {
     close() {
       window.close();
     },
   }

});
