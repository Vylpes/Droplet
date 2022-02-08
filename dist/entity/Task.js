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
var Task_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const typeorm_1 = require("typeorm");
const UserProjectRole_1 = require("../constants/UserProjectRole");
const Project_1 = require("./Project");
const ProjectUser_1 = require("./ProjectUser");
const User_1 = require("./User");
const uuid_1 = require("uuid");
let Task = Task_1 = class Task {
    constructor(id, taskNumber, name, description, createdBy, createdAt, done, archived, project, assignedTo, parentTask) {
        this.Id = id;
        this.TaskNumber = taskNumber;
        this.Name = name;
        this.Description = description;
        this.CreatedBy = createdBy;
        this.AssignedTo = assignedTo;
        this.CreatedAt = createdAt;
        this.ParentTask = parentTask;
        this.Done = done;
        this.Archived = archived;
        this.Project = project;
    }
    EditBasicValues(name, description) {
        this.Name = name;
        this.Description = description;
    }
    AssignUser(user) {
        this.AssignedTo = user;
    }
    UnassignUser() {
        this.AssignedTo = null;
    }
    ToggleDoneStatus() {
        this.Done = !this.Done;
    }
    ToggleArchiveStatus() {
        this.Archived = !this.Archived;
    }
    static async GetAllTasks(currentUser) {
        const connection = typeorm_1.getConnection();
        const userRepository = connection.getRepository(User_1.User);
        const user = await userRepository.findOne(currentUser.Id, { relations: [
                "AssignedProjects",
                "AssignedProjects.Project",
                "AssignedProjects.Project.Tasks",
                "AssignedProjects.Project.Tasks.AssignedTo",
                "AssignedProjects.Project.Tasks.Project",
            ],
        });
        let projects = user.AssignedProjects.map(x => x.Project);
        let tasks = projects.flatMap(x => x.Tasks);
        return tasks;
    }
    static async GetAssignedTasks(userId) {
        const connection = typeorm_1.getConnection();
        const userRepository = connection.getRepository(User_1.User);
        const user = await userRepository.findOne(userId, { relations: ["AssignedTasks"] });
        if (!user) {
            return null;
        }
        return user.AssignedTasks;
    }
    static async CreateTask(name, description, createdBy, project, assignedTo, parentTask) {
        if (!(await ProjectUser_1.ProjectUser.HasPermission(project.Id, createdBy.Id, UserProjectRole_1.UserProjectPermissions.TaskCreate))) {
            return null;
        }
        const connection = typeorm_1.getConnection();
        const taskRepository = connection.getRepository(Task_1);
        const taskNumber = await Project_1.Project.GetNextTask(project.Id, createdBy);
        const task = new Task_1(uuid_1.v4(), taskNumber, name, description, createdBy, new Date(), false, false, project, assignedTo, parentTask);
        await taskRepository.save(task);
        return task;
    }
    static async GetTaskByTaskString(taskString, currentUser) {
        const taskPrefix = taskString.split('-')[0];
        const taskNumber = taskString.split('-')[1];
        const connection = typeorm_1.getConnection();
        const projectRepository = connection.getRepository(Project_1.Project);
        const project = await projectRepository.findOne({ TaskPrefix: taskPrefix }, {
            relations: [
                "Tasks",
                "Tasks.Project",
                "Tasks.Project.ProjectUsers",
                "Tasks.Project.ProjectUsers.User",
                "Tasks.CreatedBy",
                "Tasks.AssignedTo",
            ]
        });
        if (!project) {
            return null;
        }
        if (!(await ProjectUser_1.ProjectUser.HasPermission(project.Id, currentUser.Id, UserProjectRole_1.UserProjectPermissions.TaskView))) {
            return null;
        }
        const task = project.Tasks.find(x => x.TaskNumber == Number.parseInt(taskNumber));
        return task;
    }
    static async EditTask(taskString, name, description, currentUser) {
        if (!taskString || !name) {
            return false;
        }
        const connection = typeorm_1.getConnection();
        const taskRepository = connection.getRepository(Task_1);
        const task = await Task_1.GetTaskByTaskString(taskString, currentUser);
        if (!task) {
            return false;
        }
        if (!(await ProjectUser_1.ProjectUser.HasPermission(task.Project.Id, currentUser.Id, UserProjectRole_1.UserProjectPermissions.TaskUpdate))) {
            return false;
        }
        task.EditBasicValues(name, description);
        await taskRepository.save(task);
        return true;
    }
    static async AssignUserToTask(taskString, user, currentUser) {
        const connection = typeorm_1.getConnection();
        const taskRepository = connection.getRepository(Task_1);
        const task = await Task_1.GetTaskByTaskString(taskString, currentUser);
        if (!task) {
            return false;
        }
        if (!(await ProjectUser_1.ProjectUser.HasPermission(task.Project.Id, currentUser.Id, UserProjectRole_1.UserProjectPermissions.TaskAssign))) {
            return false;
        }
        task.AssignUser(user);
        await taskRepository.save(task);
        return true;
    }
    static async UnassignUserFromTask(taskString, currentUser) {
        const connection = typeorm_1.getConnection();
        const taskRepository = connection.getRepository(Task_1);
        const task = await Task_1.GetTaskByTaskString(taskString, currentUser);
        if (!task) {
            return false;
        }
        if (!task.AssignedTo) {
            return false;
        }
        if (!(await ProjectUser_1.ProjectUser.HasPermission(task.Project.Id, currentUser.Id, UserProjectRole_1.UserProjectPermissions.TaskAssign))) {
            return false;
        }
        task.UnassignUser();
        await taskRepository.save(task);
        return true;
    }
    static async ToggleTaskCompleteStatus(taskString, currentUser) {
        const connection = typeorm_1.getConnection();
        const taskRepo = connection.getRepository(Task_1);
        const task = await Task_1.GetTaskByTaskString(taskString, currentUser);
        if (!task) {
            return false;
        }
        if (!(await ProjectUser_1.ProjectUser.HasPermission(task.Project.Id, currentUser.Id, UserProjectRole_1.UserProjectPermissions.TaskUpdate))) {
            return false;
        }
        ;
        task.ToggleDoneStatus();
        await taskRepo.save(task);
        return true;
    }
    static async ToggleTaskArchiveStatus(taskString, currentUser) {
        const connection = typeorm_1.getConnection();
        const taskRepo = connection.getRepository(Task_1);
        const task = await Task_1.GetTaskByTaskString(taskString, currentUser);
        if (!task) {
            return false;
        }
        if (!(await ProjectUser_1.ProjectUser.HasPermission(task.Project.Id, currentUser.Id, UserProjectRole_1.UserProjectPermissions.TaskUpdate))) {
            return false;
        }
        task.ToggleArchiveStatus();
        await taskRepo.save(task);
        return true;
    }
};
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", String)
], Task.prototype, "Id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Task.prototype, "TaskNumber", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Task.prototype, "Name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Task.prototype, "Description", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Date)
], Task.prototype, "CreatedAt", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], Task.prototype, "Done", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], Task.prototype, "Archived", void 0);
__decorate([
    typeorm_1.ManyToOne(_ => User_1.User, user => user.CreatedTasks),
    __metadata("design:type", User_1.User)
], Task.prototype, "CreatedBy", void 0);
__decorate([
    typeorm_1.ManyToOne(_ => User_1.User, user => user.AssignedTasks),
    __metadata("design:type", User_1.User)
], Task.prototype, "AssignedTo", void 0);
__decorate([
    typeorm_1.ManyToOne(_ => Task_1, task => task.ChildTasks),
    __metadata("design:type", Task)
], Task.prototype, "ParentTask", void 0);
__decorate([
    typeorm_1.ManyToOne(_ => Project_1.Project, project => project.Tasks),
    __metadata("design:type", Project_1.Project)
], Task.prototype, "Project", void 0);
__decorate([
    typeorm_1.ManyToOne(_ => Task_1, task => task.ParentTask),
    __metadata("design:type", Array)
], Task.prototype, "ChildTasks", void 0);
Task = Task_1 = __decorate([
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [String, Number, String, String, User_1.User, Date, Boolean, Boolean, Project_1.Project, User_1.User, Task])
], Task);
exports.Task = Task;
//# sourceMappingURL=Task.js.map