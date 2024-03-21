import express from 'express';
import { AdminRoutes } from '../modules/Admin/admin.routes';
import { UserRoutes } from '../modules/user/user.routes';

const router = express.Router();

const moduleRoutes = [
    {
        path: '/user',
        route: UserRoutes
    },
    {
        path: '/admin',
        route: AdminRoutes
    }
]

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;