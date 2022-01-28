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

  async create(createProjectDto: CreateProjectDto, userId: string): Promise<Project> {
    const project = new Project();

    project.name = createProjectDto.name;
    project.title = '';
    project.description = '';
    project.userId = userId;

    const newProject = new this.projectModel(project);
    const x =  await newProject.save();
    const y = x.toJSON();
    y.id = y._id;

    delete y._id;
    delete y.userId;

    console.log(y);
    return y;
  }

}
