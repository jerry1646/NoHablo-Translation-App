import React from "react";

export default function Message({message}) {

  return (<div className="message">
              <span className="message-content" >
                <div className="message-bubble" dangerouslySetInnerHTML={{__html: `${message.inText}\n${message.resultText}`}}/>
              </span>
            </div>)
}