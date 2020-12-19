import jwt, { VerifyErrors, JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import type { RequestHandler as RH } from 'express';
import RequestLog from 'models/requestLog';
import User from 'models/user';

declare type AsyncFn<T> = T extends (...p: infer P) => infer R ? (...p: P) => Promise<R> : never;

interface TypeMap {
  decoded: Record<string, unknown>;
  expired: TokenExpiredError;
  tampered: JsonWebTokenError;
  other: unknown;
}

type ReturnVal<T> = T extends 'decoded'
  ? { type: T; value: TypeMap[T] }
  : T extends 'expired'
  ? { type: T; value: TypeMap[T] }
  : T extends 'tampered'
  ? { type: T; value: TypeMap[T] }
  : T extends 'other'
  ? { type: T; value: TypeMap[T] }
  : never;

const decodeOrUnifyErrorsJWT: AsyncFn<(token: string) => ReturnVal<keyof TypeMap>> = async (token: string) => {
  return new Promise(resolve => {
    // eslint-disable-next-line @typescript-eslint/ban-types
    jwt.verify(token, process.env.JWT_SECRET, async (err: VerifyErrors | null, decodedToken: object | undefined) => {
      if (!err && decodedToken)
        resolve({
          type: 'decoded',
          value: decodedToken as Record<string, unknown>
        });
      else {
        if (err instanceof TokenExpiredError) {
          // Token needs to be refreshed
          resolve({ type: 'expired', value: err });
        } else if (err instanceof JsonWebTokenError) {
          // Token
          switch (err.message) {
            case 'jwt malformed': // Trickered by nonsense value e.g. value === 'asdf'
            case 'invalid token': // Triggered by modifying encoded values
            case 'invalid signature': // Triggered by modifying decoded values
              resolve({ type: 'tampered', value: err });
          }
        }
      }
      resolve({ type: 'other', value: err });
    });
  });
};

const handleLoggingTamperedJWT = async (error: Error, request: import('express').Request) => {
  console.warn('\x1b[41m\x1b[30m%s\x1b[0m', 'POTENTIALLY TAMPERED JWT TOKEN DETECTED');
  console.table(error);
  try {
    await RequestLog.create({ request, error, message: 'POTENTIALLY TAMPERED JWT TOKEN DETECTED' });
    console.log('db record added');
  } catch (err) {
    console.log(err);
    console.log('writing record to db failed');
    console.log(request);
  }
};

const requireAuth: RH = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) return res.redirect('/login');
  const result = await decodeOrUnifyErrorsJWT(token);

  switch (result.type) {
    case 'expired':
      // Token needs to be refreshed
      console.log('token expired');
      break;
    case 'tampered':
      await handleLoggingTamperedJWT(result.value, req);
      break;
    case 'other':
      break;
    case 'decoded':
      return next();
  }
  console.log(`clearing jwt cookie. Reason: request token seems to be ${result.type}`);
  return res.clearCookie('jwt').redirect('/login');
};

const checkUser: RH = async (req, res, next) => {
  res.locals.user = null;
  const token = req.cookies.jwt;
  if (!token) return next();
  const result = await decodeOrUnifyErrorsJWT(token);

  switch (result.type) {
    case 'expired':
      // Token needs to be refreshed
      console.log('token expired');
      return next();
    case 'tampered':
      await handleLoggingTamperedJWT(result.value, req);
      break;
    case 'other':
      break;
    case 'decoded':
      const user = await User.findById(result.value.id);
      res.locals.user = user;
      return next();
  }
  console.log(`clearing jwt cookie. Reason: request token seems to be ${result.type}`);
  return res.clearCookie('jwt').redirect('/login');
};

export { requireAuth, checkUser };
