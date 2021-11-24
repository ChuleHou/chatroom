import{ saveUserInfo, clearUserInfo,saveUserJoinedRooms,saveNoInfo,saveUserInRoom } from './user';
import{recall_message,log_out,get_user_info,check_ban,check_user_admin,loginUser,registerUser,getJoinedRoomsById,create_new_room,join_a_room,connect_a_room,leave_a_room,
    get_all_rooms,leave_all_rooms,ban_user} from '@/utils/api';

export const login = (username, password) => (dispatch) => {
    return new Promise((resolve,reject) => {
        loginUser({userName:username.trim(),password:password})
        .then(res => {
            console.log('login===',res)
            if(res.code === 0) {
                dispatch(saveUserInfo(JSON.parse(res.data)));
                resolve(res);
            } else {
                reject(res.msg);
            }
        })
    })
}

export const register = (username, password,age,school,interest) => (dispatch) => {
    return new Promise((resolve,reject) => {
        registerUser({userName:username.trim(),password:password,age:age,schoole:school,interests:interest})
        .then(res=>{
            console.log('signup===',res)
            if(res.code === 0) {
                dispatch(saveUserInfo(JSON.parse(res.data)));
                resolve(res);
            } else {
                reject(res.msg);
            }
        })
    })
}
export const logout = (username,roomname,reason) => (dispatch) => {
    console.log('logout')
    dispatch(clearUserInfo());
    window.location.href = '/login';
}
/*export const logout = (username,roomname,reason) => (dispatch) => {
    console.log('logout');

    /*log_out({userName:username,chatRoomName:roomname,reason:reason})
        .then(res=>{
            console.log('log out ===',res)
            if(res.code === 0) {
                dispatch(clearUserInfo());
                resolve(res);
            } else {
                reject(res.msg);
            }
        })
    dispatch(clearUserInfo());

    window.location.herf = '/login';

}*/

export const getJoinedRooms = (userName)=>(dispatch) => {
    return new Promise((resolve,reject) => {
        getJoinedRoomsById({userName:userName})
        .then(res=>{
            console.log('get joined rooms===',res)
            if(res.code === 0) {
                dispatch(saveNoInfo());
                resolve(res);
            } else {
                reject(res.msg);
            }
        })
    })
}
export const getRooms = ()=>(dispatch) => {
    return new Promise((resolve,reject) => {
        get_all_rooms()
        .then(res=>{
            console.log('get all rooms===',res)
            if(res.code === 0) {
                dispatch(saveNoInfo());
                resolve(res);
            } else {
                reject(res.msg);
            }
        })
    })
}
export const createNewRoom = (roomname,roomtype,roomsize,description,username)=>(dispatch) => {
    return new Promise((resolve,reject) => {
        create_new_room({chatRoomName:roomname,chatRoomType:roomtype,chatRoomSize:roomsize,chatRoomCategory:description,userName:username})
        .then(res=>{
            console.log('create a room ===',res)
            if(res.code === 0) {
                dispatch(saveNoInfo());
                resolve(res);
            } else {
                reject(res.msg);
            }
        })
    })
}

export const JoinARoom = (username,chatRoomName)=>(dispatch) => {
    return new Promise((resolve,reject) => {
        join_a_room({userName:username,chatRoomName:chatRoomName})
        .then(res=>{
            console.log('join a room ===',res)
            if(res.code === 0) {
                dispatch(saveNoInfo());
                resolve(res);
            } else {
                reject(res.msg);
            }
        })
    })
}

export const GetRoomUser=(username,chatRoomName) => (dispatch)=> {
    return new Promise((resolve,reject) => {
        connect_a_room({roomName:chatRoomName,userName:username})
        .then(res=>{
            console.log('connect a room ===',res)
            if(res.code === 0) {
                dispatch(saveUserInRoom(JSON.parse(res.data)));
                resolve(res);
            } else {
                reject(res.msg);
            }
        })
    })
}

export const LeaveRoom=(username,chatRoomName,reason) => (dispatch)=> {
    return new Promise((resolve,reject) => {
        leave_a_room({userName:username,chatRoomName:chatRoomName,reason:reason})
        .then(res=>{
            console.log('leave a room ===',res)
            if(res.code === 0) {
                dispatch(saveNoInfo());
                resolve(res);
            } else {
                reject(res.msg);
            }
        })
    })
}

export const LeaveAllRooms=(username) => (dispatch)=> {
    return new Promise((resolve,reject) => {
        leave_all_rooms({userName:username})
        .then(res=>{
            console.log('leave all rooms ===',res)
            if(res.code === 0) {
                dispatch(saveNoInfo());
                resolve(res);
            } else {
                reject(res.msg);
            }
        })
    })
}

export const CheckAdmin=(username,roomname) => (dispatch)=> {
    return new Promise((resolve,reject) => {
        check_user_admin({userName:username,roomName:roomname})
        .then(res=>{
            console.log('check admin ===',res)
            if(res.code === 0) {
                dispatch(saveNoInfo());
                resolve(res);
            } else {
                reject(res.msg);
            }
        })
    })
}

export const banUser=(username,roomname) => (dispatch)=> {
    return new Promise((resolve,reject) => {
        ban_user({userName:username,roomName:roomname})
        .then(res=>{
            console.log('ban user ===',res)
            if(res.code === 0) {
                dispatch(saveNoInfo());
                resolve(res);
            } else {
                reject(res.msg);
            }
        })
    })
}

export const checkBan=(username,roomname) => (dispatch)=> {
    return new Promise((resolve,reject) => {
        check_ban({userName:username,roomName:roomname})
        .then(res=>{
            console.log('user ban status ===',res)
            if(res.code === 0) {
                dispatch(saveNoInfo());
                resolve(res);
            } else {
                reject(res.msg);
            }
        })
    })
}
export const getUserInfo=(username) => (dispatch)=> {
    return new Promise((resolve,reject) => {
        get_user_info({userName:username})
        .then(res=>{
            console.log('user info ===',res)
            if(res.code === 0) {
                dispatch(saveNoInfo());
                resolve(res);
            } else {
                reject(res.msg);
            }
        })
    })
}

export const recallMessage=(name,mm,user) => (dispatch)=> {
    return new Promise((resolve,reject) => {
        recall_message({roomName:name,message:mm,userName:user})
        .then(res=>{
            console.log('recall message ===',res)
            if(res.code === 0) {
                dispatch(saveNoInfo());
                resolve(res);
            } else {
                reject(res.msg);
            }
        })
    })
}

