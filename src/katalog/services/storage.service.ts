import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3, HeadObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from "@aws-sdk/lib-storage";
import * as archiver from 'archiver';
import { PassThrough } from 'stream';
import { join, basename } from 'path';
import { createReadStream } from 'fs';

import { Project } from '../schemas/project.schema';
import { File } from '../entities/file.interface';

@Injectable()
export class StorageService {

  private s3;
  private projectsPath: string;

  constructor(
    private config: ConfigService
  ) {
    this.s3 = new S3({
      endpoint: 'https://ams3.digitaloceanspaces.com',
      region: 'eu-west-1',
      credentials: {
        accessKeyId: config.get('SPACES_KEY'),
        secretAccessKey: config.get('SPACES_SECRET')
      }
    });
    this.projectsPath = config.get('PATH_PROJECTS');
  }

  async getCatalogInfo(projectId: string) {
    const params = {
      Bucket: 'katalog',
      Key: `projects/${projectId}.zip`
    }

    try {
      const catalog = await this.s3.send(new HeadObjectCommand(params));
      return catalog;
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

  async uploadThumbnail(path: string): Promise<void> {
    const upload = new Upload({
      client: this.s3,
      params: {
        Bucket: 'katalog',
        Key: join('thumbnails', basename(path)),
        Body: createReadStream(path),
        ACL: 'public-read'
      }
    });

    await upload.done();
  }

  async uploadCatalog(project: Project): Promise<File> {
    const projectId: string = project._id.toString();
    const src: string = join(this.projectsPath, projectId);
    const dest: string = join('projects', `${projectId}.zip`);
    const name: string = project.name;
    let size:  number = 0;

    const zip = archiver('zip', { zlib: { level: 9 } });
    const pass = new PassThrough();

    zip.pipe(pass);
    zip.directory(src, name);
    zip.finalize();

    pass.on('data', chunk => size += chunk.length);

    const upload = new Upload({
      client: this.s3,
      params: {
        Bucket: 'katalog',
        Key: dest,
        Body: pass,
        ACL: 'public-read'
      }
    });

    const meta = await upload.done();

    return {
      name: name,
      url: meta['Location'],
      size: size
    }
  }

}
