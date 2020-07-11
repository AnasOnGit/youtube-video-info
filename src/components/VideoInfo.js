import React from "react"
import ChannelInfo from "./ChannelInfo"

const VideoInfo = ({title,src,description,tags,icon,subscriber,channelName,channelId,videoId}) =>{
	return(
		<div className="video-info mt-5 mb-5">
		<ChannelInfo icon={icon} subscriber={subscriber} channelName={channelName} channelId={channelId}/>
		    {/*<img src={src} className="img-fluid" alt={title} />*/}
		   <div className="video-iframe">
		    <iframe width="560" height="315" src={`https://www.youtube.com/embed/${videoId}`}></iframe>
		   </div>
		    <h1 className="center mt-1">{title}</h1>
		     <div className="form-group ">
			  	<label className="mt-1">{tags.length} - Tags Found</label>
			    <div className="tags">
			    	{tags.map((tag,index) =>(
			    		<span key={index}>{tag}, </span>
			    	))}
			    </div>
			   </div>
		    <div className="form-group mt-3">
			    <label htmlFor="exampleFormControlTextarea1">Description</label>
			    <textarea className="form-control description" id="exampleFormControlTextarea1" rows="3"
			    col="3" value={description}  disabled></textarea>
		  	</div>

		   
	     </div>
	)
}

export default 	VideoInfo;