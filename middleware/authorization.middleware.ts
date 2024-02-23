import { NextFunction, Request, Response } from 'express';

import userMessage from '../messages/user.messages';
import {
  verifyToken
} from "../shared/jwt-token.helpers";

// all requests pass through this function to check "Authorization" token
async function authUser (req: Request, res: Response, next: NextFunction) {
  // auth paths, security not needed
  if (req.url.includes("auth")) {
    next();
    return;
  } 

  try {
    // get the token from the headers
    const { authorization } = req.headers;
    // verify the token
    const verificationData = verifyToken(authorization ?? "");
    // if error return
    if (verificationData?.error) {
      res.status(401).json({
        message: verificationData.message,
        data: null,
        error: true
      });

      return;
    }

    // pass control if valid token
    next();

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: userMessage.USER_AUTH_ERROR,
      data: null,
      error: true
    });
  }
}

export default authUser;