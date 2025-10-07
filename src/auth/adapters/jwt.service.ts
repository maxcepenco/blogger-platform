import {SETTINGS} from "../../core/settings/settings"
import jwt from 'jsonwebtoken';

export const jwtService = {

    async createAccessToken(userId: string): Promise< string > {
        return jwt.sign({ userId }, SETTINGS.AC_SECRET!, { expiresIn: SETTINGS.AC_TIME as any })
    },


    async createRefreshToken(userId: string): Promise< string > {

        const token = jwt.sign({ userId }, SETTINGS.RT_SECRET!, { expiresIn: SETTINGS.RT_TIME as any })

        return  token
    },


    async verifyAccessToken(token: string): Promise<{ userId: string} | null> {
    try{
        return jwt.verify(token, SETTINGS.AC_SECRET) as { userId: string }
    }catch (error) {
        console.error('Token verification failed')
        return null;
        }
    },

    async verifyRefreshToken(token: string): Promise<{ userId: string} | null> {
        try{
            return jwt.verify(token, SETTINGS.RT_SECRET) as { userId: string }
        }catch (error) {
            console.error('Token verification failed')
            return null;
        }
    }


}
