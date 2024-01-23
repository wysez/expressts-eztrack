import { Request, Response, NextFunction } from 'express';

export const authenticated = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  if (request.session.userid) {
    return next();
  } else {
    return response.status(401).json({
      message: 'Unauthorized',
    });
  }
};
