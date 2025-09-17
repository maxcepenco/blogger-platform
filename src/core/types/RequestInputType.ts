


import {Request} from "express";
import {IdType} from "./id-type.user";

export type RequestWithBody<T> = Request<{},{}, T>
export type RequestWithParams<T> = Request<T>
export type RequestWithParamsAndBody<T,B> = Request<T,{},B>
export type RequestWithQuery<T> = Request<{},{},{},T>
export type RequestWithParamsAndQuery<T,B> = Request<T,{},{},B>
export type RequestWithUserId<U extends IdType> = Request<{},{},{},{}, U>
export type ReqParamsBodyUserId<P,B,U extends IdType> = Request<P,{},B,{}, U >
export type ReqParamsUserId<P,U extends IdType> = Request<P,{},{},{}, U >
