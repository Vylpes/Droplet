"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateResponse = void 0;
;
function GenerateResponse(isSuccess = true, message) {
    return {
        IsSuccess: isSuccess,
        Message: message
    };
}
exports.GenerateResponse = GenerateResponse;
//# sourceMappingURL=IBasicResponse.js.map