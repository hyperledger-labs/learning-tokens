"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const zoomprocessor_1 = require("../src/zoomprocessor");
test('fetch and process Zoom data', () => __awaiter(void 0, void 0, void 0, function* () {
    const accountId = "YOUR_ACCOUNT_ID";
    const clientId = "YOUR_CLIENT_ID";
    const clientSecret = "YOUR_CLIENT_SECRET";
    const meetingId = 'YOUR_MEETING_ID';
    const processedData = yield (0, zoomprocessor_1.run)(accountId, clientId, clientSecret, meetingId);
    expect(processedData).toMatchSnapshot();
}));
