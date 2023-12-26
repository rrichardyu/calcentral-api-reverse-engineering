import dotenv from "dotenv"
dotenv.config()
import { generate_csrf_token } from "./csrf.js"
import { graphql_query } from "./graphql-query.js"
import { notify } from "./webhook-notify.js"

const calcentralSessionToken = process.env.CALCENTRAL_SESSION_TOKEN
const delay = process.env.DELAY
const webhookURL = process.env.WEBHOOK_URL
const query = "query {\n    user {\n        sid\n        uid\n        majors {\n            college\n            description\n            formalDescription\n        }\n    }\n}"

let tokenStorage = [calcentralSessionToken]

let init = async (sessionToken) => {
    let csrfToken = await generate_csrf_token(sessionToken)
    let result = await graphql_query(csrfToken, calcentralSessionToken, query)
    let queryData = result.data
    let newSessionToken = result.token

    console.log(`SID: ${queryData.data.user.sid}`)
    console.log(`Major: ${queryData.data.user.majors[0].description}`)
    // console.log(`New session token: ${newSessionToken}`)

    await notify(webhookURL, `Major: ${queryData.data.user.majors[0].description}`)

    tokenStorage[0] = newSessionToken
}

init(calcentralSessionToken)
setInterval(init, delay, tokenStorage[0])