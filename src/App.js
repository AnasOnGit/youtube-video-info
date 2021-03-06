import React, { useState } from "react";
import VideoInfo from "./components/VideoInfo";
// add option to play video
function App() {
  // define
  const api = process.env.REACT_APP_API_KEY;
  let showMessage;
  let showVideoInfo;
  let showLoading = (<span className="loading">Loading</span>);
  // states
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [src, setSrc] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [message,setMessage] = useState({});
  const [subscriber,setSubscriber] = useState("")
  const [video,setVideo] = useState("")
  const [icon,setIcon] = useState("")
  const [channelName,setChannelName] = useState("")
  const [channelId,setChannelId] = useState("")
  const [loading,setLoading] = useState(false)
  const [videoId,setVideoId] = useState();
  // methods
  const handleSubmit = (e) => {
    e.preventDefault();
    // remove any waring message if their is one..
	 setMessage({});
    setUrl(e.target.url.value);
    let urlArray = e.target.url.value.split("/");
    if (urlArray[2] === "youtube.com" || urlArray[2] === "www.youtube.com") {
	  // remove any waring message if their is one..
	  setMessage({});
      const watchQuery = urlArray[3];
      if(watchQuery === undefined)
      {
      	setMessage({message:"Please enter a valid link!!!"});
      }else
      if(watchQuery.split("watch")[0] === "")
      {
      	// remove message
      	setMessage({});
      	const videoIdArray = watchQuery.split("watch?v=");
      	setVideoId(videoIdArray[1]);
      	// show loading
      	setLoading(true)
      	// remove 
      	setTitle("")
      	// getting video Infomation
      	getVideoInfo(videoIdArray[1]);

      }else{
      	setMessage({message:'Please enter a valid YouTube video "URL"!',color:"red"})
      }
      
    }else if(urlArray[2] === "youtu.be"){
    	// remove any waring message if their is one..
	    setMessage({});
	 	setVideoId(urlArray[3]);
	 	// getting video Infomation
	 	getVideoInfo(urlArray[3]);
    }
     else {
     	// showing error message, if there is any problem with url
      setMessage({message:'Please enter a valid "YouTube" video link!',color:"red"})
      setTitle("");    }
  };

  const getVideoInfo = (videoId) => {
    fetch(
      `https://www.googleapis.com/youtube/v3/videos?key=${api}&part=snippet&id=${videoId}`
    )
      .then((response) => {
      	if(!response.ok)
      	{
      		// response.ok === 403 || 
      		throw Error("Youtube server is not responding, Please try again later!!!")
      	}
      	return response.json();
      })
      .then((data) => {
        const videoInfo = data.items[0].snippet;
        setTitle(videoInfo.title);
        setDescription(videoInfo.description);
        setSrc(videoInfo.thumbnails.maxres.url);
        setTags(videoInfo.tags);
        setChannelId(videoInfo.channelId)
        // hide loading
      	setLoading(false)
        // getting channel name and icon ==== we already have channel name we are only getting icon from here        
        fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${videoInfo.channelId}&key=${api}`
    )
      .then((response) => response.json())
      .then((data) => {
        const channelInfo = data.items[0].snippet;
        setChannelName(channelInfo.title)
        setIcon(channelInfo.thumbnails.default.url)

      });
        getStatistics(videoInfo.channelId);
        
      })
       .catch(err=>{
       	console.log(err)
         // hide loading
	     setLoading(false)
	     // set error message
        setMessage({message:`${err}`,color:"red"})
      })
  };
  const getChannelInfo = (channelId) => {
  	 fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${api}`
    )
      .then((response) => response.json())
      .then((data) => {
        const channelInfo = data.items[0].snippet;
        setChannelName(channelInfo.title)
        setIcon(channelInfo.thumbnails.default.url)

      });
  }

  const getStatistics = (channelId) => {
  	 fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${api}`
    )
      .then((response) => response.json())
      .then((data) => {
        const subscriberCount = data.items[0].statistics.subscriberCount;
        const sub = convert(subscriberCount)
       	setSubscriber(sub)
        convert(setSubscriber(sub))

      });
  }
  //https://www.googleapis.com/youtube/v3/channels?part=statistics&id=UC5RRWuMJu7yP1DQwnW_nAvA&key=AIzaSyA_dElXTtCT54ue5JuYJJ-W0g6tAHZg9t0
  const enterVideoInfo = () => {
  	setVideo(<VideoInfo title={title} src={src} description={description} tags={tags}/>);
  }
  // statement
  if(message.message === undefined)
  {
  	showMessage = "";
  }else{
  	showMessage = (
  		<div className="alert alert-danger alert-dismissible fade show" role="alert">
		  {message.message}
		  <button type="button" className="close" data-dismiss="alert" aria-label="Close">
		    <span aria-hidden="true">&times;</span>
		  </button>
		</div>
  	)
  }

  function convert(value)
{
    if(value>=1000000)
    {
        value=(value/1000000)+"M"
    }
    else if(value>=1000)
    {
        value=(value/1000)+"K";
    }
    return value;
}
  return (
    <div className="container">
      <nav className="navbar">
        <a className="navbar-brand" href="/">
          <strong>You</strong><span>Tube</span> Video <br/>Info Generator
        </a>
      </nav>
      <form className="mt-4" onSubmit={handleSubmit}>
  		{showMessage}
        <div className="form-group">
          <label>YouTube Video Link</label>
          <input
            type="url"
            placeholder="Video Url Here"
            className="form-control"
            required
            name="url"
          />
        </div>
        <button type="submit" className="btn btn-outline-danger mt-2 btn-block">
          Get Video Info
        </button>
      </form>
      {loading?showLoading:""}
     {title === "" ? "":<VideoInfo title={title} src={src} description={description}
      tags={tags} icon={icon} subscriber={subscriber} channelName={channelName}
       channelId={channelId} videoId={videoId}/>}
    <span className="box-container">
    	Hey, I'm YVI I can extract title, tags, description, and thumbnail from any YouTube Video for free and without any annoying ad. Just enter the link and I will do the rest.
    </span>	
    <span className="promotion">
    	Also checkout <a href="https://youtubenamegenerator.ml"> Youtube Name Generator</a> and <a href="https://tiktoknamegenerator.ml"> Tiktok Name Generator</a>
    </span>	
    </div>
  );
}

export default App;
