import React,{useState,useEffect} from "react"
import ChannelInfo from "./ChannelInfo"
import {CopyToClipboard} from 'react-copy-to-clipboard';

const VideoInfo = ({title,src,description,tags,icon,subscriber,channelName,channelId,videoId}) =>{
	const [copy,setCopy] = useState(false);
	useEffect(()=>{setCopy(false)},[])
	let videoTags = 
		tags && tags.map((tag,index) =>{
		if(index === tags.length -1 )	
		{
		return (<span key={index}>{tag} </span> )
		}
		else
		{
			return(<span key={index}>{tag}, </span>)
		}
	
	})
	let copyBtcClass = copy ? "btn tags copy copied " :"btn tags copy"
	return(
		<div className="video-info mt-5 mb-5">
		<ChannelInfo icon={icon} subscriber={subscriber} channelName={channelName} channelId={channelId}/>
		    {/*<img src={src} className="img-fluid" alt={title} />*/}
		   <div className="video-iframe">
		    <iframe width="560" height="315" src={`https://www.youtube.com/embed/${videoId}`}></iframe>
		   </div>
		    <h1 className="center mt-1">{title}</h1>
		     <div className="form-group ">
			  	<label className="mt-1">{tags && tags.length || 0} - Tags Found</label>
			    <div className="tags">
			    	{videoTags}
			    </div>
				<CopyToClipboard text={
					tags && tags.map((tag,index) =>(tags.length - 1 === index ?`${tags}` : `${tags},`))
				}
					  onCopy={() => {tags && tags.length !== 0 ? setCopy(true) : setCopy(false)}}
				>
					<button className={tags && copyBtcClass || "btn tags copy disabled"}>{copy ? "Tags copied!" : "Copy all tags"}</button>
			
				</CopyToClipboard>
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