import React, { useEffect, useState } from 'react';
import '@/layout/home.less';
import {Button,Tooltip,Row,Modal} from 'antd';


//const NewMessage = ({socket}) => {
const Messages=({messages,user,recall})=> {
  const[isModalVisible,setIsModalVisible]=useState(false);
  const[value,setValue]=useState('');

  useEffect(()=>{
    messages?.map((item)=>{
      console.log("serch res===",item.search("says"));
      let name=item.substr(0,item.search("says")-1)
      console.log("who says===",name);
      console.log("user is ===",user);
      console.log("user vs who ===",user===name);

    })
    //console.log()
  })

  const handleonClick=(e)=>{
    //console.log("messages==", e.currentTarget.value);
    setValue(e.currentTarget.value);
    setIsModalVisible(true);
  }

  const handleRecallOk=()=>{
    recall(value);
    setIsModalVisible(false);

  }
  const handleRecallCancel=()=>{
    setIsModalVisible(false);
  }

  return (
    <div className="chatroom-area-chatbox-container">
      <div className="chatroom-area-chatbox">
      {
          messages.map((item) => {
            return (<ul>
              {
                item.search("says")!==-1  ? (
                  user === item.substr(0,item.search("says")-1) ? (
                    <Row type="flex" justify="end">
                  <Tooltip placement="topLeft" title="Click to Recall" >
                    <Button value={item} onClick={e => handleonClick(e)}>{item}</Button>
                  </Tooltip></Row>
                  ):(<Tooltip placement="topLeft" >
                    <Button>{item}</Button>
                  </Tooltip>)
                  )
                
                :(
                  <Row type="flex" justify="center">
                    <Tooltip placement="topLeft" >
                    <label>{item}</label>
                    </Tooltip>
                    </Row>
                )
              } 

              <Modal title="Recall Message" visible={isModalVisible} onOk={handleRecallOk} onCancel={handleRecallCancel}>
                <label>Sure to recall?</label>
              </Modal>
              </ul>
            )
          })

        }
      </div>
    </div>

  );
}

export default Messages;