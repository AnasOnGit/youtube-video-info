import React from "react"

const ChannelInfo = ({icon,subscriber,channelName,channelId}) =>{
	return(
		<div className="channel-info mt-5 mb-5">
		   <a href={`https://youtube.com/channel/${channelId}`} target="_blank">
		   	 	<img src={icon} className="img-fluid" alt={channelName} />
			    <span className="center name-sub">
			    	<h3>{channelName}</h3>
			    	<span>{subscriber} subscribers</span>
			    </span>
		   </a>
	     </div>
	)
}

export default 	ChannelInfo;