### API doc



#### Class Message

`int messageID` : ID for messages.

`int roomId` : Chat Room ID for messages

`int senderId` : Sender ID for messages 

`List<Integer> rvcGroup` : Group of receiver ID  

`Date time` : Created Time

`String type` : Support type : text, images (emojis), and/or link

`String content` : Content of Message



#### Class ChatRoom

`int roomID` : ID for chat rooms

`String roomName`  : Name for chat rooms

`String type` : Public or Private

`List<String> category` : Tags for chat rooms. 

`List<User> admins` : admins 

`List<User> users` : users

`List<User> blockList` : blocked users



#### Class User

`int userID`  : ID for users

`String userName`  : User name

`int age ` : age

`String school` : school

`List<String> interests` : interests    

`List<ChatRoom> rooms` : char rooms  



#### Class ChatRoomService

`ChatRoom createChatRoom()` : create a chat room

`void addUser()` : add an user to a chat room  

`void setAdmin()` : set an user as admin

`void getMessages()` : get history messages in a chat room

`void blockUser()` : block an user in a chatroom



#### Class MessageService

`void sendMessage()` 

`void recallMessage()`

`void deleteMessage()`

`void editMesssage()`



#### Class UserService

`User login()`

`User signup()`

`void joinChatRoom()`

`void leaveChatRoom()`

`void inviteUser()`

