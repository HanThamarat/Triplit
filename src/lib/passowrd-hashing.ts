import bcrypt from "bcrypt";

interface verifyPasswordProps {
    hash: string;
    password: string;
}

export const encryptPassword = async (password: string): Promise<string> =>  {
    return await bcrypt.hash(password, 12);
};

export const verifyPassword = async ({  
    hash,
    password
}: verifyPasswordProps): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
}