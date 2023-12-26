/**
 * Send message to Discord webhook.
 * 
 * @param {string} url 
 * @param {string} message 
 */
export async function notify(url, message) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    let raw = JSON.stringify({
        "content": message
    });

    let requestOptions = {
        method: "POST",
        headers: headers,
        body: raw,
        redirect: "follow"
    };

    await fetch(url, requestOptions)
}