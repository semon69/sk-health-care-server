import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";
import httpStatus from "http-status";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import cookieParser from "cookie-parser"

const app: Application = express();

app.use(cors());

// parser 
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(co)

app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "Sk health care is running",
  });
});

app.use("/api/v1", router);

app.use(globalErrorHandler);

app.use((req:Request, res: Response, next:NextFunction)=> {
    res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: 'API not found',
        error: {
            path: req.originalUrl,
            message: 'Your request path is not found'
        }
    })
})

export default app;
