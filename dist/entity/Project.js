"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var Project_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const typeorm_1 = require("typeorm");
const ProjectUser_1 = require("./ProjectUser");
const Task_1 = require("./Task");
const User_1 = require("./User");
const uuid_1 = require("uuid");
const UserProjectRole_1 = require("../constants/UserProjectRole");
let Project = Project_1 = class Project {
    constructor(id, name, description, taskPrefix, createdAt, archived, createdBy) {
        this.Id = id;
        this.Name = name;
        this.Description = description;
        this.TaskPrefix = taskPrefix;
        this.CreatedAt = createdAt;
        this.Archived = archived;
        this.CreatedBy = createdBy;
        this.NextTask = 1;
    }
    EditValues(name, description) {
        this.Name = name;
        this.Description = description;
    }
    EditNextTask(nextTask) {
        if (nextTask <= this.NextTask)
            return;
        this.NextTask = nextTask;
    }
    static async EditProject(projectId, name, description, currentUser) {
        if (!(await ProjectUser_1.ProjectUser.HasPermission(projectId, currentUser.Id, UserProjectRole_1.UserProjectPermissions.Update))) {
            return false;
        }
        const connection = typeorm_1.getConnection();
        const projectRepository = connection.getRepository(Project_1);
        const project = await projectRepository.findOne(projectId);
        if (!project) {
            return false;
        }
        project.EditValues(name, description);
        await projectRepository.save(project);
        return true;
    }
    static async GetAllProjects(currentUser) {
        return new Promise(async (resolve) => {
            const connection = typeorm_1.getConnection();
            const projectUserRepository = connection.getRepository(ProjectUser_1.ProjectUser);
            const projectUsers = await projectUserRepository.find({ relations: ["User", "Project", "Project.CreatedBy", "Project.Tasks"] });
            const projects = [];
            if (projectUsers.length == 0)
                resolve(projects);
            projectUsers.forEach((projectUser, index, array) => {
                if (projectUser.User.Id == currentUser.Id)
                    projects.push(projectUser.Project);
                if (index == array.length - 1)
                    resolve(projects);
            });
        });
    }
    static async CreateProject(name, description, taskPrefix, currentUser) {
        const connection = typeorm_1.getConnection();
        const projectRepository = connection.getRepository(Project_1);
        const projectUserRepository = connection.getRepository(ProjectUser_1.ProjectUser);
        const project = new Project_1(uuid_1.v4(), name, description, taskPrefix, new Date(), false, currentUser);
        await projectRepository.save(project);
        const projectUser = new ProjectUser_1.ProjectUser(uuid_1.v4(), UserProjectRole_1.UserProjectRole.Owner, project, currentUser);
        await projectUserRepository.save(projectUser);
        return project;
    }
    static async GetProject(projectId, currentUser) {
        if (!(await ProjectUser_1.ProjectUser.HasPermission(projectId, currentUser.Id, UserProjectRole_1.UserProjectPermissions.View))) {
            return null;
        }
        const connection = typeorm_1.getConnection();
        const projectRepository = connection.getRepository(Project_1);
        const project = await projectRepository.findOne(projectId, {
            relations: [
                "ProjectUsers",
                "CreatedBy",
                "ProjectUsers.User",
                "Tasks",
                "Tasks.AssignedTo",
            ]
        });
        return project;
    }
    static async GetNextTask(projectId, currentUser) {
        if (!(await ProjectUser_1.ProjectUser.HasPermission(projectId, currentUser.Id, (UserProjectRole_1.UserProjectPermissions.Update | UserProjectRole_1.UserProjectPermissions.TaskCreate)))) {
            return null;
        }
        const connection = typeorm_1.getConnection();
        const projectRepository = connection.getRepository(Project_1);
        const project = await projectRepository.findOne(projectId);
        if (!project) {
            return null;
        }
        const taskNumber = project.NextTask;
        project.EditNextTask(taskNumber + 1);
        await projectRepository.save(project);
        return taskNumber;
    }
};
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", String)
], Project.prototype, "Id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Project.prototype, "Name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Project.prototype, "Description", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Project.prototype, "TaskPrefix", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Date)
], Project.prototype, "CreatedAt", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], Project.prototype, "Archived", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Project.prototype, "NextTask", void 0);
__decorate([
    typeorm_1.ManyToOne(_ => User_1.User, user => user.CreatedProjects),
    __metadata("design:type", User_1.User)
], Project.prototype, "CreatedBy", void 0);
__decorate([
    typeorm_1.OneToMany(_ => ProjectUser_1.ProjectUser, projectUser => projectUser.Project),
    __metadata("design:type", Array)
], Project.prototype, "ProjectUsers", void 0);
__decorate([
    typeorm_1.OneToMany(_ => Task_1.Task, task => task.Project),
    __metadata("design:type", Array)
], Project.prototype, "Tasks", void 0);
Project = Project_1 = __decorate([
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [String, String, String, String, Date, Boolean, User_1.User])
], Project);
exports.Project = Project;
//# sourceMappingURL=Project.js.map