import React, { useState } from "react";
import VideoInfo from "./components/VideoInfo";

function App() {
  // define
  const api = "AIzaSyA_dElXTtCT54ue5JuYJJ-W0g6tAHZg9t0";
  let showMessage;
  let showVideoInfo;
  // states
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [src, setSrc] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [message,setMessage] = useState({});
  const [video,setVideo] = useState("")
  // methods
  const handleSubmit = (e) => {
    e.preventDefault();
    // remove any waring message if their is one..
	 setMessage({});
    setUrl(e.target.url.value);
    let urlArray = e.target.url.value.split("/");
    console.log(urlArray)
    if (urlArray[2] === "youtube.com" || urlArray[2] === "www.youtube.com") {
	  // remove any waring message if their is one..
	  setMessage({});
      const watchQuery = urlArray[3];
      console.log(watchQuery.split("watch"))
      if(watchQuery.split("watch")[0] === "")
      {
      	// remove message
      	setMessage({});
      	const videoIdArray = watchQuery.split("watch?v=");
      	const videoId = videoIdArray[1];
      	getVideoInfo(videoId);
      	
      }else{
      	setMessage({message:'Please enter a valid YouTube video "URL"!',color:"red"})
      }
      
    }else if(urlArray[2] === "youtu.be"){
    	// remove any waring message if their is one..
	    setMessage({});
	 	const videoId =  urlArray[3];
	 	getVideoInfo(videoId);
    }
     else {
      setMessage({message:'Please enter a valid "YouTube" video link!',color:"red"})
      setTitle("");
      setDescription("");
      setSrc("");
      setTags("");
    }
  };

  const getVideoInfo = (videoId) => {
    fetch(
      `https://www.googleapis.com/youtube/v3/videos?key=${api}&fields=items(snippet(title,description,tags,thumbnails))&part=snippet&id=${videoId}`
    )
      .then((response) => response.json())
      .then((data) => {
        const videoInfo = data.items[0].snippet;
        console.log(videoInfo);
        setTitle(videoInfo.title);
        setDescription(videoInfo.description);
        setSrc(videoInfo.thumbnails.maxres.url);
        setTags(videoInfo.tags);
      });
  };
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
          <label>Video Url</label>
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
     {title == "" ? "":<VideoInfo title={title} src={src} description={description} tags={tags}/>}
    </div>
  );
}

export default App;
