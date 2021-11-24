package edu.rice.comp504.User;

import org.eclipse.jetty.websocket.api.Session;

import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Stores chap app user information.
 */
public class UserDB {
    // When user connect through socket session, add it to sessionUserMap,

    // all user that is currently connect to server socket
    private static final Map<Session, User> sessionUserMap =  new ConcurrentHashMap<>();
    // locate current connected user Session using userid
    private static final Map<Integer, Session> userIdSessionMap = new ConcurrentHashMap<>();

    // All registered user
    private static final Map<Integer, User> userIdUserMap = new ConcurrentHashMap<>();


    private static int nextUserId = 1;

    /**
     * Constructor.
     */
    public UserDB() {
    }

    /**
     * Get the session to username map.
     * @return The session to username map
     */
    public static Map<Session,User> getSessionUserMap() {
        return sessionUserMap;
    }

    /**
     * Generate the next user id.
     * @return The next user id
     */
    public static int genNextUserId() {
        return nextUserId++;
    }


    public static User addUserWithSession(Session userSession, User user)
    {
        sessionUserMap.put(userSession, user);
        userIdSessionMap.put(user.getUserID(), userSession);
        userIdUserMap.put(user.getUserID(), user);
        return user;
    }

    public static User addUserWithOutSession(User user)
    {
        checkSession();
        userIdUserMap.put(user.getUserID(), user);
        System.out.println("addUserWithOutSession");
        checkSession();
        return user;
    }

    /**
     * Add a session user.
     * @param session The session.
     * @param user The user.
     */
    public static void addSessionUser(Session session, User user) {
        sessionUserMap.put(session, user);
    }

    /**
     * Get the user.
     * @param session The session.
     * @return The username
     */
    public static User getUserFromSession(Session session) {
        return sessionUserMap.get(session);
    }

    //++++++++++//
    public static Session getSessionFromUserId(int userId) {
        return userIdSessionMap.get(userId);
    }

    public static User getUserFromUserId(int userId) {
        return userIdUserMap.get(userId);
    }

    public static int getUserIdFromUserName(String userName)
    {
        for(Integer userId : userIdUserMap.keySet())
        {
            User targetUser = userIdUserMap.get(userId);
            if(Objects.equals(targetUser.getUserName(), userName))
            {
                return targetUser.getUserID();
            }
        }
        return -1;
    }

    /**
     * Remove user.
     * @param session The session.
     */
    public static void removeUser(Session session) {

        sessionUserMap.remove(session);
        User targetUser = sessionUserMap.get(session);
        userIdSessionMap.remove(targetUser.getUserID());

    }

    public static void removeUserById(int userId)
    {
        Session userSession = userIdSessionMap.get(userId);
        userIdUserMap.remove(userId);
        sessionUserMap.remove(userSession);
    }



    /**
     * Get open sessions.
     * @return All open sessions
     */
    public static Set<Session> getSessions() {
        return sessionUserMap.keySet();
    }

    public static void checkSession()
    {
        System.out.println("Current User Id Session:");
        for (User users: sessionUserMap.values()) {
            System.out.println(users.getUserID());
        }
    }

    // get user Id using username
    public static int userNameToUserId(String username)
    {
        for (User user:userIdUserMap.values()) {
            if(Objects.equals(user.getUserName(), username))
            {
                return user.getUserID();
            }
        }

        return -1;
    }

}
