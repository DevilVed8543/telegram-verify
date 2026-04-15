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

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log("Server running"))
