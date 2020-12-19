import type { Request } from 'express';
import { Document, Schema, model, Model } from 'mongoose';

const requestLogSchema = new Schema(
  {
    message: String,
    error: Object,
    request: {
      type: Object,
      required: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      set: (v: any) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { res, client, socket, ...rest } = v;
        return rest;
      }
    }
  },
  { timestamps: true }
);

export interface RequestLog {
  message?: string;
  error?: Error;
  request: Request;
}

export interface RequestLogDocument extends RequestLog, Document {}
export type RequestLogModel = Model<RequestLogDocument>;

export default model<RequestLogDocument, RequestLogModel>('RequestLog', requestLogSchema);
