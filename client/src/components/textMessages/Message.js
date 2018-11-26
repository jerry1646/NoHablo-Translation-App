import React from "react";

export default function Message({message}) {
  const textResult = '<strong>'+message.resultText+'</strong><br/>'+message.inText
  return (<div className="message-item">
            <div className="message-bubble" dangerouslySetInnerHTML={{__html: textResult}}/>
          </div>
          )
}