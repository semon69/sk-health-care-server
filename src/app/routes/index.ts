import express from 'express';
import { AdminRoutes } from '../modules/Admin/admin.routes';
import { UserRoutes } from '../modules/user/user.routes';
import { AuthRoutes } from '../modules/Auth/auth.routes';
import { SpecialitiesRoutes } from '../modules/Specialities/specialities.routes';

const router = express.Router();

const moduleRoutes = [
    {
        path: '/user',
        route: UserRoutes
    },
    {
        path: '/admin',
        route: AdminRoutes
    },
    {
        path: '/auth',
        route: AuthRoutes
    },
    {
        path: '/specialities',
        route: SpecialitiesRoutes
    }
]

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;