import {SETTINGS} from "../../core/settings/settings"
import jwt from 'jsonwebtoken';

interface RefreshTokenPayload {
    userId: string;
    deviceId: string;
    iat: number;
    exp: number;
}

export const jwtService = {

    async createAccessToken(userId: string): Promise< string > {
        return jwt.sign({ userId }, SETTINGS.AC_SECRET!, { expiresIn:"1h" })
    },


    async createRefreshToken(userId: string,deviceId:string): Promise< string > {

        const token = jwt.sign({ userId,deviceId }, SETTINGS.RT_SECRET!, { expiresIn: "1h"})

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

    async verifyRefreshToken(token: string): Promise<RefreshTokenPayload | null> {
        try{
            return jwt.verify(token, SETTINGS.RT_SECRET) as any
        }catch (error) {
            console.error('Token verification failed')
            return null;
        }
    },

    // async verifyRefreshTokenForSession(token: string): Promise<RefreshTokenPayload | null> {
    //     try{
    //         return jwt.verify(token, SETTINGS.RT_SECRET) as any
    //     }catch (error) {
    //         console.error('Token verification failed')
    //         return null;
    //     }
    // }


}
