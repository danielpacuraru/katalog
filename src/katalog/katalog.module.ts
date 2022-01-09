import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Project, ProjectSchema } from './schemas/project.schema';
import { ProjectService } from './services/project.service';
import { ProjectsController } from './controllers/projects.controller';
import { StatsController } from './controllers/stats.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema }
    ])
  ],
  providers: [
    ProjectService
  ],
  controllers: [
    ProjectsController,
    StatsController
  ]
})
export class KatalogModule { }
