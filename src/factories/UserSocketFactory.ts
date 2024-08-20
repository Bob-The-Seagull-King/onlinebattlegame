import { SocketHold } from "../classes/socket/SocketHold";
import { ServerHold } from "../classes/server/ServerHold";
import { UserHold, IUserConstruct } from "../classes/user/UserHold";

class UserSocketFactory {

    public static BuildUserAndSocket(socket : any, server : ServerHold) {

        const newsocket = new SocketHold(socket, server);
        const newuser = new UserHold({store : server.Users})

        server.NewSocket(newsocket);

        newsocket.AssignUser(newuser);
        newuser.AssignSocket(newsocket);
    }

}

export {UserSocketFactory}