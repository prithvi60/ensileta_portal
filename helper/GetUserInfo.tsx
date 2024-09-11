import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET;

if (!JWT_SECRET) {
    throw new Error("NEXTAUTH_SECRET is not defined in environment variables");
}

export const getUserFromToken = (token: string) => {
    try {
        // Ensure token is in the form of "Bearer <token>"
        const tokenWithoutBearer = token.startsWith("Bearer ") ? token.slice(7) : token;

        if (!tokenWithoutBearer) {
            return null;
        }

        // Verify and decode the token
        const decoded = jwt.verify(tokenWithoutBearer, JWT_SECRET) as JwtPayload;
        // console.log("decoded", decoded);

        // Ensure decoded token contains required properties
        if (typeof decoded === 'object' && decoded.id) {
            return decoded;
        }

        return null;

    } catch (error) {
        console.error("Invalid Token:", error);
        return null;
    }
};
