import axios from "axios";
import { createHash } from "node:crypto";
// 
let appKey = "at.runtastic.gpssportapp";
let clientSecret = "QO3wOdHttnMamWEdtyziWfhUXY4A0jQQ3YV1xOT1UBro4w2V4SxMnjbias8vqRXE";
// 
let requestHeaders = {
    "X-App-Version": "11.19.1",
    "X-App-Key": appKey,
    "Content-Type": "application/json"
};
// 
function make_auth_token(appKey, appSecret, str_now) {
    return createHash('sha1').update(`--${appKey}--${appSecret}--${str_now}--`).digest('hex')
}
function make_request_header(header) {
    const str_now = (new Date()).toISOString().split(".")[0];
    let auth_token = make_auth_token(
        appKey, clientSecret, str_now
    )
    header["X-Date"] = str_now
    header["X-Auth-Token"] = auth_token
    return header
}
async function login({ username, password }) {
    const { data } = await axios.request({
        method: 'POST',
        url: 'https://appws.runtastic.com/webapps/services/auth/v2/login/runtastic',
        headers: make_request_header(requestHeaders),
        data: JSON.stringify({
            "clientSecret": clientSecret,
            "password": password,
            "grantType": "password",
            "username": username,
            "clientId": "L51fb74143ae7db04b45c174306eaed92da04af60b61d3a77a19315047ae5a65",
        })
    })
    requestHeaders["Authorization"] = `Bearer ${data.accessToken}`
    return data;
}
async function getRunSessions({ username, password, from = 0 }) {
    await login({ username, password });
    const { data } = await axios.request({
        method: 'POST',
        url: 'https://appws.runtastic.com/webapps/services/runsessions/v3/sync',
        headers: requestHeaders,
        data: JSON.stringify({
            "syncedUntil": from,
            "perPage": "100",
        })
    })
    return data;
}
async function getDetails({ username, password, runID }) {
    await login({ username, password });
    const { data } = await axios.request({
        method: 'POST',
        url: `https://appws.runtastic.com/webapps/services/runsessions/v2/${runID}/details`,
        headers: requestHeaders,
        data: JSON.stringify({
            "includeGpsTrace": { "include": true, "version": "1" },
            "includeHeartRateTrace": { "include": true, "version": "1" },
            "includeHeartRateZones": true,
        })
    })
    return data;
}
export { login, getRunSessions, getDetails }