



import Ember from 'ember';
import PolledModel from 'nilavu/mixins/polled-model';
import DefaultHeaders from 'nilavu/mixins/default-headers';

export default Ember.Route.extend(PolledModel,DefaultHeaders,{
  activate: function() {
    this.send('unfixedTop');
    this.send('unfixedBottom');
  },
  deactivate: function() {
    this.send('unfixedTop');
    this.send('unfixedBottom');
  },

  beforeModel: function() {
    var previousRoutes = this.router.router.currentHandlerInfos;
    var previousRoute = previousRoutes && previousRoutes.pop();
    if (previousRoute) {
      localStorage["lastVisitedRoute"] = previousRoute.name;
    }
  },
  model: function() {
    //let type = this.get(`session.${C.SESSION.USER_TYPE}`);

    //let isAdmin = (type === C.USER.TYPE_ADMIN) || !this.get('access.enabled');

    //this.set('access.admin', isAdmin);
    const self = this;
    return this.get('store').findAll('assembly', this.opts('assemblys')).then((assemblys) => {
    // return this.get('store').findAll('reports', this.opts('mockapi')).then((reports) => {

      var a = {filter: [{
              id: "selectOs",
              name: "select os",
              data: ["ubuntu", "fedora", "windows 10"]
          },{
              id: "selectDb",
              name: "select db",
              data: ["db1", "db2", "db3"]
          },{
              id: "selectLocation",
              name: "location",
              data: ["ohio", "tokyo", "NYC", "Paris", "hong kong", "london", "Moscow"]
          },{
              id: "selectNetwork",
              name: "network",
              data: ["network 1", "network 2", "network 3"]
          },{
              id: "selectStatus",
              name: "status",
              data: ["status 1", "status 2", "status 3"]
          }
      ],
      gauge: [{
              id: "gauge4",
              name: "gauge1",
              counter: 45,// 10, 22, 92, 8, 14]
          },{
              id: "gauge5",
              name: "gauge2",
              counter: 100,// 27, 60, 91, 1, 5]
          },{
              id: "gauge6",
              name: "gauge3",
              counter: 25//, 90, 100, 65, 0, 76, 32]
          },{
              id: "gauge7",
              name: "gauge4",
              counter: 20//, 90, 100, 65, 0, 76, 32]
          },{
              id: "gauge8",
              name: "gauge5",
              counter: 64,// 27, 60, 91, 1, 5]
          },{
              id: "gauge9",
              name: "gauge6",
              counter: 40//, 90, 100, 65, 0, 76, 32]
          },{
              id: "gauge10",
              name: "gauge7",
              counter: 30//, 90, 100, 65, 0, 76, 32]
          }
      ]
    }
     var ab = $.extend(assemblys, a);
      return  ab;
    }).catch(function() {
      self.set('loading', false);
    });
  },

});
