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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = run;
const axios_1 = __importDefault(require("axios"));
function getZoomAccessToken(accountId, clientId, clientSecret) {
    return __awaiter(this, void 0, void 0, function* () {
        const tokenUrl = `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountId}`;
        const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
        try {
            const response = yield axios_1.default.post(tokenUrl, null, {
                headers: {
                    Authorization: `Basic ${authHeader}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            const bearerToken = response.data.access_token;
            return bearerToken;
        }
        catch (error) {
            console.error('Error obtaining Zoom access token:', error);
            throw new Error('Failed to obtain Zoom access token');
        }
    });
}
function getPastMeetingParticipants(baseUrl, meetingId, bearerToken) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            const url = `${baseUrl}/past_meetings/${meetingId}/participants`;
            const response = yield axios_1.default.get(url, {
                headers: {
                    Authorization: `Bearer ${bearerToken}`,
                    'Content-Type': 'application/json',
                },
            });
            return {
                data: response.data,
                status: response.status,
                statusText: response.statusText,
            };
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                throw new Error(((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || error.message);
            }
            else {
                throw new Error('An unknown error occurred');
            }
        }
    });
}
function getMeetingPollsQuestions(baseUrl, meetingId, bearerToken) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            const url = `${baseUrl}/meetings/${meetingId}/polls`;
            const response = yield axios_1.default.get(url, {
                headers: {
                    Authorization: `Bearer ${bearerToken}`,
                    'Content-Type': 'application/json',
                },
            });
            return {
                data: response.data,
                status: response.status,
                statusText: response.statusText,
            };
        }
        catch (error) {
            throw new Error(((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || error.message);
        }
    });
}
function getPastMeetingPolls(baseUrl, meetingId, bearerToken) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            const url = `${baseUrl}/past_meetings/${meetingId}/polls`;
            const response = yield axios_1.default.get(url, {
                headers: {
                    Authorization: `Bearer ${bearerToken}`,
                },
            });
            return {
                data: response.data,
                status: response.status,
                statusText: response.statusText,
            };
        }
        catch (error) {
            throw new Error(((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || error.message);
        }
    });
}
function processParticipantsAndPollsData(participants, pollScores) {
    const participantMap = new Map();
    participants.forEach(participant => {
        const name = participant.name;
        const joinTime = new Date(participant.join_time).getTime();
        const leaveTime = new Date(participant.leave_time).getTime();
        const duration = (leaveTime - joinTime) / 1000;
        const mappingData = { Email: participant.user_email || 'NaN', LTId: 'NaN' };
        if (participantMap.has(name)) {
            participantMap.get(name).totalTime += duration;
        }
        else {
            participantMap.set(name, {
                totalTime: duration,
                joinTime: joinTime,
                leaveTime: leaveTime,
                email: mappingData.Email,
                LTId: mappingData.LTId,
                total_score: 0,
                attempted: 0,
                total_questions: 0,
            });
        }
    });
    pollScores.forEach((data, name) => {
        const participantData = participantMap.get(name);
        if (participantData) {
            participantData.total_score = data.total_score;
            participantData.attempted = data.attempted;
            participantData.total_questions = data.total_questions;
        }
    });
    return participantMap;
}
function saveProcessedDataToFile(data, meetingId) {
    const processedData = {
        meetingId: meetingId,
        attendees: Array.from(data.entries()).map(([name, participantData]) => ({
            name,
            totalTime: participantData.totalTime,
            joinTime: participantData.joinTime,
            leaveTime: participantData.leaveTime,
            email: participantData.email,
            LTId: participantData.LTId,
            total_score: participantData.total_score,
            attempted: participantData.attempted,
            total_questions: participantData.total_questions,
        }))
    };
    return processedData;
}
function calculateScore(pollsQuestionsResponse, pollsAnswers) {
    const participantMap = new Map();
    pollsAnswers.questions.forEach((participant) => {
        const participantData = {
            totalTime: 0,
            joinTime: 0,
            leaveTime: 0,
            email: '',
            LTId: '',
            total_score: 0,
            attempted: 0,
            total_questions: 0,
        };
        participant.question_details.forEach((responseDetail) => {
            const pollQuestion = pollsQuestionsResponse.polls.find(poll => poll.id === responseDetail.polling_id);
            if (pollQuestion) {
                const question = pollQuestion.questions.find(q => q.name == responseDetail.question);
                const scoreObj = {
                    title: pollQuestion.title,
                    question: (question === null || question === void 0 ? void 0 : question.name) || 'Default',
                    score: 0
                };
                if (question) {
                    participantData.attempted++;
                    if (!question.right_answers) {
                        scoreObj.score++;
                        participantData.total_score++;
                    }
                    else {
                        if (question.right_answers.includes(responseDetail.answer)) {
                            scoreObj.score++;
                            participantData.total_score++;
                        }
                    }
                }
                participantData.total_questions = participantData.attempted;
            }
        });
        participantMap.set(participant.name, participantData);
    });
    return participantMap;
}
function run(accountId, clientId, clientSecret, meetingId) {
    return __awaiter(this, void 0, void 0, function* () {
        const baseUrl = "https://api.zoom.us/v2";
        try {
            const bearerToken = yield getZoomAccessToken(accountId, clientId, clientSecret);
            const participantsResponse = yield getPastMeetingParticipants(baseUrl, meetingId, bearerToken);
            const pollsQuestionResponse = yield getMeetingPollsQuestions(baseUrl, meetingId, bearerToken);
            const pollsResponse = yield getPastMeetingPolls(baseUrl, meetingId, bearerToken);
            const scores = calculateScore(pollsQuestionResponse.data, pollsResponse.data);
            const participantMap = processParticipantsAndPollsData(participantsResponse.data.participants, scores);
            const processedData = saveProcessedDataToFile(participantMap, meetingId);
            return processedData;
        }
        catch (error) {
            console.error('Error:', error);
        }
    });
}
