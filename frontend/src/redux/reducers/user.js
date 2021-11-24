import * as types from '../actionTypes'

const initUserInfo = {
    data : {},
    isLogined: false
}

export default function user(state = initUserInfo, action) {
    switch(action.type) {
        case types.SET_USER_INFO :
            return {
                ...state,
                data:action.data,
                isLogined : true
            };
        case types.MODIFY_USER_INFO:
            return {
                ...state,
                data : Object.assign(state.data,action.data)
            };
        case types.CLEAR_USER_INFO:
            return {
                data :{},
                isLogined: false
            };
        case types.GET_JOINED_ROOMS:
            return {
                ...state,
                data:action.data
            }
        case types.DO_NOTHING:
            return{
                ...state
            }
        case types.GET_USERS_IN_ROOM:
                return{
                    ...state,
                    data:action.data
                }
        
        default:
            return state;
    }
}