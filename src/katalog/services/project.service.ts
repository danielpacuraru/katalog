import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Project, ProjectDocument } from '../schemas/project.schema';
import { CreateProjectDto } from '../dtos/create-project.dto';

@Injectable()
export class ProjectService {

  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>
  ) { }

  createProject(data: CreateProjectDto): Promise<Project> {
    const project = new this.projectModel(data);
    return project.save();
  }

}
