import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { get } from '@ember/object';
import { alias } from '@ember/object/computed';
import { isEmpty, isEqual } from '@ember/utils';
import C from 'nilavu/utils/constants';
import VisualStatus from 'nilavu/utils/visual_status';

export default Component.extend({
  store:            service(),
  classNames:       ['container-list'],

  spec:             alias('model.spec'),
  metaData:         alias('model.metadata'),
  objectMeta:       alias('model.object_meta'),
  status:           alias('model.status'),

  // The parent
  assemblyFactory:           alias('spec.assembly_factory'),
  assemblyFactoryObjectMeta: alias('assemblyFactory.object_meta'),

  // Telemtry of a single stack box
  // CPU consumed
  consumption: alias('spec.metrics'),

  // The Basic plan
  //
  blueprint:  alias('assemblyFactory.spec.plan'),

  // The endpoints contains, ip address
  endpoints: alias('spec.endpoints'),

  // Basics
  // 1. Id
  // 2. Name
  // 3. Location
  id: alias('model.id'),

  location: alias('assemblyFactoryObjectMeta.cluster_name'),

  name: computed('objectMeta.name', function() {
    const ns = this.get('objectMeta.name').split('.');
    const n  = ns.get('firstObject');

    if (!isEmpty(n)) {
      return n;
    }

    return C.UNKNOWN;
  }),

  /* The section is about status */
  statusPhase: computed('status', function() {
    return get(this, 'status.phase')
  }), //eslint-disable-line

  // The last status message reasoned updated
  statusReason: computed('status.reason', function() {
    return (!isEmpty(this.get('status.reason'))) ? this.get('status.reason') : '';
  }),

  // History of what happened. This is essentially all conditions.
  statusHistory: computed('status.conditions', function() {
    const c =  get(this, 'status.conditions').map((c) => {
      const cs = c.status.trim().toLowerCase();

      const csm = cs.match(/true/i);

      const csi = csm  ? '"icon check"' : '"icon times"';

      const csr = csm ? ' ' : c.reason; // eslint-disable-line

      return  `<fa icon=${ csi }>${ c.condition_type }${ csr }</fa> <br></br>`;
    });

    return c.join('').htmlSafe();

  }),

  // The style attr of the status
  statusAttr: computed('statusPhase', function() {
    const health = get(this, 'status.phase');

    return  VisualStatus.create({ health }).attr();
  }),

  // An enhanced tooltip
  statusToolTip: computed('statusPhase', function() {
    const health = get(this, 'status.phase');

    return  VisualStatus.create({ health }).tooltip();
  }),

  /* The section about blueprints */
  blueprintVersion: alias('blueprint.version'), //eslint-disable-line

  blueprintParentIcon: alias('blueprint.icon'), //eslint-disable-line

  // From a list of plans grab the icon of the plan applied.
  blueprintName: function() {
    const self = this;

    if (!isEmpty(this.get('blueprint'))) {
      const p =   get(this, 'blueprint.plans').filter((plan) => {
        return   isEqual(plan.object_meta.name, self.get('assemblyFactory.metadata.rioos_sh_blueprint_applied'));
      });

      const pf = p.get('firstObject');

      // strip the file extenstion (example: .png, .jpg)
      if (!isEmpty(pf)) {
        return  pf.icon.replace(/\.[0-9a-z]+$/i, '').capitalize();
      }

    }

    return `${ C.UNKNOWN  }`

  }.property('assemblyFactory'),

  /* The section about endpoints */
  hasIPs: function() {
    return get(this, 'endpoints.subsets.addresses').length;
  }.property('endpoints.subsets.addresses'),

  // This has both ip and its protocol tied up and formatted as a html
  // Think the function must me named renderIPAndProtocols ?
  ips: function() {
    const e = get(this, 'endpoints.subsets.addresses');
    let all = '';

    return (e.map((xe) => {
      const ip = xe.ip;
      const protocol_version = xe.protocol_version.toLowerCase();

      return  all.concat(`<p class=text1>${ protocol_version }</p>`, `<p class=text2>${ ip }</p>`);
    })).join('').htmlSafe();

  }.property('endpoints.subsets.addresses'),

  // At the moment the dial show the cpu usage consumed
  cpuPercentage: function() {
    const a = get(this, 'consumption');

    let cpu = {

      name:  get(this, 'id'),

      counter: 0
    };

    if (!isEmpty(a) && !isEmpty(a.id)) {
      cpu.counter = parseInt(get(this, `consumption.${ a.id }`));
    }

    return cpu;

  }.property('cpuConsumed.@each'),



});
