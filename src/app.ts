import express, { Application, Request, Response,  } from "express";
import cors from 'cors';
import { userRoutes } from "./app/modules/user/user.routes";
import { AdminRoutes } from "./app/modules/Admin/admin.routes";

const app: Application = express();


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/', (req: Request, res: Response)=> {
    res.send({
        message: "Sk health care is running"
    })
})

app.use('/api/v1/user', userRoutes)
app.use('/api/v1/admin', AdminRoutes)

export default app