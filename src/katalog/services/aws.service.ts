import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { createReadStream } from 'fs';
import { PassThrough } from 'stream';
import fetch from 'node-fetch';

const AWS_S3_BUCKET_NAME = 'katalog-fdv';
const s3 = new AWS.S3({
  accessKeyId: 'AKIAZU3CXPIFO3ON4M4Z',
  secretAccessKey: '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'
});

@Injectable()
export class AwsService {

  constructor() { }

  public async upload(path: string, name: string): Promise<string> {
    const url = 'documents/${name}.pdf';
    const params = {
      Body: createReadStream(path),
      Bucket: AWS_S3_BUCKET_NAME,
      Key: url
    }

    const data = await s3.putObject(params).promise().then(data => { console.log(data); return url; }, err => { console.log(err); return err; });

    return data;
  }

  public async downUp(docId: string) {
    const downloadUrl = `https://efobasen.efo.no/API/Produktfiler/LastNed?id=${docId}`;
    const bucketUrl = `documents/${docId}.pdf`;
    const pass = new PassThrough();

    const response = await fetch(downloadUrl);

    response.body.pipe(pass);

    const data = await s3.upload(
        {
            Bucket: AWS_S3_BUCKET_NAME,
            Key: bucketUrl,
            Body: pass,
        },
        {
            queueSize: 4, // default concurrency
        },
    ).promise()
        .then((data) => console.log(data))
        .catch((error) => console.error(error));

    /*await new Promise((resolve, reject) => {
      response.body.pipe(fileStream);
      response.body.on('error', reject);
      fileStream.on('finish', resolve);
    });*/

    return data;
  }

  /*function xupload(s3, inputStream) {
    const pass = new PassThrough();

    inputStream.pipe(pass);

    return s3.upload(
        {
            Bucket: 'bucket name',
            Key: 'unique file name',
            Body: pass,
        },
        {
            queueSize: 4, // default concurrency
        },
    ).promise()
        .then((data) => console.log(data))
        .catch((error) => console.error(error));
}*/

}
