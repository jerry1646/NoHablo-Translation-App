import React from "react";

export default function Message({message}) {

  return (<div className="message-item">
            <div className="message-bubble" dangerouslySetInnerHTML={{__html: `${message.inText}\n${message.resultText}`}}/>
          </div>
          )
}