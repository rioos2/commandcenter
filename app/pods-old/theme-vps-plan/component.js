/* global renderChartNumberOfCores, renderChartRam, renderChartLinearProgressSlider*/
import Ember from 'ember';

export default Ember.Component.extend({

  initializeChart: Ember.on('didInsertElement', function() {
    var self = this;
    // self.$(".step5").addClass("btn-success");
    self.$(".step4").addClass("btn-success");

    self.$(".arrow-left").click(function(e) {
      var active_img = self.$(".items img").index(self.$(".items .active"));
      if (active_img != 0) {
        self.$(".items .active").removeClass("active").prev().addClass("active");
      } else {
        self.$(".items .active").removeClass("active");
        self.$("#windows").addClass("active");
      }
    });

    self.$(".arrow-right").click(function(e) {
      var active_img = self.$(".items img").index(self.$(".items .active"));
      if (active_img != 4) {
        self.$(".items .active").removeClass("active").next().addClass("active");
      } else {
        self.$(".items .active").removeClass("active");
        self.$("#ubuntu").addClass("active");
      }
    });

    self.$(".btn-version").click(function(e) {
      self.$(".btn-version").removeClass("active");
      self.$(this).addClass("active");
    });


    this.loadDependencies();
  }),

  loadDependencies: function() {
    var self = this;
    // var store = this.get('store');
    // return Ember.RSVP.hash({
    // 	planfactory: store.findAll('planfactory', {
    // 		url: 'planfactory'
    // 	}),
    // }).then((results) => {
    // 	  alert(JSON.stringify(results));
    //
    // });
    //
    var a = {
      "kind": "PlanList",
      "api_version": "v1",
      "items": [{
          "id": "852501824303800320",
          "group_name": "1_virtualmachine_ubuntu",
          "description": "Ubuntu is a Debian-based Linux operating system",
          "tags": ["linux", "ubuntu", "xenial", "14.04"],
          "url": "/v3/plan/ubuntu",
          "origin": "rioos:2.0",
          "artifacts": [],
          "services": [{
            "name": "trusty",
            "description": "Ubuntu is a Debian-based Linux operating system. Trusty Tahr is the Ubuntu codename for version 14.04 LTS of the Ubuntu Linux-based operating system.",
            "href": "https://www.ubuntu.com",
            "characteristics": {
              "image": "ubuntu.png",
              "version": "14.04"
            }
          }, {
            "name": "Xenial",
            "description": "Ubuntu is a Debian-based Linux operating system. Trusty Tahr is the Ubuntu codename for version 16.04 LTS of the Ubuntu Linux-based operating system.",
            "href": "https://www.ubuntu.com",
            "characteristics": {
              "image": "ubuntu.png",
              "version": "16.04"
            }
          }],
          "created_at": "2017-11-17T04:18:45.257876+00:00"
        }, {
          "id": "852501824312197120",
          "group_name": "1_virtualmachine_ubuntu",
          "description": "centos operating system",
          "tags": ["centos"],
          "url": "/v3/plan/ubuntu",
          "origin": "rioos:2.0",
          "artifacts": [],
          "services": [{
            "name": "Centos",
            "description": "centos 7.4.",
            "href": "https://www.ubuntu.com",
            "characteristics": {
              "image": "ubuntu.png",
              "version": "16.4"
            }
          }],
          "created_at": "2017-11-17T04:18:45.257876+00:00"
        },
        {
          "id": "852501824312197120",
          "group_name": "1_virtualmachine_debian",
          "description": "centos operating system",
          "tags": ["centos"],
          "url": "/v3/plan/debian",
          "origin": "rioos:2.0",
          "artifacts": [],
          "services": [{
            "name": "Centos",
            "description": "debian 7.4.",
            "href": "https://www.ubuntu.com",
            "characteristics": {
              "image": "debian.png",
              "version": "7.4"
            }
          }],
          "created_at": "2017-11-17T04:18:45.257876+00:00"
        },
        {
          "id": "852501824312197120",
          "group_name": "1_virtualmachine_fedora",
          "description": "centos operating system",
          "tags": ["centos"],
          "url": "/v3/plan/fedora",
          "origin": "rioos:2.0",
          "artifacts": [],
          "services": [{
            "name": "fedora",
            "description": "fedora 7.4.",
            "href": "https://www.ubuntu.com",
            "characteristics": {
              "image": "fedora.png",
              "version": "7.4"
            }
          }],
          "created_at": "2017-11-17T04:18:45.257876+00:00"
        },
        {
          "id": "852501824312197120",
          "group_name": "1_virtualmachine_docker",
          "description": "centos operating system",
          "tags": ["centos"],
          "url": "/v3/plan/docker",
          "origin": "rioos:2.0",
          "artifacts": [],
          "services": [{
            "name": "Centos",
            "description": "docker 7.4.",
            "href": "https://www.ubuntu.com",
            "characteristics": {
              "image": "docker.png",
              "version": "7.4"
            }
          }],
          "created_at": "2017-11-17T04:18:45.257876+00:00"
        },
        {
          "id": "852501824312197120",
          "group_name": "1_virtualmachine_windows",
          "description": "centos operating system",
          "tags": ["windows"],
          "url": "/v3/plan/windows",
          "origin": "rioos:2.0",
          "artifacts": [],
          "services": [{
            "name": "windows",
            "description": "windows 7.4.",
            "href": "https://www.ubuntu.com",
            "characteristics": {
              "image": "windows.png",
              "version": "7.4"
            }
          }],
          "created_at": "2017-11-17T04:18:45.257876+00:00"
        },
        {
          "id": "852501824320593920",
          "group_name": "2_container_rioos",
          "description": "tutum/hello-world is testing simple light weight docker container",
          "tags": ["tutum", "hello-world"],
          "url": "/v3/plan/rioos",
          "origin": "rioos:2.0",
          "artifacts": [],
          "services": [{
            "name": "hello-world",
            "description": "tutum is a Debian-based simple container.",
            "href": "https://www.tutum.com",
            "characteristics": {
              "os": "centos",
              "port": "8080"
            }
          }],
          "created_at": "2017-11-17T04:18:45.257876+00:00"
        }, {
          "id": "852501824328990720",
          "group_name": "2_application_java",
          "description": "The Apache Tomcat® software is an open source implementation of the Java Servlet, JavaServer Pages, Java Expression Language and Java WebSocket technologies.",
          "tags": ["tomcat", "java", "jdk"],
          "url": "/v3/plan/java",
          "origin": "rioos:2.0",
          "artifacts": [],
          "services": [{
            "name": "tomcat",
            "description": "",
            "href": "http://tomcat.apache.org/",
            "characteristics": {
              "http.port": "3000",
              "image": "java.png",
              "os": "centos",
              "password": "team4megam",
              "username": "megam",
              "version": "4.2"
            }
          }],
          "created_at": "2017-11-17T04:18:45.257876+00:00"
        }, {
          "id": "852501824337387520",
          "group_name": "2_application_rails",
          "description": "Rails is a web application framework written in Ruby.",
          "tags": ["rails", "ruby", "ror"],
          "url": "/v3/plan/rails",
          "origin": "rioos:2.0",
          "artifacts": [],
          "services": [{
            "name": "rails",
            "description": "",
            "href": "http://rubyonrails.org/",
            "characteristics": {
              "http.port": "3000",
              "image": "rails.png",
              "os": "centos",
              "version": "4.2"
            }
          }],
          "created_at": "2017-11-17T04:18:45.257876+00:00"
        }
      ]
    };
    self.set("planfactory", a);
  },

  groupPlanFactory: function() {
    var planGroup = [];
    var uniqueVmGroup = [];
    var groupVms = [];
    var planfactory = this.get("planfactory.items");

    planfactory.forEach(function(plan) {
      if (plan.group_name.split("_")[1] == "virtualmachine") {
        planGroup.pushObject(plan.group_name.split("_")[2]);
      }
      uniqueVmGroup = planGroup.filter(function(elem, index, self) {
        return index == self.indexOf(elem);
      })
    });
    uniqueVmGroup.forEach(function(vm) {
      let createVmGroup = {
        "type": vm,
        "version": [],
        "item": []
      }
      planfactory.forEach(function(plan) {
        if (plan.group_name.split("_")[2] == vm) {
          createVmGroup.item.pushObject(plan);
          createVmGroup.version.pushObject({
            "version": plan.services[0].characteristics.version,
            "url": plan.url
          });
        }
      })
      groupVms.pushObject(createVmGroup);
      createVmGroup = {};
    })
    this.set("groupedVms", groupVms);
  }.observes('planfactory'),

  actions: {

    refreshAfterSelect(item) {
      this.set("selected", item);
    },

  }

});
