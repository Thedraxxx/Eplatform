/*
 1) so yo kina chiyo vanda tyo controllers function harula sabaila return ma response pathauxa-- Promise<Response>
 2) tara express la chi Promise ma <void> khali expect garirahunxa 
 3) express la k vanxa vanda ma affai handle garxu malai chi just response ma void pathau vanara controller lai vanxa

 4) yo error chi tsc ma matra hunxa js ma hudaina ...
 5) kina hudaina ? kinaki typescript la strictly return vako kura harulai type check gari ra hunxa 
 6) yesla k hunu bata bachauxa? 
 7) asynchandler la chi k garxa vanda yesla error lai handle garxa ra void pathauxa 
 8) yadi hamro controller ma try/catch halya xaina vana panai yesla handle garxa 

*/
import { Request, Response, NextFunction, RequestHandler } from "express";

const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default asyncHandler;
