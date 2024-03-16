import express, { Application, Request, Response,  } from "express";
import cors from 'cors';
import { userRoutes } from "./app/modules/user/user.routes";

const app: Application = express();


app.use(cors())
app.use(express.json())

app.get('/', (req: Request, res: Response)=> {
    res.send({
        message: "Sk health care is running"
    })
})

app.use('/api/v1/user', userRoutes)

export default app