import * as React from 'react';
import {Popover,Button, Col, Collapse, Menu, Row,Modal, Input,Tooltip,Form,message,Select} from 'antd';
import DocumentTitle from 'react-document-title';
import {Link} from 'react-router-dom';
import logo from "@/assets/uu.jpg";
import '@/layout/home.less';
import MessageInput from '@/components/MessageInput';
import Message from '@/components/Message';
import { StopOutlined, CloseCircleOutlined, UserOutlined } from '@ant-design/icons';
import {connect} from 'react-redux';
import {logout,getUserInfo,checkBan,banUser,CheckAdmin,
    getJoinedRooms,createNewRoom,GetRoomUser, JoinARoom,LeaveRoom,
    getRooms,LeaveAllRooms,recallMessage} from '@/redux/actions';
import store from "@/redux";
import {validNumber} from "@/utils/valid"
import Emoticons from 'react-native-emoticons';
//import {logout} from "@/redux/actions"
//import io from 'socket.io-client'
//import { ServerResponse } from 'http';

const { Panel } = Collapse;

const room_type = [
    { label: 'public', value: 'PUBLIC' },
    { label: 'private', value: 'PRIVATE' }
  ];




class Home extends React.Component<any,any> {
    formRef = React.createRef();

    constructor(props: any) {
        super(props);
        this.state = {
            socket: 0,
            value_joined_rooms: 1,
            value_all_rooms: 1,
            in_which_room: 1,
            room_title: "",
            room_notification:"No Room connected. Please Join a Room",
            messages: [],

            isModalVisible: false,
            isModalInviteVisible: false,
            allRoomCardList: [],
            joinedRoomCardList: [],
            inviteUserCardList: [],
            user:'',
            webSocket:0,
            userAdmin:false,


            userName:'',
            userAge:'',
            userSchool:'',
            userInterest:''
        };
        

    }

    handleRecall=(value)=>{
        /*let mm=this.state.messages;
        mm.splice(mm.indexOf(value),1);
        this.setState({messages:mm});*/
        const {recallMessage} = this.props;
        recallMessage(this.state.room_title,value,this.state.user)
        .then((res:any)=>{
              message.success("recall message success");

        }).catch((error:any)=>{
            message.error(error);
        })

    }


      content =  () => {
          return (
              <div>
                <p>{`Name: ${this.state.userName}`}</p>
                <p>{`Age: ${this.state.userAge}`}</p>
                <p>{`School: ${this.state.userSchool}`}</p>
                <p>{`Interest: ${this.state.userInterest}`}</p>
                
              </div>
          );
      }

      getInfo=(item)=>{
          const {getUserInfo}=this.props;
          getUserInfo(item)
          .then((res:any)=>{
              if(res.code === 0) {
                let datas=JSON.parse(res.data);
                 this.setState({userName:datas.userName});
                 this.setState({userAge:datas.age});
                 this.setState({userSchool:datas.school});
                 this.setState({userInterest:eval(datas.interest)});

              }
          }).catch((error:any)=>{
              message.error(error);
          })
          
      }

    componentWillMount() {
        let name=JSON.parse((store.getState() as any).user.data.userData).userName;
        console.log("get all joined rooms ===",name);
        this.setState({user:name});
        this.SocketChatRoom();
        this.InitiateChatRoom();
        this.getInfo(name);
    }
     setUpSession=(webSocket:any) => {
        let userName = JSON.parse((store.getState() as any).user.data.userData).userName;
        //console.log("!!!!!!!!!!!!!!!!!!!!!!!",userName)
        webSocket.onopen = () =>webSocket.send(JSON.stringify({messageType:"SetUpSession",userName:userName}));
            
    }

    setRoomTitle=(title) =>{
        this.setState({room_title:title})
    }
    setRoomNotification=(title) =>{
        if(title!=="")
            this.setState({room_notification:title})
        else
            this.setState({room_notification:"No Room connected. Please Join a Room"})

    }
    

    SocketChatRoom=()=> {
        const webSocket = new WebSocket('wss://unicorn-server.herokuapp.com/chatapp?userId=1');
        //const webSocket = new WebSocket('ws://localhost:4567/chatapp?userId=1');
        
        this.setState({webSocket:webSocket});
        this.setUpSession(webSocket);
        webSocket.onmessage = (msg) =>{this.handleMessageFromServer(msg);}//{console.log("msg from server===== ",msg);}//{this.store_messages(JSON.parse(msg.data))};//this.store_messages( JSON.parse(msg.data).userName + " leave the room");
        
    }

    handleMessageFromServer=(msg)=>{
        console.log(msg.timeStamp)
        const { topic, chatroom, sender,  messageType } = JSON.parse(msg.data)
        const mm=JSON.parse(msg.data).message
        console.log("msg from server===== ",msg);
        if (messageType === 'text') {
            if (topic === "NormalMessage")//sendmessage
            {
                if (this.state.room_title === chatroom)
                    this.store_messages(sender + " says: " + mm);
            } 
            else if (topic === "SpecificMessage") //connectroom
            {
                if (this.state.room_title === chatroom)
                    this.store_messages(sender + " says to you: " + mm);
                else
                    message.success(sender + " says to you in room " + chatroom +" that: "+mm);
            }else if (topic === "ConnectRoom") //connectroom
            {
                if (this.state.room_title === chatroom)
                    this.store_messages(sender + " connects room: " + chatroom);
            } else if(topic === "LeaveRoom")
            {
                if(this.state.user === sender)
                {
                    let ir=this.state.joinedRoomCardList;
                    let index = ir.indexOf(chatroom);
                    if (index > -1) {
                        ir.splice(index, 1);
                    }
                    this.setRoomTitle(""); 
                    this.setRoomNotification("");
                    this.setState({joinedRoomCardList:ir,inviteUserCardList:[],messages:[]});
                }
                else if (this.state.room_title === chatroom)
                {
                    this.store_messages(sender + " leaves room " + chatroom+". "+ mm);
                    let ir=this.state.inviteUserCardList;
                    let index = ir.indexOf(sender);
                    if (index > -1) {
                        ir.splice(index, 1);
                    }
                    this.setState({inviteUserCardList:ir});
                }  
                  
            
            
            } else if(topic=="CreateRoom")
            {
                //this.store_messages(`${sender} ${message}`);
                message.success(`${sender} ${mm}`);
                //if (this.state.user !== sender) {
                    let ar = this.state.allRoomCardList;
                    ar.push(chatroom);
                    this.setState({ allRoomCardList: ar });
                //}
            } else if(topic === "JoinRoom")
            {
                //if (this.state.room_title === chatroom)
                  //  this.store_messages(sender + " leaves " + chatroom+","+ mm);
                //happen in invite;
                  if((this.state.user === sender)&&(this.state.joinedRoomCardList.findIndex(e=>e===chatroom) === -1)){
                    let jr=this.state.joinedRoomCardList;
                    jr.push(chatroom);
                    this.setState({joinedRoomCardList:jr});
                }

                //user in the room
                if(this.state.room_title === chatroom)
                {
                    let ic=this.state.inviteUserCardList;
                    ic.push(sender);
                    this.setState({
                        inviteUserCardList: ic
                    })
                }
            } else if (topic === 'RecallMessage') {

                if (this.state.room_title === chatroom) {
                    let value = this.state.messages;
                    value.splice(value.indexOf(mm), 1);
                    value.push(`${sender} recalled a message`);
                    this.setState({ messages: value });

                    
                }

            }
        }
    }
    handleBan=(e,item)=>{
        e.disabled=true;
        const{banUser} =this.props;
        banUser(item,this.state.room_title)
        .then((res:any)=>{
            if(res.code === 0) {
                message.success('ban user success');
            }
        }).catch((error:any)=>{
            message.error(error);
        })


        
    }

    InitiateChatRoom=()=> {
        const {getJoinedRooms,getRooms} = this.props;
        let name=JSON.parse((store.getState() as any).user.data.userData).userName;
        console.log("get all joined rooms ===",name);

        this.setState({user:name});
        getJoinedRooms(name)
        .then((res:any)=>{
            if(res.code === 0) {
                message.success('init joined rooms success');
                let arr=eval(res.data);
                if(arr!==""){

               /* if (res.data !== "[]") {
                    let str = res.data;
                    let len = str.length;
                    str = str.substr(1, len - 2);
                    let arr = eval(str);*/

                    this.setState({ joinedRoomCardList: arr });
                }

            }
        })
        .catch((error:any)=>{
            message.error(error);
        })

        getRooms()
        .then((res:any)=>{
            if(res.code === 0) {
                message.success('init all rooms success');
                let arr=eval(res.data);
                if(arr!==""){
                    this.setState({ allRoomCardList: arr })
                }

            }
        })
        .catch((error:any)=>{
            message.error(error);
        })





    }

    handleJoinRoom = (item)=>{
        const {JoinARoom}=this.props;

        let dataJoinedRooms = this.state.joinedRoomCardList;

        const found= dataJoinedRooms.findIndex(element => element=== item);
        if(found === -1)
        {
            dataJoinedRooms.push(item);
            JoinARoom(this.state.user,item)
            .then((res:any)=>{
                if(res.code === 0) {
                    message.success('Join a room success');
                    // TODO: unknown format
                   //need users
                }
            })
            .catch((error:any)=>{
                message.error(error);
            })
        } else{
            message.error("currenly in the room");
        }
        this.setState({
            joinedRoomCardList: dataJoinedRooms
        })

        

    }


    handleNewRoomOk = () => {
        const {createNewRoom} = this.props;

        let infoNewRoom=this.formRef.current.getFieldsValue();
        console.log(infoNewRoom.newchatroomType);        
        if(!validNumber(infoNewRoom.newchatroomSize)) {
            message.error('the size should be a number');
            return false;
        }
        let datajoinedRooms = this.state.joinedRoomCardList;
        createNewRoom(infoNewRoom.newchatroomName,infoNewRoom.newchatroomType,
            infoNewRoom.newchatroomSize,infoNewRoom.newchatroomDescription,this.state.user)
        .then((res:any)=>{
            if(res.code === 0) {
                message.success('create a room success');
                console.log("create a room success")
                datajoinedRooms.push(infoNewRoom.newchatroomName);
                this.setState({joinedRoomCardList: datajoinedRooms
                })
            }
        })
        .catch((error:any)=>{
            message.error(error);
        })


        
        
        this.setState({
            isModalVisible: false,
            joinedRoomCardList: datajoinedRooms
        })
        this.formRef.current.resetFields()
    }
    handleSendMessage=(value,user)=>{
        if(this.state.room_title !==""){
        const {checkBan}=this.props;

        checkBan(this.state.user,this.state.room_title)
        .then((res:any)=>
        {
            if(res.code===0)
            {
                if(res.data === "false")
                    this.send_messages_to_server({msg:value,user:user})
                else
                    message.error('you have been blocked by admin')

            }
                
        }).catch((error:any)=>{
                message.error(error);
        })

    } else {
        message.error("connect a room before sending.");
    }
    }
    handleNewRoomCancel = () => {
        this.setState({
            isModalVisible: false
        })
        this.formRef.current.resetFields()
    }
    addNewRoom = () => {
        this.setState({
            isModalVisible: true
        })
    }
    deleteJoinedRoom = (item) => {
        const {LeaveRoom} = this.props;
        let dataJoinedRooms = this.state.joinedRoomCardList;
        const found= dataJoinedRooms.findIndex(element => element === item);
        if(found !== -1)
        {
            dataJoinedRooms.splice(found, 1);
            this.setRoomTitle("");
            this.setState({joinedRoomCardList:dataJoinedRooms,inviteUserCardList:[],messages:[]});
            this.setRoomNotification("");

            LeaveRoom(this.state.user, item,"user chooses to LEAVE.")
            .then((res:any)=>
            {
                if(res.code===0)
                    message.success("leave a room success");
            }).catch((error:any)=>{
                    message.error(error);
            })
        }
        this.setState({
            joinedRoomCardList: dataJoinedRooms
        })
        //this.setState({messages:[],inviteUserCardList:[], room_title: "" });
        



    }

    deleteAllRoom = () => {
        /*const{LeaveAllRooms} = this.props;

        LeaveAllRooms(this.state.user)
        .then((res:any)=>
        {
            if(res.code===0)
                message.success("leave all room success");
        }).catch((error:any)=>{
                message.error(error);
        })

        let joinedRoomCardList=this.state.joinedRoomCardList;
        joinedRoomCardList=[];

        let usersInRoom=this.state.inviteUserCardList;
        let messages=this.state.messages;
        usersInRoom=[];
        messages=[];

        this.setState({joinedRoomCardList:joinedRoomCardList,inviteUserCardList:usersInRoom,
        messages:messages})

        this.setRoomTitle("");
        this.setRoomNotification("");*/
        let inroom=JSON.parse(JSON.stringify(this.state.joinedRoomCardList));
        inroom.forEach(e => {
            this.deleteJoinedRoom(e);
        });

    }

    handleNewUserOk = () => {
        //let datainviteUsers = this.state.inviteUserCardList;
        //datainviteUsers.push(this.formRef.current.getFieldsValue().inviteName)
        const {JoinARoom}=this.props;
        let iname=this.formRef.current.getFieldsValue().inviteName;
        
        JoinARoom(iname,this.state.room_title)
            .then((res:any)=>{
                if(res.code === 0) {
                    message.success('Invite user success');
                    
                    this.formRef.current.resetFields();
                }
            })
            .catch((error:any)=>{
                message.error(error);
            })
        
        this.setState({
            isModalInviteVisible: false,
        })
    }
    handleNewUserCancel = () => {
        this.setState({
            isModalInviteVisible: false
        })
        this.formRef.current.resetFields()
    }
    
    addNewUser = () => {
        const { CheckAdmin } = this.props;
        if (this.state.room_title === "") {
            message.error("you have to CONNECT a room at first!");
        } else {
            CheckAdmin(this.state.user, this.state.room_title)
                .then((res: any) => {
                    if (res.code === 0)
                    {
                        if (res.data === 'true') {
                            this.setState({
                                isModalInviteVisible: true
                            })
                        } else 
                            message.error("you are not this room's admin");
                    }   
                }).catch((error: any) => {
                    message.error(error);
                })
            
        }
    }
    deleteUser = (item) => {
        /*let datainviteUsers = this.state.inviteUserCardList;
        datainviteUsers.splice(id, 1);
        this.setState({
            inviteUserCardList: datainviteUsers
        })*/
        if (item === this.state.user)
            message.error("you can't remove yourself.");
        else {
            const { LeaveRoom } = this.props;
            LeaveRoom(item, this.state.room_title, "deleted by admin")
                .then((res: any) => {
                    if (res.code === 0)
                        message.success(`delete user ${item} success`);
                }).catch((error: any) => {
                    message.error(error);
                })
        }
    }

    
    
    handleConnect = (name) => {
        const { GetRoomUser } = this.props;
        if (this.state.room_title === name) {
            message.error("current connected.")
        } else {
            if(this.state.room_title !== '')
            {
                //this.deleteJoinedRoom(this.state.room_title);
                this.setState({messages:[],inviteUserCardList:[]});
                this.setRoomNotification("");
            }
            this.setRoomTitle(name);
            this.setRoomNotification("      Welcome");
            //TODO
            GetRoomUser(this.state.user, name)
                .then((res: any) => {
                    if (res.code === 0) {
                        message.success('focus a room success');
                        //res need to store users
                        console.log("rooms users data ===============", res.data);
                        let str = res.data;
                        let len = str.length;
                        str = str.substr(1, len - 2);
                        let arr = str.split(",");
                        let il = this.state.inviteUserCardList;


                        arr.forEach(a => {
                            a = a.replace("\"", "");
                            a = a.replace("\"", "");
                            il.push(a);
                        });
                        this.setState({ inviteUserCardList: il })
                        let truth="";
                        console.log("room type===",res.roomType)
                        console.log("user admin?===",res.admin)

                        if(res.admin === "true")
                        {
                            truth = "You ARE an admin";
                            this.setState({ userAdmin: true });
                        }
                        else{
                            truth="You are NOT an admin";
                            this.setState({ userAdmin: false });

                        } 
                        this.setRoomNotification(`     Welcome! It's a ${res.roomType} room. ${truth}`)

                    }
                })
                .catch((error: any) => {
                    message.error(error);
                })
        }
    }
    
    
    store_messages = (value)=> {
        let arr = this.state.messages;
        //console.log(arr);
        
        arr.push(value);
        this.setState({messages:arr});
    }

    send_messages_to_server = (value) =>{
        let targetChatRoomName = this.state.room_title;
        if(targetChatRoomName === "")
        {
            message.error('plz connect a room at first');
        }
        else{

        this.state.webSocket.send(JSON.stringify({messageType:"TextMessage",chatRoomName:targetChatRoomName,type:"text",content:value}));
        //this.store_messages(value);
            message.success('your message has been received by others.');
        }
    }


    onChange_AllRooms = (e) => {
        console.log('radio checked', e.target.value);
        this.setState({
            value_all_rooms: e.target.value,
        });
    };

    handle_logout = ()=>{
        const{logout}=this.props;
        logout(this.state.user,this.state.room_title,"user LogOut");
        /*.then((res:any)=>{
            store.dispatch(res)
            message.success("log out success")
        }
        ).catch((error:any)=>{
            message.error(error);

        })*/
        //store.dispatch(logout(this.state.user,this.state.room_title,"user LogOut"));
    }



    render() {
        const { value_joined_rooms,value_all_rooms} = this.state;
        const { allRoomCardList, joinedRoomCardList, inviteUserCardList } = this.state;
        const layout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };

        return ( 
        <DocumentTitle title={'Unicorn'}>
            <div className="home-container">
                <div className="pageHeader">
                    <Menu key="1" mode="horizontal" className="home-menu">
                        <Menu.Item>
                            <img src={ logo } alt="logo"/>
                                <span>{`Welcome, ${this.state.user}`}</span>
                        </Menu.Item>
                        <Menu.Item><Popover content={this.content}>
                            <Button>Profile</Button >
                            </Popover></Menu.Item>
                        <Menu.Item><Button onClick={()=>{this.handle_logout()}}>Log Out</Button></Menu.Item>
                    </Menu>
                </div>
                <div className="home-box">
                    <Row>
                        <Col className="chatroom-list">
                            <div className="chatroom-joined">
                                <Collapse className="collapse-chatroom-joined"
                                          bordered={false}
                                          defaultActiveKey={['1']}
                                >
                                    <Panel header="Joined Rooms" key="1" className="site-collapse-custom-panel">
                                        {
                                            joinedRoomCardList?.length ?
                                                <div className="site-card-border-less-wrapper">
                                                    {
                                                        joinedRoomCardList?.map((item, id) => (
                                                            <div key={id} style={{marginTop:'5px'}}>
                                                                <Row>
                                                                    <Col>
                                                                        <div style={{border: '1px solid #ccc', backgroundColor: '#fefefe', width:'125px', height:'30px', textAlign:'center'}}>{item}</div>
                                                                    </Col>
                                                                    <Col>
                                                                        <Button type="primary" onClick= {()=>{this.handleConnect(item)}} danger style={{height: '30px', marginLeft:'5px'} }>Connect</Button>
                                                                    </Col>
                                                                    <Col>
                                                                        <Button type="primary" danger onClick={() => this.deleteJoinedRoom(item)} style={{height: '30px', marginLeft:'5px'}}>Leave</Button>
                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                        ))
                                                    }
                                                    <Button onClick={ this.deleteAllRoom } style={{width:'290px', marginTop:'5px'}}>Leave All</Button>
                                                </div>
                                                :
                                                null
                                        }
                                    </Panel>
                                </Collapse>
                            </div>
                            <div className="chatroom-all-rooms">
                                <Collapse className="collapse-chatroom-all"
                                          bordered={false}
                                          defaultActiveKey={['1']}
                                >
                                    <Panel header="All Public Rooms" key="1" className="panel-chatroom-all">
                                        <Button onClick={this.addNewRoom} style={{width:'290px'}}>Create New Room</Button>
                                        <Modal title="Create New Room" visible={this.state.isModalVisible} onOk={this.handleNewRoomOk} onCancel={this.handleNewRoomCancel}>

                                            <Form {...layout} ref={this.formRef} name="control-ref">
                                                <Form.Item name="newchatroomName" label="ChatRoom Name">
                                                    <Input />
                                                </Form.Item>
                                                <Form.Item name="newchatroomType" label="ChatRoom Type">
                                                    <Select options={room_type}  style={{ width: 120 }} />
                                                </Form.Item>
                                                <Form.Item name="newchatroomSize" label="ChatRoom Size">
                                                    <Input />
                                                </Form.Item>
                                                <Form.Item name="newchatroomDescription" label="ChatRoom Description">
                                                    <Input />
                                                </Form.Item>
                                            </Form>
                                            <label>* you will be set as an admin automatically.</label>
                                            
                                        </Modal>
                                        {
                                            allRoomCardList?.length ?
                                                <div className="site-card-border-less-wrapper">
                                                    {
                                                        allRoomCardList?.map((item, id) => (
                                                            <div key={id} style={{marginTop:'5px'}}>
                                                                <Row>
                                                                    <Col>
                                                                        <div style={{border: '1px solid #ccc', backgroundColor: '#fefefe', width:'215px', height:'30px', textAlign:'center'}}>{item}</div>
                                                                    </Col>
                                                                    <Col>
                                                                        <Button type="primary" danger onClick={() => this.handleJoinRoom(item)} style={{height: '30px', marginLeft:'5px'}}>Join</Button>
                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                                :
                                                null
                                        }
                                    </Panel>
                                </Collapse>
                            </div>
                            <div className="chatroom-all-users">
                                <Collapse className="collapse-chatroom-all"
                                          bordered={false}
                                          defaultActiveKey={['1']}
                                >
                                    <Panel header="All Users In Connected Room" key="1" className="panel-chatroom-all">
                                    { this.state.userAdmin === true &&
                                        <Button className="panel-chatroom-invite-button" style={{width:'290px'}} onClick={this.addNewUser}>Invite</Button>
                                    }
                                        <Modal title="Invite User" visible={this.state.isModalInviteVisible} onOk={this.handleNewUserOk} onCancel={this.handleNewUserCancel}>
                                        <Form {...layout} ref={this.formRef} name="control-ref">
                                            <Form.Item
                                                name="inviteName"
                                                label="UserName"
                                            >
                                                <Input placeholder="User1,User2..." />
                                            </Form.Item>
                                        </Form>
                                        </Modal>
                                        {
                                            inviteUserCardList?.length ?
                                                <div className="site-card-border-less-wrapper">
                                                    {
                                                        inviteUserCardList?.map((item, id) => (
                                                            <Row>
                                                                <Col>
                                                                    <div style={{border: '1px solid #ccc', backgroundColor: '#fefefe', width:'120px', height:'30px', textAlign:'center',marginTop:'5px'}}>{item}</div>
                                                                </Col>

                                                                { this.state.userAdmin === true && this.state.user!==item &&
                                                                <Col>
                                                                    <Tooltip title="Delete" >
                                                                        <Button type="primary" shape="circle"  onClick={() => this.deleteUser(item)} style={{marginLeft:'20px'}} icon={<CloseCircleOutlined />} />
                                                                    </Tooltip>
                                                                </Col>
                                                                }
                                                                {this.state.userAdmin === true && this.state.user!==item &&

                                                                    <Col>
                                                                        <Tooltip title="Ban" >
                                                                            <Button type="primary" shape="circle" onClick={(e) =>this.handleBan(e,item)} style={{ marginLeft: '20px' }} icon={<StopOutlined />} />
                                                                        </Tooltip>
                                                                    </Col>
                                                                }
                                                                {this.state.userAdmin === true && this.state.user!==item &&

                                                                    <Col>
                                                                        <Popover content="hi~">
                                                                            <Button type="primary" shape="circle" style={{ marginLeft: '20px' }} icon={<UserOutlined />} />
                                                                        </Popover>
                                                                    </Col>
                                                                }
                                                            </Row>
                                                        ))
                                                    }
                                                </div>
                                                :
                                                null
                                        }
                                    </Panel>
                                </Collapse>
                            </div>
                            

                        </Col>
                        <Col className="chatroom-area">
                            <div className="chatroom-area-notification-error">
                                <h1 className="chatroom-area-notification-error">{this.state.room_title}</h1>
                                <h5 className="chatroom-area-notification-error">{this.state.room_notification}</h5>
                            </div>
                            <Message messages={this.state.messages} user={this.state.user} recall={this.handleRecall}/>
                            <MessageInput UserList={this.state.inviteUserCardList}socket={this.handleSendMessage} />
                        </Col>
                    </Row>

                </div>
            </div>
        </DocumentTitle>
        )
        
        
    }
}
export default connect((state: any) => state.user, {recallMessage,logout,getUserInfo,checkBan, banUser,CheckAdmin,LeaveAllRooms,LeaveRoom,JoinARoom,getRooms,getJoinedRooms,createNewRoom,GetRoomUser })(Home)

//export default Home;//