import {store} from "../redux/store";
import default_avatar from "@/public/DefaultAvatar.jpg"

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
        alert("[400] "+data.info);
        return data;
    }
    
    
    // HTTP status 401
    if (response.status === 401 && code === -2) {
        alert("[401] "+data.info);
        return data;
    }



    // HTTP status 404
    if (response.status === 404 && code === -1) {
        alert("[404] "+data.info);
        return data;
    }
    
    // Http status 405
    if (response.status === 405 && code === -3) {
        alert("[405] "+data.info);
        return data;
    }
    

    // Http status 409
    if (response.status === 409 && code === -5) {
        alert("[409] "+data.info);
        return data;
    }
    
    
    //Http status 412
    if(response.status === 412 && code === -6){
        alert("[412] "+data.info);
        return data;
    }
    
        
    // HTTP status 500
    if (response.status === 500 && code === -4){
        alert("[500] "+data.info);
        return data;
    }
    


    // HTTP status 200
    if (response.status === 200 && code === 0) {
        return data;
    }
    
    alert(`[${response.status}] ` + data.info);
    
};
