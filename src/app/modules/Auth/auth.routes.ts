import express from 'express'
import { AuthController } from './auth.controllers'

const router = express.Router()


router.post('/login', AuthController.loginUser)

export const AuthRoutes = router