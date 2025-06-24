import { Request } from "express";

interface IExtedREquest extends Request{
    user ?: {
         id: string,
         currentInstituteNumber ?: string | number | null
    }
}

export { IExtedREquest }