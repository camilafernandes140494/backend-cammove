// src/firebase/firebase.config.ts
import * as admin from 'firebase-admin';
import * as path from 'path';

const serviceAccount = require(
  path.resolve(__dirname, '../../config/serviceAccountKey.json'),
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
export default admin;
