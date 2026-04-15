const express = require("express")
const app = express()

app.use(express.json())

let usedIPs = {}

app.post("/verify", (req, res) => {
  let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress

  if (usedIPs[ip]) {
    return res.json({ status: "fail" })
  }

  usedIPs[ip] = true
  return res.json({ status: "ok" })
})

app.listen(3000, () => console.log("Server running"))
