import React from "react";
import Message from "./Message.js";


export default function MessageList({messages}) {
  const messageList = messages.map((message)=>{
    console.log(message)
    return <Message message = {message} key = {message.id}/>
  });

  return (
    <main className="messages">
      {messageList}
    </main>
  )
}