import userRoutes from "./user.route.js";
import messageRoutes from "./message.route.js";

const routers = (app) => {
    app.use("api/user", userRoutes);
    app.use("api/message", messageRoutes);

}
export default routers;