import { SETTINGS } from "../../core/settings/settings"
import jwt from 'jsonwebtoken';

export const jwtService = {
    async createToken(userId: string): Promise< string > {
        return jwt.sign({ userId }, SETTINGS.AC_SECRET!, { expiresIn: SETTINGS.AC_TIME as any })
    }
}