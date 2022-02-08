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
var User_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const bcryptjs_1 = require("bcryptjs");
const typeorm_1 = require("typeorm");
const uuid_1 = require("uuid");
const IBasicResponse_1 = require("../contracts/IBasicResponse");
let User = User_1 = class User {
    constructor(id, email, username, password, verified, admin, active) {
        this.Id = id;
        this.Email = email;
        this.Username = username;
        this.Password = password;
        this.Verified = verified;
        this.Admin = admin;
        this.Active = active;
    }
    EditBasicDetails(email, username, password) {
        this.Email = email;
        this.Username = username;
        this.Password = password;
    }
    static async IsLoginCorrect(email, password) {
        const connection = typeorm_1.getConnection();
        const userRepository = connection.getRepository(User_1);
        const user = await userRepository.findOne({ Email: email });
        if (!user) {
            return false;
        }
        const same = await bcryptjs_1.compare(password, user.Password);
        return same;
    }
    static async RegisterUser(username, email, password, passwordRepeat) {
        if (password !== passwordRepeat) {
            return false;
        }
        if (password.length < 7) {
            return false;
        }
        const connection = typeorm_1.getConnection();
        const userRepository = connection.getRepository(User_1);
        let user = await userRepository.findAndCount({ Email: email });
        if (user[1] > 0) {
            return false;
        }
        user = await userRepository.findAndCount({ Username: username });
        if (user[1] > 0) {
            return false;
        }
        const activeUsers = await userRepository.find({ Active: true });
        var firstUser = activeUsers.length == 0;
        const hashedPassword = await bcryptjs_1.hash(password, 10);
        const createdUser = new User_1(uuid_1.v4(), email, username, hashedPassword, false, firstUser, true);
        userRepository.save(createdUser);
        return true;
    }
    static async GetUser(userId) {
        const connection = typeorm_1.getConnection();
        const userRepository = connection.getRepository(User_1);
        return await userRepository.findOne(userId);
    }
    static async GetUserByEmailAddress(email) {
        const connection = typeorm_1.getConnection();
        const userRepository = connection.getRepository(User_1);
        return await userRepository.findOne({ Email: email });
    }
    static async GetUserByUsername(username) {
        const connection = typeorm_1.getConnection();
        const userRepository = connection.getRepository(User_1);
        return await userRepository.findOne({ Username: username });
    }
    static async UpdateCurrentUserDetails(currentUser, email, username, password) {
        const connection = typeorm_1.getConnection();
        const userRepo = connection.getRepository(User_1);
        const user = await userRepo.findOne(currentUser.Id);
        if (!user) {
            return IBasicResponse_1.GenerateResponse(false, "User not found");
        }
        const userByEmail = await User_1.GetUserByEmailAddress(email);
        const userByUsername = await User_1.GetUserByUsername(username);
        if (currentUser.Email != email && userByEmail) {
            return IBasicResponse_1.GenerateResponse(false, "Email already in use");
        }
        if (currentUser.Username != username && userByUsername) {
            return IBasicResponse_1.GenerateResponse(false, "Username already in use");
        }
        if (password.length < 7) {
            return IBasicResponse_1.GenerateResponse(false, "Password must be at least 7 characters long");
        }
        const hashedPassword = await bcryptjs_1.hash(password, 10);
        user.EditBasicDetails(email, username, hashedPassword);
        await userRepo.save(user);
        return IBasicResponse_1.GenerateResponse();
    }
};
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", String)
], User.prototype, "Id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], User.prototype, "Email", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], User.prototype, "Username", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], User.prototype, "Password", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], User.prototype, "Verified", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], User.prototype, "Admin", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], User.prototype, "Active", void 0);
User = User_1 = __decorate([
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [String, String, String, String, Boolean, Boolean, Boolean])
], User);
exports.User = User;
//# sourceMappingURL=User.js.map