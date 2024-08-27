import { SocketHold } from "../classes/structure/socket/SocketHold";
import { ServerHold } from "../classes/structure/server/ServerHold";
import { UserHold } from "../classes/structure/user/UserHold";
import { UserStore } from "../classes/structure/user/UserStore";

class UserSocketFactory {

    /**
     * Create a User and Socket object in response to a
     * socket connecting to the Server.
     * @param socket the newly connected socket
     * @param server the server hosting the socket
     * @param userstore the store holding user objects
     */
    public static BuildUserAndSocket(socket : any, server : ServerHold, userstore : UserStore) {

        const newsocket = new SocketHold(socket, server);
        const newuser = new UserHold({store : server.Users})

        server.NewSocket(newsocket);
        userstore.AddUser(newuser)

        newsocket.AssignUser(newuser);
        newuser.AssignSocket(newsocket);
    }

}

export {UserSocketFactory}