import React from "react"

const VideoInfo = ({title,src,description,tags}) =>{
	return(
		<div className="video-info mt-5 mb-5">
		    <img src={src} className="img-fluid" alt={title} />
		    <h1 className="center">{title}</h1>
		    <div className="form-group">
			    <label htmlFor="exampleFormControlTextarea1">Description</label>
			    <textarea className="form-control" id="exampleFormControlTextarea1" rows="3"
			    col="3" value={description}  disabled></textarea>
		  	</div>

		    <div className="form-group">
		    <label>{tags.length} - Tags</label>
			    <div className="tags">
			    	{tags.map((tag,index) =>(
			    		<span key={index}>{tag}, </span>
			    	))}
			    </div>
			    <div className="fancy-tags mt-3">
			    	{tags.map((tag,index) =>(
			    		<span key={index}>{tag}</span>
			    	))}
			    </div>
		    </div>
	     </div>
	)
}

export default 	VideoInfo;