/**
 * Generate CSRF token for subsequent API requests given a CalCentral session token.
 * 
 * @param {string} sessionToken
 * @returns {string|undefined}
 */
export async function generate_csrf_token(sessionToken) {
    let headers = new Headers()
    headers.append("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0")
    headers.append("Accept", "application/json, text/plain, */*")
    headers.append("Accept-Language", "en-US,en;q=0.5")
    headers.append("Accept-Encoding", "gzip, deflate, br")
    headers.append("DNT", "1")
    headers.append("Sec-GPC", "1")
    headers.append("Connection", "keep-alive")
    headers.append("Referer", "https://calcentral.berkeley.edu/dashboard")
    headers.append("Cookie", `_calcentral_session=${sessionToken}`)
    headers.append("Sec-Fetch-Dest", "empty")
    headers.append("Sec-Fetch-Mode", "cors")
    headers.append("Sec-Fetch-Site", "same-origin")

    let requestOptions = {
        method: "GET",
        headers: headers,
        redirect: "follow"
    }

    let configData = await fetch("https://calcentral.berkeley.edu/api/config", requestOptions)
    let configJSON = await configData.json()

    if (configJSON.uid) {
        console.log("Auth success")
        return configJSON.csrfToken
    } else {
        console.log("Auth fail")
    }
}

