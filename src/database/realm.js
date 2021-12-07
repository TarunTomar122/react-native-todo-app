import Realm from 'realm';

import {Todo} from './models';

export default new Realm({
  schema: [Todo],
  schemaVersion: 2, //add a version number
  migration: (oldRealm, newRealm) => {},
});
