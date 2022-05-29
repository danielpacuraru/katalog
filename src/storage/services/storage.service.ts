import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, HeadObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from "@aws-sdk/lib-storage";
import * as archiver from 'archiver';
import { PassThrough } from 'stream';
import { join } from 'path';

@Injectable()
export class StorageService {

  private s3;

  constructor(
    private config: ConfigService
  ) {
    this.s3 = new S3Client({
      endpoint: 'https://ams3.digitaloceanspaces.com',
      region: 'eu-west-1',
      credentials: {
        accessKeyId: config.get('SPACES_KEY'),
        secretAccessKey: config.get('SPACES_SECRET')
      }
    });
  }

  async getCatalogInfo(projectId: string) {
    const params = {
      Bucket: 'katalog',
      Key: `projects/${projectId}.zip`
    }

    try {
      const catalog = await this.s3.send(new HeadObjectCommand(params));
      return {
        url: `https://katalog.ams3.digitaloceanspaces.com/projects/${projectId}.zip`,
        size: catalog.ContentLength
      }
    }
    catch(e) {
      return null;
    }
  }

  async uploadProjectZip(path: string, url: string, name: string): Promise<void> {
    const zip = archiver('zip', { zlib: { level: 9 } });
    const pass = new PassThrough();

    zip.pipe(pass);
    zip.directory(path, name);
    zip.finalize();

    const upload = new Upload({
      client: this.s3,
      params: {
        Bucket: 'katalog',
        Key: url,
        Body: pass,
        ACL: 'public-read'
      }
    });

    await upload.done();
  }

}
