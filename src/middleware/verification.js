import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../constant/index.js'

const verification = async (req, res, next) => {
    try {
        const bearerToken = req.headers.authorization
        if (!bearerToken) {
            return res.status(401).json({ status: 401, message: 'Unauthorized' })
        }
        const token = bearerToken.replace(/^Bearer\s+/, "");
        jwt.verify(token, JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ status: 401, message: 'Unauthorized' })
            }
            if (!decoded) {
                return res.status(401).json({ status: 401, message: 'Unauthorized' })
            }
            if (!decoded.id) {
                return res.status(401).json({ status: 401, message: 'Unauthorized' })
            }
            req.decoded = decoded
            next()
        })
    } catch (error) {
        console.log(error)
        return res.status(401).json({ status: 401, message: 'Unauthorized' })
    }

}

export default verification