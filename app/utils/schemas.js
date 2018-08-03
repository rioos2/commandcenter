import EmberObject from '@ember/object';

let schemas = EmberObject.create({ reports: '/api/v1/healthz/overall' });


export function fetchSchema(type) {
  let states = [schemas];

  return states.mapBy(type);
}
