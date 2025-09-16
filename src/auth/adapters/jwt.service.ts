import { SETTINGS } from "../../core/settings/settings"
import jwt from 'jsonwebtoken';

export const jwtService = {
    async createToken(userId: string): Promise< string > {
        return jwt.sign({ userId }, SETTINGS.AC_SECRET!, { expiresIn: SETTINGS.AC_TIME as any })
    },

    async verifyToken(token: string): Promise<{ userId: string} | null> {
    try{
        return jwt.verify(token, SETTINGS.AC_SECRET) as { userId: string }
    }catch (error) {
        console.error('Token verification failed')
        return null;
        }
    }

}