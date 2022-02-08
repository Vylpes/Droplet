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
var ProjectUser_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectUser = void 0;
const typeorm_1 = require("typeorm");
const UserProjectRole_1 = require("../constants/UserProjectRole");
const Project_1 = require("./Project");
const User_1 = require("./User");
const uuid_1 = require("uuid");
let ProjectUser = ProjectUser_1 = class ProjectUser {
    constructor(id, role, project, user) {
        this.Id = id;
        this.Role = role;
        this.Project = project;
        this.User = user;
    }
    UpdateRole(role) {
        this.Role = role;
    }
    static async GetPermissions(projectId, userId) {
        const connection = typeorm_1.getConnection();
        const projectRepository = connection.getRepository(Project_1.Project);
        const projectUserRepository = connection.getRepository(ProjectUser_1);
        const userRepository = connection.getRepository(User_1.User);
        const project = await projectRepository.findOne(projectId);
        const user = await userRepository.findOne(userId);
        if (!project || !user) {
            return UserProjectRole_1.UserProjectPermissions.None;
        }
        const projectUser = await projectUserRepository.findOne({ Project: project, User: user }, { relations: ["Project", "User"] });
        if (!projectUser) {
            return UserProjectRole_1.UserProjectPermissions.None;
        }
        let permissions = UserProjectRole_1.UserProjectPermissions.None;
        switch (projectUser.Role) {
            case UserProjectRole_1.UserProjectRole.Member:
                permissions |= (UserProjectRole_1.UserProjectPermissions.View |
                    UserProjectRole_1.UserProjectPermissions.TaskView |
                    UserProjectRole_1.UserProjectPermissions.TaskCreate |
                    UserProjectRole_1.UserProjectPermissions.TaskUpdate |
                    UserProjectRole_1.UserProjectPermissions.TaskAssign);
                break;
            case UserProjectRole_1.UserProjectRole.Admin:
                permissions |= (UserProjectRole_1.UserProjectPermissions.View |
                    UserProjectRole_1.UserProjectPermissions.Update |
                    UserProjectRole_1.UserProjectPermissions.Assign |
                    UserProjectRole_1.UserProjectPermissions.Promote |
                    UserProjectRole_1.UserProjectPermissions.TaskView |
                    UserProjectRole_1.UserProjectPermissions.TaskCreate |
                    UserProjectRole_1.UserProjectPermissions.TaskUpdate |
                    UserProjectRole_1.UserProjectPermissions.TaskDelete |
                    UserProjectRole_1.UserProjectPermissions.TaskAssign);
            case UserProjectRole_1.UserProjectRole.Owner:
                permissions |= (UserProjectRole_1.UserProjectPermissions.View |
                    UserProjectRole_1.UserProjectPermissions.Update |
                    UserProjectRole_1.UserProjectPermissions.Assign |
                    UserProjectRole_1.UserProjectPermissions.Promote |
                    UserProjectRole_1.UserProjectPermissions.TaskView |
                    UserProjectRole_1.UserProjectPermissions.TaskCreate |
                    UserProjectRole_1.UserProjectPermissions.TaskUpdate |
                    UserProjectRole_1.UserProjectPermissions.TaskDelete |
                    UserProjectRole_1.UserProjectPermissions.TaskAssign);
        }
        return permissions;
    }
    static async GetRole(projectId, userId) {
        const connection = typeorm_1.getConnection();
        const projectRepository = connection.getRepository(Project_1.Project);
        const projectUserRepository = connection.getRepository(ProjectUser_1);
        const userRepository = connection.getRepository(User_1.User);
        const project = await projectRepository.findOne(projectId);
        const user = await userRepository.findOne(userId);
        if (!project || !user) {
            return null;
        }
        const projectUser = await projectUserRepository.findOne({ Project: project, User: user }, { relations: ["Project", "User"] });
        if (typeof projectUser != "number" && !projectUser) {
            return null;
        }
        return projectUser.Role;
    }
    static async HasPermission(projectId, userId, permission) {
        return (await this.GetPermissions(projectId, userId) & permission) == permission;
    }
    static async AssignUserToProject(projectId, userId, currentUser) {
        if (!(await ProjectUser_1.HasPermission(projectId, currentUser.Id, UserProjectRole_1.UserProjectPermissions.Assign))) {
            return null;
        }
        const connection = typeorm_1.getConnection();
        const projectUserRepository = connection.getRepository(ProjectUser_1);
        const project = await Project_1.Project.GetProject(projectId, currentUser);
        const user = await User_1.User.GetUser(userId);
        if (!project || !user) {
            return null;
        }
        const projectUser = new ProjectUser_1(uuid_1.v4(), UserProjectRole_1.UserProjectRole.Member, project, user);
        await projectUserRepository.save(projectUser);
        return projectUser;
    }
    static async UnassignUserFromProject(projectId, userId, currentUser) {
        if (!(await ProjectUser_1.HasPermission(projectId, currentUser.Id, UserProjectRole_1.UserProjectPermissions.Assign))) {
            return false;
        }
        if (userId == currentUser.Id)
            return false;
        const connection = typeorm_1.getConnection();
        const projectUserRepository = connection.getRepository(ProjectUser_1);
        const project = await Project_1.Project.GetProject(projectId, currentUser);
        const user = await User_1.User.GetUser(userId);
        if (!project || !user) {
            return false;
        }
        const projectUser = await projectUserRepository.findOne({ Project: project, User: user }, { relations: ["Project", "User"] });
        const currentProjectUser = await projectUserRepository.findOne({ Project: project, User: currentUser }, { relations: ["Project", "User"] });
        if (!projectUser || !currentProjectUser) {
            return false;
        }
        if ((projectUser.Role == UserProjectRole_1.UserProjectRole.Admin || projectUser.Role == UserProjectRole_1.UserProjectRole.Owner) && currentProjectUser.Role == UserProjectRole_1.UserProjectRole.Admin) {
            return false;
        }
        await projectUserRepository.remove(projectUser);
        return true;
    }
    static async GetAllUsersNotInProject(projectId, currentUser) {
        return new Promise(async (resolve) => {
            if (!(await ProjectUser_1.HasPermission(projectId, currentUser.Id, UserProjectRole_1.UserProjectPermissions.View))) {
                resolve([]);
                return;
            }
            const connection = typeorm_1.getConnection();
            const projectRepository = connection.getRepository(Project_1.Project);
            const userRepository = connection.getRepository(User_1.User);
            const project = await projectRepository.findOne(projectId, { relations: ["ProjectUsers", "ProjectUsers.User"] });
            if (!project) {
                resolve([]);
                return;
            }
            const users = await userRepository.find();
            const usersNotInProject = [];
            users.forEach((user, index, array) => {
                if (!project.ProjectUsers.find(x => x.User.Id == user.Id)) {
                    usersNotInProject.push(user);
                }
                if (index == array.length - 1)
                    resolve(usersNotInProject);
            });
        });
    }
    static async ToggleAdmin(projectId, userId, currentUser) {
        if (!(await ProjectUser_1.HasPermission(projectId, currentUser.Id, UserProjectRole_1.UserProjectPermissions.Promote))) {
            return false;
        }
        if (userId == currentUser.Id) {
            return false;
        }
        const connection = typeorm_1.getConnection();
        const projectUserRepository = connection.getRepository(ProjectUser_1);
        const project = await Project_1.Project.GetProject(projectId, currentUser);
        const user = await User_1.User.GetUser(userId);
        if (!project || !user) {
            return false;
        }
        const projectUser = await projectUserRepository.findOne({ Project: project, User: user }, { relations: ["Project", "User"] });
        if (!projectUser) {
            return false;
        }
        let newRole;
        switch (projectUser.Role) {
            case UserProjectRole_1.UserProjectRole.Member:
                newRole = UserProjectRole_1.UserProjectRole.Admin;
                break;
            case UserProjectRole_1.UserProjectRole.Admin:
                newRole = UserProjectRole_1.UserProjectRole.Member;
                break;
        }
        projectUser.UpdateRole(newRole);
        await projectUserRepository.save(projectUser);
        return true;
    }
};
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", String)
], ProjectUser.prototype, "Id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], ProjectUser.prototype, "Role", void 0);
__decorate([
    typeorm_1.ManyToOne(_ => Project_1.Project, project => project.ProjectUsers),
    __metadata("design:type", Project_1.Project)
], ProjectUser.prototype, "Project", void 0);
__decorate([
    typeorm_1.ManyToOne(_ => User_1.User, user => user.AssignedProjects),
    __metadata("design:type", User_1.User)
], ProjectUser.prototype, "User", void 0);
ProjectUser = ProjectUser_1 = __decorate([
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [String, Number, Project_1.Project, User_1.User])
], ProjectUser);
exports.ProjectUser = ProjectUser;
//# sourceMappingURL=ProjectUser.js.map