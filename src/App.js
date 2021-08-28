import React, { useState, useEffect } from "react";
import VideoInfo from "./components/VideoInfo";
import rippleLoading from "./assets/gif/rippleLoading.gif";
// add option to play video
function App() {
  useEffect(() => {
    // window.addEventListener("DOMContentLoaded", () => {
    const parsedUrl = new URL(window.location);
    //   // searchParams.get() will properly handle decoding the values.
    //   alert("Title shared: " + parsedUrl.searchParams.get("title"));
    //   alert("Text shared: " + parsedUrl.searchParams.get("text"));
    //   alert("URL shared: " + parsedUrl.searchParams.get("url"));
    // });
    // if (parsedUrl.searchParams.get("title") != null) {
    //   alert("title: ", parsedUrl.searchParams.get("title"));
    // }
    // if (parsedUrl.searchParams.get("url") != null) {
    //   alert("url: ", parsedUrl.searchParams.get("url"));
    // }
    if (parsedUrl.searchParams.get("text") != null) {
      // alert("text: ", parsedUrl.searchParams.get("text"));
      // setSharedText(parsedUrl.searchParams.get("text"));
      setInputUrl(parsedUrl.searchParams.get("text"))
      parseUrlAndGetInfo(parsedUrl.searchParams.get("text"))
    }
    setSharedTitle(parsedUrl.searchParams.get("title"));
    setSharedText(parsedUrl.searchParams.get("text"));
    setSharedLink(parsedUrl.searchParams.get("url"));
  }, []);
  // define
  const api = process.env.REACT_APP_API_KEY;
  let showMessage;
  let showVideoInfo;
  // let showLoading = <span className="loading">Loading</span>;
  let showLoading = <img src={rippleLoading} className="loading" />;
  // states
  const [inputUrl, setInputUrl] = useState("");
  const [url, setUrl] = useState("");
  const [host, setHost] = useState("");
  const [pathname, setPathname] = useState("");
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [src, setSrc] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [message, setMessage] = useState({});
  const [subscriber, setSubscriber] = useState("");
  const [video, setVideo] = useState("");
  const [icon, setIcon] = useState("");
  const [channelName, setChannelName] = useState("");
  const [channelId, setChannelId] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoId, setVideoId] = useState();
  const [sharedLink, setSharedLink] = useState("");
  const [sharedText, setSharedText] = useState("");
  const [sharedTitle, setSharedTitle] = useState("");
  // methods
const handleSubmit = (e)=>{
e.preventDefault();
    // remove any waring message if their is one..
   findVideoInfo();
  //  setMessage({});
  // setUrl(e.target.url.value);
  // let urlArray = e.target.url.value.split("/");
  // parseUrlAndGetInfo(e.target.url.value)
}

const findVideoInfo = (link = "") => {
  setMessage({});
  // setUrl(e.target.url.value);
  let workingLink = link == "" ? inputUrl : link;
  let urlArray = workingLink.split("/");
  workingLink.includes("https://") && workingLink.includes("yout") ? parseUrlAndGetInfo(workingLink) : setMessage({ message: "Please enter a valid link!!!" });
}
  const parseUrlAndGetInfo = (link) => {
    let url = new URL(link);
    // console.log(url);
    if (url.host === "youtube.com" || url.host === "www.youtube.com") {
      // remove any waring message if their is one..
      setMessage({});
      const watchQuery = url.pathname;

      // const watchQuery = urlArray[3];
      if (watchQuery === undefined) {
        setMessage({ message: "Please enter a valid link!!!" });
      } else if (watchQuery === "/watch") {
        // remove message
        setMessage({});
        const getVideoId = url.search.replace("?v=", "");
        console.log(getVideoId);
        setVideoId(getVideoId);
        // show loading
        setLoading(true);
        // remove
        setTitle("");
        setTags([])
        // getting video Infomation
        getVideoInfo(getVideoId);
      } else {
        setMessage({
          message: 'Please enter a valid YouTube video "URL"!',
          color: "red",
        });
      }
    } else if (url.host === "youtu.be") {
      // remove any waring message if their is one..
      const watchQuery = url.pathname.replace("/", "");
      setMessage({});
      setVideoId(watchQuery);
      // getting video Infomation
      getVideoInfo(watchQuery);
    } else {
      // showing error message, if there is any problem with url
      setMessage({
        message: 'Please enter a valid "YouTube" video link!',
        color: "red",
      });
      setTitle("");
    }
  };

  const getVideoInfo = (videoId) => {
    fetch(
      `https://www.googleapis.com/youtube/v3/videos?key=${api}&part=snippet&id=${videoId}`
    )
      .then((response) => {
        if (!response.ok) {
          // response.ok === 403 ||
          throw Error(
            "Youtube server is not responding, Please try again later!!!"
          );
        }
        return response.json();
      })
      .then((data) => {
        const videoInfo = data.items[0].snippet;
        setTitle(videoInfo.title);
        setDescription(videoInfo.description);
        // setSrc(videoInfo.thumbnails.maxres.url);
        setTags([])
        setTags(videoInfo.tags);
        setChannelId(videoInfo.channelId);
        // hide loading
        setLoading(false);
        // getting channel name and icon ==== we already have channel name we are only getting icon from here
        console.log(videoInfo.channelId)
        fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${videoInfo.channelId}&key=${api}`
        )
          .then((response) => response.json())
          .then((data) => {
            const channelInfo = data.items[0].snippet;
            setChannelName(channelInfo.title);
            setIcon(channelInfo.thumbnails.default.url);
          });
        getStatistics(videoInfo.channelId);
      })
      .catch((err) => {
        console.log(err);
        // hide loading
        setLoading(false);
        // set error message
        setMessage({ message: `${err}`, color: "red" });
      });
  };
  const getChannelInfo = (channelId) => {
    fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${api}`
    )
      .then((response) => response.json())
      .then((data) => {
      	console.log(data)
        const channelInfo = data.items[0].snippet;
        setChannelName(channelInfo.title);
        setIcon(channelInfo.thumbnails.default.url);
      });
  };

  const getStatistics = (channelId) => {
    fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${api}`
    )
      .then((response) => response.json())
      .then((data) => {
        const subscriberCount = data.items[0].statistics.subscriberCount;
        const sub = convert(subscriberCount);
        setSubscriber(sub);
        convert(setSubscriber(sub));
      });
  };
  //https://www.googleapis.com/youtube/v3/channels?part=statistics&id=UC5RRWuMJu7yP1DQwnW_nAvA&key=AIzaSyA_dElXTtCT54ue5JuYJJ-W0g6tAHZg9t0
  const enterVideoInfo = () => {
    setVideo(
      <VideoInfo
        title={title}
        src={src}
        description={description}
        tags={tags}
      />
    );
  };
  // statement
  if (message.message === undefined) {
    showMessage = "";
  } else {
    showMessage = (
      <div className="error-msg">
        {message.message}
        {/* <span aria-hidden="true">&times;</span> */}
      </div>
    );
  }

  function convert(value) {
    if (value >= 1000000) {
      value = value / 1000000 + "M";
    } else if (value >= 1000) {
      value = value / 1000 + "K";
    }
    return value;
  }
  return (
    <div className="container">
      <nav className="navbar">
        <a className="navbar-brand" href="/">
          <strong>You</strong>
          <span>Tube</span> Video <br />
          Info Generator
        </a>
      </nav>
      <form className="mt-4" onSubmit={handleSubmit}>
        {showMessage}
        <div className="form-group">
          <label>Enter YouTube Video Link</label>
          <div className="input-close">
            <input
              type="url"
              placeholder="https://youtube.com/watch?v=hdnkjn"
              // className="form-control"
              required
              name="url"
              value={inputUrl}
              onChange={(e) => {
                setInputUrl(e.target.value);
              }}
              onPaste={(e) => {
                // setInputUrl(e.clipboardData.getData('Text'))
                findVideoInfo(e.clipboardData.getData('Text'))
            }}
            />
            <span
              className="paste"
              onClick={() => {
                navigator.clipboard.readText().then(
                  clipText => {findVideoInfo(clipText)
                    setInputUrl(clipText)}
                )
            }}
            >
              📋
            </span>
            <span
              className="close"
              onClick={() => {
                setInputUrl("");
              }}
            >
              +
              {/*&times;*/}
            </span>
            
          </div>
        </div>
        <button type="submit" className="btn btn-outline-danger mt-2 btn-block">
          Get Video Tags
        </button>
      </form>
      {loading ? showLoading : ""}
      {title === "" ? (
        ""
      ) : (
        <VideoInfo
          title={title}
          src={src}
          description={description}
          tags={tags}
          icon={icon}
          subscriber={subscriber}
          channelName={channelName}
          channelId={channelId}
          videoId={videoId}
        />
      )}
      <span className="box-container">
        Hey, I'm Ashisutanto I can extract title, tags, description, and
        thumbnail from any YouTube Video for free and without any annoying ad.
        Just enter the link and I will do the rest.
      </span>
      <span className="promotion">
        Also checkout{" "}
        <a href="https://youtubenamegenerator.ml"> Youtube Name Generator</a>{" "}
        and <a href="https://tiktoknamegenerator.ml"> Tiktok Name Generator</a>
      </span>
    </div>
  );
}

export default App;
