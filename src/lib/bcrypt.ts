import bcrypt from 'bcryptjs';

class CryptHelpers{
    public async encryptPassword(password: string): Promise<string>{
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        return hash;        
    }

    public async matchPassword(password: string, savedPassword: string): Promise<boolean>{
        try{
            return await bcrypt.compare(password, savedPassword);
        }catch(e){
            console.log(e)
            return false;
        }
    }
}

const cryptHelpers = new CryptHelpers();

export default cryptHelpers;