import type { Request } from 'express';
import { Document, Schema, model, Model } from 'mongoose';

const requestLogSchema = new Schema(
  {
    message: String,
    error: Object,
    request: {
      type: Object,
      required: true,
      set: (v: any) => {
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
