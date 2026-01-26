import jwt from 'jsonwebtoken'

const auth = async (req, res, next) => {
  try {
    console.log("🔥 Incoming cookies1:", req.cookies)
    console.log("🔥 Authorization header1:", req.headers.authorization)

    const token =
      req.cookies?.accessToken ||
      req.headers?.authorization?.split(" ")[1]

    if (!token) {
      return res.status(401).json({
        message: "Provide token"
      })
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN)
    req.userId = decode.id
    next()
  } catch (error) {
    console.error("AUTH ERROR:", error)
    return res.status(401).json({ message: "Unauthorized" })
  }
}


export default auth