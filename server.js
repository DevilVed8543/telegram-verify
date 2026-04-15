const express = require("express")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

// store verified users (user_id -> ip)
let verified = {}

app.post("/verify", (req, res) => {
  let ip =
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress

  let user_id = req.body.user_id

  if (!user_id) {
    return res.json({ status: "error" })
  }

  // if same user tries from another device
  if (verified[user_id] && verified[user_id] !== ip) {
    return res.json({ status: "fail" })
  }

  // if same device used by another user
  for (let u in verified) {
    if (verified[u] === ip && u != user_id) {
      return res.json({ status: "fail" })
    }
  }

  // save verification
  verified[user_id] = ip

  return res.json({ status: "ok" })
})

app.get("/check", (req, res) => {
  let user_id = req.query.user_id

  let isVerified = !!verified[user_id]

  return res.json({ verified: isVerified })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log("Server running on " + PORT))
