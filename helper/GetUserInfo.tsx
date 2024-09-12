import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET;

if (!JWT_SECRET) {
    throw new Error("NEXTAUTH_SECRET is not defined in environment variables");
}

export const getUserFromToken = (token: string) => {
    try {
        // Check if token exists and is prefixed with "Bearer "
        const tokenWithoutBearer = token?.startsWith("Bearer ")
            ? token.slice(7)
            : token;

        if (!tokenWithoutBearer) {
            console.warn("Token is empty or improperly formatted.");
            return null;
        }

        // Verify and decode the token
        const decoded = jwt.verify(tokenWithoutBearer, JWT_SECRET) as JwtPayload;

        // Ensure decoded token contains an ID property
        if (decoded && typeof decoded === 'object' && decoded.id) {
            return decoded;
        }

        console.warn("Decoded token does not contain a valid ID.");
        return null;

    } catch (error: any) {
        console.error("Error verifying token:", error.message || error);
        return null;
    }
};
