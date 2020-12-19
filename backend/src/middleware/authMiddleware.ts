import type { RequestHandler as RH } from 'express';
import RequestLog from 'models/requestLog';
import jwt, { VerifyErrors } from 'jsonwebtoken';

const requireAuth: RH = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) return res.redirect('/login');
  // eslint-disable-next-line @typescript-eslint/ban-types
  jwt.verify(token, process.env.JWT_SECRET, async (err: VerifyErrors | null, decodedToken: object | undefined) => {
    if (!err) {
      console.log(decodedToken);
      next();
    } else {
      console.warn('\x1b[41m\x1b[30m%s\x1b[0m', 'TAMPERED JWT TOKEN DETECTED');
      try {
        await RequestLog.create({ request: req, error: err, message: 'TAMPERED TOKEN DETECTED' });
        console.log('record written succesfully');
      } catch (err) {
        console.log(err);
        console.log('record writing to db failed!');
        //console.log(req);
      }
      return res.clearCookie('jwt').redirect('/login');
    }
  });
};

export { requireAuth };
