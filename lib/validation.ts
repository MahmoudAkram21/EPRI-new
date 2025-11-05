import { z } from "zod";

interface User {
    email: string;
    password: string;
}


interface UserRegister {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    agreeToTerms: boolean;
}
export  function validateUser(user: User) {
    const userSchema = z.object({
        email : z.string().email(),
        password : z.string().min(8),
      })
    const  result = userSchema.safeParse(user);

    let errorMessage :string[] = [];
    if(!result.success){
        result.error.issues.map((issue) => {
            errorMessage.push(issue.message as string);
        });
        return errorMessage;
    }
    return null;
}


export function validateUserRegister(user: UserRegister) {
    const userSchema = z.object({
        firstName : z.string().min(3).regex(/^[a-zA-Z]+$/, {
            message: "First name must contain only letters and be at least 3 characters long",
        }),
        lastName : z.string().min(3).regex(/^[a-zA-Z]+$/, {
            message: "Last name must contain only letters and be at least 3 characters long",
        }),
        email : z.string().email(),
        password : z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
            message: "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character",
        }),
        confirmPassword : z.string().min(8).refine((value) => value === user.password, {
            message: "Passwords do not match",
        }),
        agreeToTerms : z.boolean().refine((value) => value, {
            message: "You must agree to the terms and conditions",
        }),
    })
    const result = userSchema.safeParse(user);
    let errorMessage :string[] = [];
    if(!result.success){
        result.error.issues.map((issue) => {
            errorMessage.push(issue.message as string);
        });
        return errorMessage;
    }
    return null;
}