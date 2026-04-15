const express = require("express")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

let usedIPs = {}

app.post("/verify", (req, res) => {
  let ip =
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress

  let user_id = req.body.user_id

  if (usedIPs[ip]) {
    return res.json({ status: "fail" })
  }

  usedIPs[ip] = user_id

  return res.json({ status: "ok" })
})

app.get("/check", (req, res) => {
  let user_id = req.query.user_id

  let found = Object.values(usedIPs).includes(user_id)

  if (found) {
    return res.json({ verified: true })
  } else {
    return res.json({ verified: false })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log("Server running on " + PORT))
