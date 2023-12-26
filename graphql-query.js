/**
 * Query CalCentral's GraphQL endpoint.
 * 
 * @param {string} csrfToken 
 * @param {string} sessionToken 
 * @param {string} query
 * @returns {object}
 */
export async function graphql_query(csrfToken, sessionToken, query) {
    let headers = new Headers();
    headers.append("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0")
    headers.append("Accept", "*/*")
    headers.append("Accept-Language", "en-US,en;q=0.5")
    headers.append("Accept-Encoding", "gzip, deflate, br")
    headers.append("content-type", "application/json")
    headers.append("x-csrf-token", csrfToken)
    headers.append("Origin", "https://calcentral.berkeley.edu")
    headers.append("DNT", "1")
    headers.append("Sec-GPC", "1")
    headers.append("Connection", "keep-alive")
    headers.append("Referer", "https://calcentral.berkeley.edu/")
    headers.append("Cookie", `_calcentral_session=${sessionToken}`)
    headers.append("Sec-Fetch-Dest", "empty")
    headers.append("Sec-Fetch-Mode", "cors")
    headers.append("Sec-Fetch-Site", "same-origin")

    const raw = JSON.stringify({
        "query": query,
        "variables": {}
    })

    let requestOptions = {
        method: "POST",
        headers: headers,
        body: raw,
        redirect: "follow"
    }

    let queryData = await fetch("https://calcentral.berkeley.edu/graphql", requestOptions)
    let queryRespCookies = await queryData.headers.getSetCookie()
    let newSessionToken = queryRespCookies[0].split(";")[0].split("=")[1]
    let expiry = queryRespCookies[0].split(";")[2].split("=")[1]
    console.log(`Session expires: ${expiry}`)
    let queryJSON = await queryData.json()

    return {
        data: queryJSON,
        token: newSessionToken
    }
}