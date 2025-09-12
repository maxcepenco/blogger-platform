import bcrypt from 'bcrypt';

export const bcryptService = {
    async generateHash(password: string):Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt)
    },

    async checkPassword(password: string, hash: string): Promise<boolean>  {
      return bcrypt.compare(password, hash)
    }
}

