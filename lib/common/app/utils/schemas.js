import Ember from 'ember';

let schemas = Ember.Object.create({
  reports: '/api/v1/healthz/overall'
});


export function fetchSchema(type) {
  let states = [schemas];
  return states.mapBy(type);
}
