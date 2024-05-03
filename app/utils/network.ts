import {store} from "../redux/store";
import default_avatar from "@/public/DefaultAvatar.jpg"

export enum NetworkErrorType {
    UNAUTHORIZED,
    BADREQUEST,
    BADMETHOD,
    CONFLICT,
    CORRUPTED_RESPONSE,
    NOTFOUND,
    SERVER_ERROR,
    UNKNOWN_ERROR,
}

export class NetworkError extends Error 
{
    type: NetworkErrorType;
    message: string;

    constructor(
        _type: NetworkErrorType,
        _message: string,
    ) {
        super(_message);

        this.type = _type;
        this.message = _message;
    }

    toString(): string { return this.message; }
    valueOf(): string { return this.message; }
}

export const request = async (
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    needAuth: boolean,
    contentType?: string,
    body?: any,
) => {
    const headers = new Headers();
    if (needAuth) {
        const token = store.getState().auth.token;
        headers.append("Authorization", token);
    }
    if (contentType==="application/json") {
        headers.append("Content-Type", "application/json");
        body=body&&JSON.stringify(body);
    }
    const response = await fetch(url, {
        method,
        body: body,
        headers,
    });
    if(url.includes("avatar")&&response.status===500){
        return default_avatar;
    }
    if (response.headers.get("Content-Type") === "image/jpeg" ||
    response.headers.get("Content-Type") === "image/png" ||
    response.headers.get("Content-Type") === "image/jpg") {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve({ url, width: img.width, height: img.height });
            img.onerror = reject;
            img.src = url;
        });
        
    } 
    const data = await response.json();

    const code = Number(data.code);

    // HTTP status 400
    if (response.status === 400 && code === -7) {
        throw new NetworkError(
            NetworkErrorType.BADREQUEST,
            "[400] " + data.info,
        );
    }
    else if (response.status === 400) {
        throw new NetworkError(
            NetworkErrorType.CORRUPTED_RESPONSE,
            "[400] " + data.info,
        );
    }
    
    // HTTP status 401
    if (response.status === 401 && code === -2) {
        throw new NetworkError(
            NetworkErrorType.UNAUTHORIZED,
            "[401] " + data.info,
        );
    }
    else if (response.status === 401) {
        throw new NetworkError(
            NetworkErrorType.CORRUPTED_RESPONSE,
            "[401] " + data.info,
        );
    }


    // HTTP status 404
    if (response.status === 404 && code === -1) {
        throw new NetworkError(
            NetworkErrorType.NOTFOUND,
            "[404] " + data.info,
        );
    }
    else if (response.status === 404) {
        throw new NetworkError(
            NetworkErrorType.CORRUPTED_RESPONSE,
            "[404] " + data.info,
        );
    }
    // Http status 405
    if (response.status === 405 && code === -3) {
        throw new NetworkError(
            NetworkErrorType.BADMETHOD,
            "[405] " + data.info,
        );
    }
    else if (response.status === 405) {
        throw new NetworkError(
            NetworkErrorType.CORRUPTED_RESPONSE,
            "[405] " + data.info,
        );
    }

    // Http status 409
    if (response.status === 409 && code === -5) {
        throw new NetworkError(
            NetworkErrorType.CONFLICT,
            "[409] " + data.info,
        );
    }
    else if (response.status === 400) {
        throw new NetworkError(
            NetworkErrorType.CORRUPTED_RESPONSE,
            "[409] " + data.info,
        );
    }
    
    // HTTP status 500
    if (response.status === 500 && code === -4){
        throw new NetworkError(
            NetworkErrorType.SERVER_ERROR,
            "[500] " + data.info,
        );
    }
    else if (response.status === 500){
        throw new NetworkError(
            NetworkErrorType.CORRUPTED_RESPONSE,
            "[500] " + data.info,
        );
    }


    // HTTP status 200
    if (response.status === 200 && code === 0) {
        return data;
    }
    else if (response.status === 200) {
        throw new NetworkError(
            NetworkErrorType.CORRUPTED_RESPONSE,
            "[200] " + data.info,
        );
    }

    throw new NetworkError(
        NetworkErrorType.UNKNOWN_ERROR,
        `[${response.status}] ` + data.info,
    );
};
