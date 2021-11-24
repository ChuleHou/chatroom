import network from './network';

export function loginUser(data) {
  return network({
    url: `/login`,
    method: "post",
    data
  })
}

export function registerUser(data) {
  return network({
    url: `/register`,
    method: "post",
    data
  })
}

export function resetPwd(data) {
  return network({
    url: `/resetPwd`,
    method: "post",
    data
  })
}


export function getJoinedRoomsById(data) {
  return network(
    {
      url: `/getAllChatroom`,
      method: "post",
      data
    }
  )
}

export function create_new_room(data) {
  return network(
    {
      url: `/createChatRoom`,
      method: "post",
      data
    }
  )
}

export function join_a_room(data) {
  return network(
    {
      url: `/addUser`,
      method: "post",
      data
    }
  )
}

export function connect_a_room(data) {
  return network(
    {
      url: `/getUserByRoomName`,
      method: "post",
      data
    }
  )
}
export function leave_a_room(data) {
  return network(
    {
      url: `/deleteUserFromRoom`,
      method: "post",
      data
    }
  )
}
export function get_all_rooms() {
  return network(
    {
      url: `/getAllPublicRoom`,
      method: "get",
    }
  )
}

export function leave_all_rooms(data) {
  return network(
    {
      url:`/deleteUserRoom`,
      method:"post",
      data
    }
  )
} 

export function check_user_admin(data) {
  return network(
    {
      url:`/checkAdmin`,
      method:"post",
      data
    }
  )
}

export function ban_user(data) {
  return network(
    {
      url:`/blockUser`,
      method:"post",
      data
    }
  )
}

export function check_ban(data) {
  return network(
    {
      url:`/checkBan`,
      method:"post",
      data
    }
  )
}

export function get_user_info(data) {
  return network(
    {
      url:`/getUserInfo`,
      method:"post",
      data
    }
  )
}

export function log_out(data) {
  return network(
    {
      url:`/logout`,
      method:"post",
      data
    }
  )
}

export function recall_message(data) {
  return network(
    {
      url:`/recallMessage`,
      method:"post",
      data
    }
  )
}

