"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProjectPermissions = exports.UserProjectRole = void 0;
var UserProjectRole;
(function (UserProjectRole) {
    UserProjectRole[UserProjectRole["Member"] = 0] = "Member";
    UserProjectRole[UserProjectRole["Admin"] = 1] = "Admin";
    UserProjectRole[UserProjectRole["Owner"] = 2] = "Owner";
})(UserProjectRole = exports.UserProjectRole || (exports.UserProjectRole = {}));
var UserProjectPermissions;
(function (UserProjectPermissions) {
    UserProjectPermissions[UserProjectPermissions["None"] = 0] = "None";
    UserProjectPermissions[UserProjectPermissions["View"] = 2] = "View";
    UserProjectPermissions[UserProjectPermissions["Update"] = 4] = "Update";
    UserProjectPermissions[UserProjectPermissions["Assign"] = 8] = "Assign";
    UserProjectPermissions[UserProjectPermissions["Promote"] = 16] = "Promote";
    UserProjectPermissions[UserProjectPermissions["TaskView"] = 32] = "TaskView";
    UserProjectPermissions[UserProjectPermissions["TaskCreate"] = 64] = "TaskCreate";
    UserProjectPermissions[UserProjectPermissions["TaskUpdate"] = 128] = "TaskUpdate";
    UserProjectPermissions[UserProjectPermissions["TaskDelete"] = 256] = "TaskDelete";
    UserProjectPermissions[UserProjectPermissions["TaskAssign"] = 512] = "TaskAssign";
})(UserProjectPermissions = exports.UserProjectPermissions || (exports.UserProjectPermissions = {}));
//# sourceMappingURL=UserProjectRole.js.map