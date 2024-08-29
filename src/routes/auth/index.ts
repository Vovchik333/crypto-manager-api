import { userRepository } from "@routes/user";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthRoute } from "./auth.route";

const authService = new AuthService(userRepository);
const authController = new AuthController(authService);
const authRoute = new AuthRoute(authController);

export { authService, authController, authRoute };
export { AuthService, AuthController, AuthRoute };
