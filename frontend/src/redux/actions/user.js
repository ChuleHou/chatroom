import * as types from '../actionTypes'

export const saveUserInfo = (data)=> {
    return {
        type: types.SET_USER_INFO,
        data
    }
}

export const clearUserInfo = () => {
    return {
        type: types.CLEAR_USER_INFO
    }
}

export const saveUserJoinedRooms = (data) => {
    return {
        type : types.GET_JOINED_ROOMS,
        data
    }
}

export const saveNoInfo = () => {
    return {
        type: types.DO_NOTHING
    }
}

export const saveUserInRoom =(data)=> {
    return{
        type : types.GET_USERS_IN_ROOM,
        data
    }
}




