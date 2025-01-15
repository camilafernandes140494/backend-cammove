// src/firebase/firebase.config.ts
import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';

const serviceAccount: ServiceAccount = {
  projectId: process.env.PROJECT_ID!,
  clientEmail: process.env.CLIENT_EMAIL!,
  privateKey: process.env.PRIVATE_KEY!.replace(/\\n/g, '\n'),
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
export default admin;
