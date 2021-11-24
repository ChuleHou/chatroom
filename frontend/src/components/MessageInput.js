import React, { useState } from 'react';
import '@/layout/home.less';
import {Button,Select} from 'antd';

const { Option } = Select;

const emojiOptions = [
    {
        label:"😊",
        value:"😊",
    },
    {
        label:'😭',
        value:'😭',
    },
    {
        label:'🤩',
        value:'🤩',
    },
    {
        label:'😅',
        value:'😅'
    },
    {
        label:'😉',
        value:'😉'
    },
    {
        label:'😍',
        value:'😍'
    },
    {
        label:'😕',
        value:'😕'
    },
    {
        label:'🤓',
        value:'🤓'
    },

];

function onBlur() {
    console.log('blur');
}

function onFocus() {
    console.log('focus');
}

function onSearch(val) {
    console.log('search:', val);
}

const NewMessage = ({UserList,socket}) => {
  
  const [value, setValue] = useState('');
  const [user, setUser] = useState('all');
 
  const submitForm = (e) => {
    e.preventDefault();
    socket(value,user);
    setValue('');
  }
  const onChange = (e) =>{
    console.log("select value===",e);
    setUser(e);
  }
  const handleEmojiChange=(e)=>{
    let m=value;
    m=m+e;
    setValue(m);
  }

  
  return (  
    <div className="chatroom-area-send-container">
      <div className="chatroom-area-send-user">
        <span><b>Send to:</b></span>
        <Select
            showSearch
            style={{ width: 150 }}
            placeholder="Select a person"
            optionFilterProp="children"
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            onSearch={onSearch}
            filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
        >
            <Option value="all">All Users</Option>
            {
              UserList?.map((item,index)=>{
                return (<Option value={item}>{item}</Option>  )
              })
            }
        </Select>
          <span><b>Emoji</b></span>
          <Select
              //value={emojiOptions}
              onChange={handleEmojiChange}
          >
              {
                  emojiOptions.map((option) => {
                    return( <option value={option.value}>{option.label}</option>)
                  })
              }
          </Select>

        <Button className="chatroom-area-send-button" type="primary" onClick={submitForm}>Send</Button>
      </div>
      <textarea className="chatroom-area-send-content" placeholder="type your message"  value={value} onChange={(e) => {
          setValue(e.currentTarget.value);
        }} />
    </div>

    
   );
      
};

export default NewMessage;