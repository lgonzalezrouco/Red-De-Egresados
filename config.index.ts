import {writeFile} from 'fs';
import { env } from 'process';

import {name, version} from './package.json';

const targetPath = './src/environments/environment.prod.ts';

const envConfigFile = `export const environment = {
   production: true,
   firebaseConfig: {
        apiKey: '${process.env.APIKEY}',
        authDomanin: '${process.env.AUTHDOMAIN}',
        databaseURL: '${process.env.DATABASEURL}',
        projectId: '${process.env.PROJECTID}',
        storageBucket: '${process.env.STORAGEBUCKET}',
        messagingSenderId: '${process.env.MESSAGINGSENDERID}',
        appId: '${process.env.APPID}',
        measurementId: '${process.env.MEASUREMENTID}'
    },
    name: '${name}',
    version: '${version}'
};
`;

writeFile(targetPath, envConfigFile, 'utf8', (err) => {
  if (err) {
    return console.log(err);
  }
  console.log(envConfigFile);
});