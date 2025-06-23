import { Request } from "express";

interface IExtedREquest extends Request{
    user ?: {
         id: string,
         currentInstituteNumber ?: string | null
    }
}

export { IExtedREquest }