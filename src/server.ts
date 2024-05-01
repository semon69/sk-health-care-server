import { Server } from "http";
import app from "./app";
import config from "./app/config";

const port = config?.port;

async function main() {
    const server: Server = app.listen(port, () => {
        console.log("SK health care is listening on port", port);
      });

      process.on('uncaughtException', (error)=> {
        console.log(error);
        if(server){
          server.close(() => {
            console.info("Server closed")
          })
        }
        process.exit(1)
      })
      process.on('unhandledRejection', (error)=> {
        console.log(error);
        if(server){
          server.close(() => {
            console.info("Server closed")
          })
        }
        process.exit(1)
      })
}

main()