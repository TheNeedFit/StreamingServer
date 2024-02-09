import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Plyr from "plyr";
import Navbar from "./Navbar";
import Share from "./Share";
import "../Css/videoSection.css";
import "plyr/dist/plyr.css";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Tooltip from "@mui/material/Tooltip";
import AddToPhotosOutlinedIcon from "@mui/icons-material/AddToPhotosOutlined";
import Zoom from "@mui/material/Zoom";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";
import ReplyIcon from "@mui/icons-material/Reply";
import { LiaDownloadSolid } from "react-icons/lia";
import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";
import avatar from "../img/avatar.png";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import jwtDecode from "jwt-decode";
import Signin from "./Signin";
import Signup from "./Signup";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LeftPanel from "./LeftPanel";
import Error from "./Error";

function VideoSection() {
  const backendURL = "https://vercelbackendkle.onrender.com";
  const { id } = useParams();
  const [videoData, setVideoData] = useState(null);
  const [email, setEmail] = useState();
  const [channelName, setChannelName] = useState();
  const [plyrInitialized, setPlyrInitialized] = useState(false);
  const [Display, setDisplay] = useState("none");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isChannel, setisChannel] = useState();
  const [shareClicked, setShareClicked] = useState(false);
  const [usermail, setUserMail] = useState();
  const [channelID, setChannelID] = useState();
  const [isSwitch, setisSwitched] = useState(false);
  const [isbtnClicked, setisbtnClicked] = useState(false);
  const videoRef = useRef(null);
  const [TagSelected, setTagSelected] = useState("All");
  const [userVideos, setUserVideos] = useState([]);
  const [checkTrending, setCheckTrending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recommendLoading, setRecommendLoading] = useState(true);
  const token = localStorage.getItem("userToken");
  const [likeLoading, setLikeLoading] = useState(false);
  const [seeDesc, setSeeDesc] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentOpacity, setCommentOpacity] = useState(1);
  const [theme, setTheme] = useState(() => {
    const Dark = localStorage.getItem("Dark");
    return Dark ? JSON.parse(Dark) : true;
  });

  //EXTRAS

  const [thumbnails, setThumbnails] = useState();
  const [Titles, setTitles] = useState();
  const [Uploader, setUploader] = useState();
  const [duration, setDuration] = useState();
  const [VideoID, setVideoID] = useState();
  const [Views, SetViews] = useState();
  const [publishdate, setPublishDate] = useState();
  const [VideoLikes, setVideoLikes] = useState();
  const [CommentLikes, setCommentLikes] = useState();
  const [isLiked, setIsLiked] = useState();
  const [isSaved, setIsSaved] = useState();
  const [createPlaylistClicked, setcreatePlaylistClicked] = useState(false);
  const [privacyClicked, setprivacyClicked] = useState(false);
  const [playlistClicked, setPlaylistClicked] = useState(false);
  const [privacy, setPrivacy] = useState("Public");
  const [playlistName, setPlaylistName] = useState("");
  const [UserPlaylist, setUserPlaylist] = useState([]);
  const [playlistID, setplaylistID] = useState([]);
  const [isHeart, setIsHeart] = useState([]);
  const [rec, setRecommend] = useState(false);

  //Get Channel Data
  const [YoutuberName, setYoutuberName] = useState();
  const [YoutuberProfile, setYoutuberProfile] = useState();
  const [YoutubeChannelID, setYoutubeChannelID] = useState();
  const [isSubscribed, setIsSubscribed] = useState();
  const [Subscribers, setSubscribers] = useState();

  //Signup user Profile Pic
  const [userProfile, setUserProfile] = useState();

  //TOAST FUNCTIONS

  const playlistNotify = () =>
    toast.success("Video added to the playlist!", {
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: theme ? "dark" : "light",
    });

  const watchLaterNotify = () =>
    toast.success("Video saved to watch later!", {
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: theme ? "dark" : "light",
    });

  const LikedNotify = () =>
    toast.success("Video liked!", {
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: theme ? "dark" : "light",
    });

  const SubscribeNotify = () =>
    toast.success("Channel subscribed!", {
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: theme ? "dark" : "light",
    });

  const CommentDeleteNotify = () =>
    toast.success("Comment deleted!", {
      position: "bottom-center",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: theme ? "dark" : "light",
    });

  // USE EFFECTS

  useEffect(() => {
    if (token) {
      setEmail(jwtDecode(token).email);
    }
  }, [token]);

  useEffect(() => {
    function handleResize() {
      setRecommend(window.innerWidth <= 1100);
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (theme === false && !window.location.href.includes("/studio")) {
      document.body.style.backgroundColor = "white";
    } else if (theme === true && !window.location.href.includes("/studio")) {
      document.body.style.backgroundColor = "0f0f0f";
    }
  }, [theme]);

  useEffect(() => {
    const handleClick = () => {
      setShareClicked(false);
      document.body.classList.remove("bg-css");
    };

    const cancelShare = document.querySelector(".cancel-share");

    if (cancelShare) {
      cancelShare.addEventListener("click", handleClick);
    }

    return () => {
      if (cancelShare) {
        cancelShare.removeEventListener("click", handleClick);
      }
    };
  });

  useEffect(() => {
    const checkChannel = async () => {
      try {
        if (email !== undefined) {
          const response = await fetch(
            `${backendURL}/checkchannel/${email}`
          );
          const channelname = await response.json();
          setChannelName(channelname);
        }
      } catch (error) {
        //console.log(error.message);
      }
    };

    checkChannel();
  }, [email]);

  useEffect(() => {
    const getChannel = async () => {
      try {
        if (email !== undefined) {
          const response = await fetch(
            `${backendURL}/getchannel/${email}`
          );
          const { channel, profile } = await response.json();
          setisChannel(channel);
          setUserProfile(profile);
        }
      } catch (error) {
        //console.log(error.message);
      }
    };
    getChannel();
  }, [email]);

  useEffect(() => {
    const getTrendingData = async () => {
      try {
        if (id !== undefined) {
          const response = await fetch(
            `${backendURL}/gettrendingdata/${id}`
          );
          const data = await response.json();
          setCheckTrending(data);
        }
      } catch (error) {
        //console.log(error.message);
      }
    };
    getTrendingData();
  }, [id]);

  useEffect(() => {
    const PushTrending = async () => {
      try {
        if (id !== undefined && usermail !== undefined) {
          const response = await fetch(
            `${backendURL}/checktrending/${id}/${usermail}`
          );
          await response.json();
        }
      } catch (error) {
        //console.log(error.message);
      }
    };
    PushTrending();
  }, [id, usermail]);

  useEffect(() => {
    const getVideoData = async () => {
      try {
        if (id !== undefined) {
          const response = await fetch(
            `${backendURL}/videodata/${id}`
          );
          const video = await response.json();
          setVideoData(video);
        }
      } catch (error) {
        //console.log(error.message);
      }
    };

    getVideoData();
  }, [id]);

  useEffect(() => {
    const getVideos = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/getvideos"
        );
        const {
          thumbnailURLs,
          titles,
          Uploader,
          Duration,
          videoID,
          views,
          uploadDate,
        } = await response.json();
        setThumbnails(thumbnailURLs);
        setTitles(titles);
        setUploader(Uploader);
        setDuration(Duration);
        setVideoID(videoID);
        SetViews(views);
        setPublishDate(uploadDate);
      } catch (error) {
        //console.log(error.message);
      }
    };

    getVideos();
  }, []);

  useEffect(() => {
    const initializePlyr = () => {
      if (!plyrInitialized && videoRef.current) {
        const player = new Plyr(videoRef.current, {
          background: "red",
          ratio: null,
        });
        setPlyrInitialized(true);
      }
    };

    if (videoData && videoData.VideoData) {
      initializePlyr();
    }
  }, [plyrInitialized, videoData]);

  useEffect(() => {
    const getLikes = async () => {
      try {
        if (id !== undefined) {
          const response = await fetch(
            `${backendURL}/getlike/${id}/`
          );
          const likes = await response.json();
          setVideoLikes(likes);
        }
      } catch (error) {
        //console.log(error.message);
      }
    };

    const interval = setInterval(getLikes, 300);

    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    const LikeExists = async () => {
      try {
        if (id !== undefined && email !== undefined) {
          const response = await fetch(
            `${backendURL}/getuserlikes/${id}/${email}`
          );
          const { existingLikedVideo } = await response.json();
          if (!existingLikedVideo) {
            setIsLiked(false);
          } else {
            setIsLiked(true);
          }
        }
      } catch (error) {
        //console.log(error.message);
      }
    };
    const interval = setInterval(LikeExists, 200);

    return () => clearInterval(interval);
  }, [email, id]);

  useEffect(() => {
    const CommentLikes = async () => {
      try {
        if (id !== undefined) {
          const response = await fetch(
            `${backendURL}/likecomment/${id}`
          );
          const result = await response.json();
          setCommentLikes(result);
        }
      } catch (error) {
        //console.log(error.message);
      }
    };

    const interval = setInterval(CommentLikes, 200);

    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    const getWatchlater = async () => {
      try {
        if (id !== undefined && email !== undefined) {
          const response = await fetch(
            `${backendURL}/checkwatchlater/${id}/${email}`
          );
          const data = await response.json();
          if (data === "Found") {
            setIsSaved(true);
          } else {
            setIsSaved(false);
          }
        }
      } catch (error) {
        //console.log(error.message);
      }
    };

    const interval = setInterval(getWatchlater, 200);

    return () => clearInterval(interval);
  });

  useEffect(() => {
    const getComments = async () => {
      try {
        if (id !== undefined) {
          const response = await fetch(
            `${backendURL}/getcomments/${id}`
          );
          const result = await response.json();
          setComments(result);
        }
      } catch (error) {
        //console.log(error.message);
      }
    };
    const interval = setInterval(getComments, 200);

    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    const getOtherChannel = async () => {
      try {
        if (id !== undefined) {
          const response = await fetch(
            `${backendURL}/otherchannel/${id}`
          );
          const userEmail = await response.json();
          setUserMail(userEmail);
        }
      } catch (error) {
        //console.log(error.message);
      }
    };

    getOtherChannel();
  }, [id]);

  useEffect(() => {
    const getChannelID = async () => {
      try {
        if (usermail !== undefined) {
          const response = await fetch(
            `${backendURL}/getchannelid/${usermail}`
          );
          const { channelID, subscribers } = await response.json();
          setChannelID(channelID);
          setSubscribers(subscribers);
        }
      } catch (error) {
        // console.log("Error fetching user data:", error.message);
      }
    };

    getChannelID()
  }, [usermail]);

  useEffect(() => {
    const GetChannelData = async () => {
      try {
        if (usermail !== undefined) {
          const response = await fetch(
            `${backendURL}/subscribe/${usermail}`
          );
          const { channel, profile, channelid } = await response.json();
          setYoutuberName(channel);
          setYoutuberProfile(profile);
          setYoutubeChannelID(channelid);
        }
      } catch (error) {
        // console.log("Error fetching user data:", error.message);
      }
    };

    GetChannelData();
  }, [usermail]);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        if (email !== undefined && channelID !== undefined) {
          const response = await fetch(
            `${backendURL}/checksubscription/${channelID}/${email}`
          );
          const { existingChannelID } = await response.json();
          if (existingChannelID !== undefined) {
            setIsSubscribed(true);
          } else {
            setIsSubscribed(false);
          }
        }
      } catch (error) {
        //console.log(error.message);
      }
    };

    const interval = setInterval(checkSubscription, 400);

    return () => clearInterval(interval);
  }, [channelID, email]);

  useEffect(() => {
    const GetUserVideos = async () => {
      try {
        if (usermail !== undefined) {
          const response = await fetch(
            `${backendURL}/getuservideos/${usermail}`
          );
          const myvideos = await response.json();
          setUserVideos(myvideos);
        }
      } catch (error) {
        //console.log(error.message);
      }
    };

    GetUserVideos();
  }, [usermail]);

  useEffect(() => {
    const getPlaylists = async () => {
      try {
        if (email !== undefined) {
          const response = await fetch(
            `${backendURL}/getplaylistdata/${email}`
          );
          const playlists = await response.json();
          setUserPlaylist(playlists);
        }
      } catch (error) {
        //console.log(error.message);
      }
    };

    const interval = setInterval(getPlaylists, 400);

    return () => clearInterval(interval);
  }, [email]);

  useEffect(() => {
    const getVideoAvailableInPlaylist = async () => {
      try {
        if (id !== undefined && email !== undefined) {
          const response = await fetch(
            `${backendURL}/getvideodataplaylist/${email}/${id}`
          );
          const playlistIdsWithVideo = await response.json();
          setplaylistID(playlistIdsWithVideo);
        }
      } catch (error) {
        //console.log(error.message);
      }
    };

    const interval = setInterval(getVideoAvailableInPlaylist, 400);

    return () => clearInterval(interval);
  }, [email, id]);

  useEffect(() => {
    const getHeartComments = async () => {
      try {
        if (id !== undefined) {
          const response = await fetch(
            `${backendURL}/getheartcomment/${id}`
          );
          const heart = await response.json();
          setIsHeart(heart);
        }
      } catch (error) {
        //console.log(error.message);
      }
    };

    const interval = setInterval(getHeartComments, 400);

    return () => clearInterval(interval);
  }, [email, id]);

  useEffect(() => {
    setTimeout(() => {
      setRecommendLoading(false);
    }, 3500);
  }, []);

  //POST REQUESTS

  const uploadComment = async () => {
    try {
      setCommentLoading(true);
      const response1 = await fetch(
        `${backendURL}/getchannelid/${email}`
      );
      const { channelID } = await response1.json();
      const data = {
        comment,
        email,
        channelID,
      };
      const response = await fetch(
        `${backendURL}/comments/${id}`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const Data = await response.json();
      if (Data === "Uploaded") {
        setCommentLoading(false);
      } else {
        setCommentLoading(true);
      }
    } catch (error) {
      //console.log(error.message);
    }
  };

  if (!videoData) {
    return (
      <>
        <div
          className={
            theme ? "main-video-section2" : "main-video-section2 light-mode"
          }
        >
          <div className="spin23">
            <span className={theme ? "loader2" : "loader2-light"}></span>
          </div>
        </div>
      </>
    );
  }

  // if (!videoData) {
  //   return (
  //     <>
  //       <div className="main-video-section2">
  //         <div className="spin2">
  //           <ReactLoading
  //             type={"spin"}
  //             color={"white"}
  //             height={50}
  //             width={50}
  //           />
  //           <p style={{ marginTop: "15px" }}>
  //             Fetching the data, Hang tight...{" "}
  //           </p>{" "}
  //         </div>
  //       </div>
  //     </>
  //   );
  // }

  const { VideoData } = videoData;
  const matchedVideo = VideoData && VideoData.find((item) => item._id === id);

  if (!matchedVideo) {
    return (
      <>
        <div
          className={
            theme ? "main-video-section2" : "main-video-section2 light-mode"
          }
        >
          <div className="spin23">
            <span className={theme ? "loader2" : "loader2-light"}></span>
          </div>
        </div>
      </>
    );
  }

  // if (!matchedVideo) {
  //   return (
  //     <>
  //       <div className="main-video-section2">
  //         <div className="spin2">
  //           <ReactLoading
  //             type={"spin"}
  //             color={"white"}
  //             height={50}
  //             width={50}
  //           />
  //           <p style={{ marginTop: "15px" }}>
  //             Fetching the data, Hang tight...{" "}
  //           </p>
  //         </div>
  //       </div>
  //     </>
  //   );
  // }

  const {
    videoURL,
    Title,
    thumbnailURL,
    ChannelProfile,
    uploader,
    Description,
    views,
    videoLength,
    uploaded_date,
    visibility,
  } = matchedVideo;

  document.title =
    Title && Title !== undefined ? `${Title} - Streaming Server` : "Streaming Server";

  const likeVideo = async () => {
    try {
      setLikeLoading(true);

      const response = await fetch(
        `${backendURL}/like/${id}/${email}/${usermail}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      // console.log(data);
      if (data === "Liked") {
        LikedNotify();
        setLikeLoading(false);
      } else if (data === "Liked" || data === "Disliked") {
        setLikeLoading(false);
      } else if (data !== "Liked" || data !== "Disliked") {
        setLikeLoading(true);
      }
    } catch (error) {
      //console.log(error.message);
    }
  };

  const LikeComment = async (commentId) => {
    try {
      if (commentId !== undefined && id !== undefined && email !== undefined) {
        const response = await fetch(
          `${backendURL}/likecomment/${id}/${commentId}/${email}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        await response.json();
      }
    } catch (error) {
      //console.log(error.message);
    }
  };

  const HeartComment = async (commentID) => {
    try {
      if (id !== undefined && channelID !== undefined) {
        const response = await fetch(
          `${backendURL}/heartcomment/${id}/${commentID}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        await response.json();
      }
    } catch (error) {
      //console.log(error.message);
    }
  };

  const DeleteComment = async (commentId) => {
    try {
      setCommentOpacity(0.34);

      const response = await fetch(
        `${backendURL}/deletecomment/${id}/${commentId}/${email}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data === "Comment Deleted") {
        setCommentOpacity(1);
        CommentDeleteNotify();
      }
      // window.location.reload();
    } catch (error) {
      //console.log(error.message);
    }
  };

  const DislikeVideo = async () => {
    try {
      const response = await fetch(
        `${backendURL}/dislikevideo/${id}/${email}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      await response.json();
      // console.log("disliked");
    } catch (error) {
      //console.log(error.message);
    }
  };

  const downloadVideo = () => {
    const link = document.createElement("a");
    link.href = videoURL;
    link.target = "_blank";
    link.download = "video.mp4";
    link.click();
  };

  const saveVideo = async () => {
    try {
      if (id !== undefined && email !== undefined) {
        const response = await fetch(
          `${backendURL}/watchlater/${id}/${email}/${usermail}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (data === "Saved") {
          watchLaterNotify();
        }
      }
    } catch (error) {
      //console.log(error.message);
    }
  };

  const SubscribeChannel = async () => {
    try {
      const channelData = {
        YoutuberName,
        YoutuberProfile,
        YoutubeChannelID,
      };
      const response = await fetch(
        `${backendURL}/subscribe/${channelID}/${email}/${usermail}`,
        {
          method: "POST",
          body: JSON.stringify(channelData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data === "Subscribed") {
        SubscribeNotify();
      }
    } catch (error) {
      //console.log(error.message);
    }
  };

  const updateViews = async (id) => {
    try {
      if (id !== undefined) {
        const response = await fetch(
          `${backendURL}/updateview/${id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        await response.json();
      }
    } catch (error) {
      //console.log(error.message);
    }
  };

  //ADD PLAYLIST

  const AddPlaylist = async () => {
    try {
      setLoading(true);
      if (email !== undefined) {
        const currentDate = new Date().toISOString();
        const data = {
          playlist_name: playlistName,
          playlist_privacy: privacy,
          playlist_date: currentDate,
          playlist_owner: channelName,
          thumbnail: thumbnailURL,
          title: Title,
          videoID: id,
          description: Description,
          videolength: videoLength,
          video_uploader: uploader,
          video_date: uploaded_date,
          video_views: views,
          videoprivacy: visibility,
        };

        const response = await fetch(
          `${backendURL}/addplaylist/${email}`,
          {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const Data = await response.json();
        if (Data) {
          setLoading(false);
          playlistNotify();
          window.location.reload();
        }
      }
    } catch (error) {
      //console.log(error.message);
      setLoading(true);
    }
  };

  const AddVideoToExistingPlaylist = async (Id) => {
    try {
      if (email !== undefined && Id !== undefined) {
        const data = {
          Id,
          thumbnail: thumbnailURL,
          title: Title,
          videoID: id,
          description: Description,
          videolength: videoLength,
          video_uploader: channelName,
          video_date: uploaded_date,
          video_views: views,
          videoprivacy: visibility,
        };

        const response = await fetch(
          `${backendURL}/addvideotoplaylist/${email}`,
          {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        await response.json();
        playlistNotify();
      }
    } catch (error) {
      //console.log(error.message);
    }
  };

  //REMOVE VIDEO FROM PLAYLIST

  const RemoveVideo = async (playlistID) => {
    try {
      if (email !== undefined && id !== undefined && playlistID !== undefined) {
        const response = await fetch(
          `${backendURL}/removevideo/${email}/${id}/${playlistID}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        await response.json();
      }
    } catch (error) {
      //console.log(error.message);
    }
  };

  const menu = document.querySelector(".menu");
  if (menu !== null) {
    menu.style.display = "none";
  }

  const menu2 = document.querySelector(".menu-light");
  if (menu2 !== null) {
    menu2.style.display = "none";
  }

  const formatDescriptionWithLinks = (description) => {
    const linkPattern = /(http|https):\/\/(www\.)?[^\s]+/g;
    const formattedDescription = description.replace(
      linkPattern,
      (match) => `<a href="${match}" target="_blank">${match}</a>`
    );
    return formattedDescription.replace(/\n/g, "<br>");
  };

  if (email !== usermail && visibility === "Private") {
    return (
      <>
        <Error />
      </>
    );
  }

  return (
    <>
      <div className="my-navbar">
        <Navbar />
      </div>
      <div className="my-panelbar">
        <LeftPanel />
      </div>
      <div
        className={
          theme ? "main-video-section" : "main-video-section light-mode"
        }
      >
        <div className="left-video-section2">
          <div className="videoframe">
            <video
              className="play-video"
              controls
              ref={videoRef}
              poster={thumbnailURL}
            >
              <source src={videoURL} type="video/mp4" />
            </video>
          </div>
          <p
            className={theme ? "trending-tag" : "trending-tag-light"}
            onClick={() => {
              window.location.href = "/trending";
            }}
          >
            {checkTrending === true ? "#TRENDING" : ""}
          </p>
          <p className={theme ? "vid-title" : "vid-title text-light-mode"}>
            {Title}
          </p>
          <div className="some-channel-data">
            <div
              className={
                theme
                  ? "channel-left-data"
                  : "channel-left-data text-light-mode"
              }
            >
              <img
                src={ChannelProfile}
                alt="channelDP"
                className="channelDP"
                loading="lazy"
                onClick={() => {
                  if (channelID !== undefined) {
                    window.location.href = `/channel/${channelID}`;
                  }
                }}
              />
             
             
            </div>
            <div className="channel-right-data c-right1">
              <div
                className="like-dislike"
                style={
                  likeLoading === true
                    ? { opacity: 0.46, cursor: "wait", pointerEvents: "none" }
                    : { opacity: 1, cursor: "pointer", pointerEvents: "auto" }
                }
              >
                <Tooltip
                  TransitionComponent={Zoom}
                  title="I like this"
                  placement="top"
                >
                  <div
                    className={
                      theme
                        ? "like-data"
                        : "like-data like-data-light text-light-mode"
                    }
                    onClick={() => {
                      if (token) {
                        likeVideo();
                      } else {
                        setisbtnClicked(true);
                        document.body.classList.add("bg-css");
                      }
                    }}
                  >
                    {isLiked === true && token ? (
                      <ThumbUpIcon
                        fontSize="medium"
                        style={{ color: theme ? "white" : "black" }}
                        className="like-icon"
                      />
                    ) : (
                      <ThumbUpAltOutlinedIcon
                        fontSize="medium"
                        style={{ color: theme ? "white" : "black" }}
                        className="like-icon"
                      />
                    )}

                    <p className="like-count">{VideoLikes}</p>
                  </div>
                </Tooltip>
                <div className={theme ? "vl" : "vl-light"}></div>
                <Tooltip
                  TransitionComponent={Zoom}
                  title="I dislike this"
                  placement="top"
                >
                  <div
                    className={
                      theme
                        ? "dislike-data"
                        : "dislike-data dislike-data-light text-light-mode"
                    }
                    onClick={() => {
                      if (token) {
                        DislikeVideo();
                      } else {
                        setisbtnClicked(true);
                        document.body.classList.add("bg-css");
                      }
                    }}
                  >
                    <ThumbDownOutlinedIcon
                      fontSize="medium"
                      style={{ color: theme ? "white" : "black" }}
                      className="dislike-icon"
                    />
                  </div>
                </Tooltip>
              </div>
            
           
            </div>
            <div className="channel-right-data c-right2">
              <div className="first-c-data">
                <div
                  className="like-dislike"
                  style={
                    likeLoading === true
                      ? { opacity: 0.46, cursor: "wait", pointerEvents: "none" }
                      : { opacity: 1, cursor: "pointer", pointerEvents: "auto" }
                  }
                >
                  <Tooltip
                    TransitionComponent={Zoom}
                    title="I like this"
                    placement="top"
                  >
                    <div
                      className={
                        theme
                          ? "like-data"
                          : "like-data like-data-light text-light-mode"
                      }
                      onClick={() => {
                        if (token) {
                          likeVideo();
                        } else {
                          setisbtnClicked(true);
                          document.body.classList.add("bg-css");
                        }
                      }}
                    >
                      {isLiked === true && token ? (
                        <ThumbUpIcon
                          fontSize="medium"
                          style={{ color: theme ? "white" : "black" }}
                          className="like-icon"
                        />
                      ) : (
                        <ThumbUpAltOutlinedIcon
                          fontSize="medium"
                          style={{ color: theme ? "white" : "black" }}
                          className="like-icon"
                        />
                      )}

                      <p className="like-count">{VideoLikes}</p>
                    </div>
                  </Tooltip>
                  <div className={theme ? "vl" : "vl-light"}></div>
                  <Tooltip
                    TransitionComponent={Zoom}
                    title="I dislike this"
                    placement="top"
                  >
                    <div
                      className={
                        theme
                          ? "dislike-data"
                          : "dislike-data dislike-data-light text-light-mode"
                      }
                      onClick={() => {
                        if (token) {
                          DislikeVideo();
                        } else {
                          setisbtnClicked(true);
                          document.body.classList.add("bg-css");
                        }
                      }}
                    >
                      <ThumbDownOutlinedIcon
                        fontSize="medium"
                        style={{ color: theme ? "white" : "black" }}
                        className="dislike-icon"
                      />
                    </div>
                  </Tooltip>
                </div>
               
              
               
              </div>
              <div className="firstt-c-data">
                <div
                  className="like-dislike"
                  style={
                    likeLoading === true
                      ? { opacity: 0.46, cursor: "wait", pointerEvents: "none" }
                      : { opacity: 1, cursor: "pointer", pointerEvents: "auto" }
                  }
                >
                  <Tooltip
                    TransitionComponent={Zoom}
                    title="I like this"
                    placement="top"
                  >
                    <div
                      className={
                        theme
                          ? "like-data"
                          : "like-data like-data-light text-light-mode"
                      }
                      onClick={() => {
                        if (token) {
                          likeVideo();
                        } else {
                          setisbtnClicked(true);
                          document.body.classList.add("bg-css");
                        }
                      }}
                    >
                      {isLiked === true && token ? (
                        <ThumbUpIcon
                          fontSize="medium"
                          style={{ color: theme ? "white" : "black" }}
                          className="like-icon"
                        />
                      ) : (
                        <ThumbUpAltOutlinedIcon
                          fontSize="medium"
                          style={{ color: theme ? "white" : "black" }}
                          className="like-icon"
                        />
                      )}

                      <p className="like-count">{VideoLikes}</p>
                    </div>
                  </Tooltip>
                  <div className={theme ? "vl" : "vl-light"}></div>
                  <Tooltip
                    TransitionComponent={Zoom}
                    title="I dislike this"
                    placement="top"
                  >
                    <div
                      className={
                        theme
                          ? "dislike-data"
                          : "dislike-data dislike-data-light text-light-mode"
                      }
                      onClick={() => {
                        if (token) {
                          DislikeVideo();
                        } else {
                          setisbtnClicked(true);
                          document.body.classList.add("bg-css");
                        }
                      }}
                    >
                      <ThumbDownOutlinedIcon
                        fontSize="medium"
                        style={{ color: theme ? "white" : "black" }}
                        className="dislike-icon"
                      />
                    </div>
                  </Tooltip>
                </div>
               
              </div>
            </div>
          </div>
          <div
            className={
              theme
                ? "description-section2"
                : "description-section2-light text-light-mode feature-light3"
            }
          >
            <div className="views-date" style={{ fontSize: "15.5px" }}>
              <p>
                {views >= 1e9
                  ? `${(views / 1e9).toFixed(1)}B`
                  : views >= 1e6
                    ? `${(views / 1e6).toFixed(1)}M`
                    : views >= 1e3
                      ? `${(views / 1e3).toFixed(1)}K`
                      : views}{" "}
                views
              </p>
              <p style={{ marginLeft: "10px" }}>
                {(() => {
                  const timeDifference = new Date() - new Date(uploaded_date);
                  const minutes = Math.floor(timeDifference / 60000);
                  const hours = Math.floor(timeDifference / 3600000);
                  const days = Math.floor(timeDifference / 86400000);
                  const weeks = Math.floor(timeDifference / 604800000);
                  const years = Math.floor(timeDifference / 31536000000);

                  if (minutes < 1) {
                    return "just now";
                  } else if (minutes < 60) {
                    return `${minutes} mins ago`;
                  } else if (hours < 24) {
                    return `${hours} hours ago`;
                  } else if (days < 7) {
                    return `${days} days ago`;
                  } else if (weeks < 52) {
                    return `${weeks} weeks ago`;
                  } else {
                    return `${years} years ago`;
                  }
                })()}
              </p>
            </div>
            <div className="desc-data">
              <p
                style={
                  seeDesc === false
                    ? { marginTop: "20px" }
                    : { display: "none" }
                }
                className="videos-desc"
                dangerouslySetInnerHTML={{
                  __html:
                    Description &&
                    formatDescriptionWithLinks(
                      Description.length > 170
                        ? Description.substring(0, 170) + "..."
                        : Description
                    ),
                }}
              />
              <p
                style={
                  seeDesc === true ? { marginTop: "20px" } : { display: "none" }
                }
                className="videos-desc"
                dangerouslySetInnerHTML={{
                  __html:
                    Description && formatDescriptionWithLinks(Description),
                }}
              />
              {Description && Description.length > 170 ? (
                <p
                  className="desc-seemore"
                  onClick={() => setSeeDesc(!seeDesc)}
                  style={
                    seeDesc === false
                      ? { display: "block", cursor: "pointer" }
                      : { display: "none" }
                  }
                >
                  See more...
                </p>
              ) : null}
              {Description && Description.length > 170 ? (
                <p
                  className="desc-seemore"
                  onClick={() => setSeeDesc(!seeDesc)}
                  style={
                    seeDesc === true
                      ? { display: "block", cursor: "pointer" }
                      : { display: "none" }
                  }
                >
                  See less...
                </p>
              ) : null}
            </div>
          </div>
          
        </div>
        {recommendLoading === true && (
          <SkeletonTheme
            baseColor={theme ? "#353535" : "#aaaaaa"}
            highlightColor={theme ? "#444" : "#b6b6b6"}
          >
            <div className="recommended-section">
              <div className="recommend-tags">
                <div
                  className={
                    TagSelected === "All"
                      ? `top-tags tag-one ${theme ? "tag-color" : "tag-color-light"
                      }`
                      : `top-tags tag-one ${theme ? "" : "tagcolor-newlight"}`
                  }
                >
                  <p onClick={() => setTagSelected("All")}>All</p>
                </div>
                <div
                  className={
                    TagSelected === uploader
                      ? `top-tags tag-two ${theme ? "tag-color" : "tag-color-light"
                      }`
                      : `top-tags tag-two ${theme ? "" : "tagcolor-newlight"}`
                  }
                  style={{ marginLeft: "10px" }}
                >
                  <p onClick={() => setTagSelected(`${uploader}`)}>
                    From {uploader}
                  </p>
                </div>
              </div>
              <div className="video-section2">
                {Array.from({ length: 10 }).map(() => (
                  <>
                    <div
                      className="video-data123"
                      style={{ marginTop: "10px" }}
                    >
                      <div className="video-left-side">
                        <Skeleton
                          count={1}
                          width={190}
                          height={107}
                          style={{ borderRadius: "12px" }}
                          className="sk-recommend-vid"
                        />
                      </div>
                      <div
                        className="video-right-side sk-right"
                        style={{ marginTop: "5px" }}
                      >
                        <Skeleton
                          count={1}
                          width={250}
                          height={32}
                          className="sk-recommend-title"
                        />
                        <Skeleton
                          count={1}
                          width={250}
                          height={15}
                          style={{ position: "relative", top: "10px" }}
                          className="sk-recommend-basic1"
                        />
                        <Skeleton
                          count={1}
                          width={150}
                          height={15}
                          style={{ position: "relative", top: "15px" }}
                          className="sk-recommend-basic2"
                        />
                      </div>
                    </div>
                  </>
                ))}
              </div>
            </div>
          </SkeletonTheme>
        )}
        <div
          className="recommended-section"
          style={
            recommendLoading === true
              ? { visibility: "hidden" }
              : { visibility: "visible" }
          }
        >
          <div className="recommend-tags">
            <div
              className={
                TagSelected === "All"
                  ? `top-tags tag-one ${theme ? "tag-color" : "tag-color-light"
                  }`
                  : `top-tags tag-one ${theme ? "" : "tagcolor-newlight"}`
              }
            >
              <p onClick={() => setTagSelected("All")}>All</p>
            </div>
            <div
              className={
                TagSelected === uploader
                  ? `top-tags tag-two ${theme ? "tag-color" : "tag-color-light"
                  }`
                  : `top-tags tag-two ${theme ? "" : "tagcolor-newlight"}`
              }
              style={{ marginLeft: "10px" }}
            >
              <p onClick={() => setTagSelected(`${uploader}`)}>
                From {uploader}
              </p>
            </div>
          </div>
          <div
            className="video-section2"
            style={
              TagSelected === "All" ? { display: "flex" } : { display: "none" }
            }
          >
            {thumbnails &&
              !rec &&
              thumbnails.map((element, index) => {
                return (
                  <div
                    className="video-data12"
                    style={
                      element === thumbnailURL
                        ? { display: "none" }
                        : { display: "flex" }
                    }
                    key={index}
                    onClick={() => {
                      if (token) {
                        updateViews(VideoID[index]);
                        setTimeout(() => {
                          window.location.href = `/video/${VideoID[index]}`;
                        }, 400);
                      } else {
                        window.location.href = `/video/${VideoID[index]}`;
                      }
                    }}
                  >
                    <div className="video-left-side">
                      <img
                        src={element}
                        alt=""
                        className="recommend-thumbnails"
                        loading="lazy"
                      />
                      <p className="duration duration2">
                        {Math.floor(duration[index] / 60) +
                          ":" +
                          (Math.round(duration[index] % 60) < 10
                            ? "0" + Math.round(duration[index] % 60)
                            : Math.round(duration[index] % 60))}
                      </p>
                    </div>
                    <div className="video-right-side">
                      <p
                        className={
                          theme
                            ? "recommend-vid-title"
                            : "recommend-vid-title text-light-mode"
                        }
                      >
                        {Titles[index]}
                      </p>
                      <div
                        className={
                          theme
                            ? "recommend-uploader"
                            : "recommend-uploader text-light-mode2"
                        }
                      >
                        <p
                          className={
                            theme
                              ? "recommend-vid-uploader uploader"
                              : "recommend-vid-uploader uploader nohover"
                          }
                        >
                          {Uploader[index]}
                        </p>
                        <Tooltip
                          TransitionComponent={Zoom}
                          title="Verified"
                          placement="right"
                        >
                          <CheckCircleIcon
                            fontSize="100px"
                            style={{
                              color: "rgb(138, 138, 138)",
                              marginLeft: "4px",
                            }}
                          />
                        </Tooltip>
                      </div>
                      <div className="view-time">
                        <p className="views">
                          {Views[index] >= 1e9
                            ? `${(Views[index] / 1e9).toFixed(1)}B`
                            : Views[index] >= 1e6
                              ? `${(Views[index] / 1e6).toFixed(1)}M`
                              : Views[index] >= 1e3
                                ? `${(Views[index] / 1e3).toFixed(1)}K`
                                : Views[index]}{" "}
                          views
                        </p>
                        <p
                          className="upload-time"
                          style={{ marginLeft: "4px" }}
                        >
                          &#x2022;{" "}
                          {(() => {
                            const timeDifference =
                              new Date() - new Date(publishdate[index]);
                            const minutes = Math.floor(timeDifference / 60000);
                            const hours = Math.floor(timeDifference / 3600000);
                            const days = Math.floor(timeDifference / 86400000);
                            const weeks = Math.floor(
                              timeDifference / 604800000
                            );
                            const years = Math.floor(
                              timeDifference / 31536000000
                            );

                            if (minutes < 1) {
                              return "just now";
                            } else if (minutes < 60) {
                              return `${minutes} mins ago`;
                            } else if (hours < 24) {
                              return `${hours} hours ago`;
                            } else if (days < 7) {
                              return `${days} days ago`;
                            } else if (weeks < 52) {
                              return `${weeks} weeks ago`;
                            } else {
                              return `${years} years ago`;
                            }
                          })()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            {thumbnails &&
              rec &&
              thumbnails.slice(0, 12).map((element, index) => {
                return (
                  <div
                    className="video-data12"
                    style={
                      element === thumbnailURL
                        ? { display: "none" }
                        : { display: "flex" }
                    }
                    key={index}
                    onClick={() => {
                      if (token) {
                        updateViews(VideoID[index]);
                        setTimeout(() => {
                          window.location.href = `/video/${VideoID[index]}`;
                        }, 400);
                      } else {
                        window.location.href = `/video/${VideoID[index]}`;
                      }
                    }}
                  >
                    <div className="video-left-side">
                      <img
                        src={element}
                        alt=""
                        className="recommend-thumbnails"
                        loading="lazy"
                      />
                      <p className="duration duration2">
                        {Math.floor(duration[index] / 60) +
                          ":" +
                          (Math.round(duration[index] % 60) < 10
                            ? "0" + Math.round(duration[index] % 60)
                            : Math.round(duration[index] % 60))}
                      </p>
                    </div>
                    <div className="video-right-side">
                      <p
                        className={
                          theme
                            ? "recommend-vid-title"
                            : "recommend-vid-title text-light-mode"
                        }
                      >
                        {Titles[index]}
                      </p>
                      <div
                        className={
                          theme
                            ? "recommend-uploader"
                            : "recommend-uploader text-light-mode2"
                        }
                      >
                        <p
                          className={
                            theme
                              ? "recommend-vid-uploader uploader"
                              : "recommend-vid-uploader uploader nohover"
                          }
                        >
                          {Uploader[index]}
                        </p>
                        <Tooltip
                          TransitionComponent={Zoom}
                          title="Verified"
                          placement="right"
                        >
                          <CheckCircleIcon
                            fontSize="100px"
                            style={{
                              color: "rgb(138, 138, 138)",
                              marginLeft: "4px",
                            }}
                          />
                        </Tooltip>
                      </div>
                      <div className="view-time">
                        <p className="views">
                          {Views[index] >= 1e9
                            ? `${(Views[index] / 1e9).toFixed(1)}B`
                            : Views[index] >= 1e6
                              ? `${(Views[index] / 1e6).toFixed(1)}M`
                              : Views[index] >= 1e3
                                ? `${(Views[index] / 1e3).toFixed(1)}K`
                                : Views[index]}{" "}
                          views
                        </p>
                        <p
                          className="upload-time"
                          style={{ marginLeft: "4px" }}
                        >
                          &#x2022;{" "}
                          {(() => {
                            const timeDifference =
                              new Date() - new Date(publishdate[index]);
                            const minutes = Math.floor(timeDifference / 60000);
                            const hours = Math.floor(timeDifference / 3600000);
                            const days = Math.floor(timeDifference / 86400000);
                            const weeks = Math.floor(
                              timeDifference / 604800000
                            );
                            const years = Math.floor(
                              timeDifference / 31536000000
                            );

                            if (minutes < 1) {
                              return "just now";
                            } else if (minutes < 60) {
                              return `${minutes} mins ago`;
                            } else if (hours < 24) {
                              return `${hours} hours ago`;
                            } else if (days < 7) {
                              return `${days} days ago`;
                            } else if (weeks < 52) {
                              return `${weeks} weeks ago`;
                            } else {
                              return `${years} years ago`;
                            }
                          })()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          <div
            className="video-section23 userVideos"
            style={
              TagSelected !== "All" ? { display: "flex" } : { display: "none" }
            }
          >
            {userVideos &&
              !rec &&
              userVideos.length > 0 &&
              userVideos.map((element, index) => {
                return (
                  <div
                    className="video-data12"
                    style={
                      element.thumbnailURL === thumbnailURL
                        ? { display: "none" }
                        : { display: "flex" }
                    }
                    key={index}
                    onClick={() => {
                      if (token) {
                        updateViews(element._id);
                        setTimeout(() => {
                          window.location.href = `/video/${element._id}`;
                        }, 400);
                      } else {
                        window.location.href = `/video/${element._id}`;
                      }
                    }}
                  >
                    <div className="video-left-side">
                      <img
                        src={element.thumbnailURL}
                        alt=""
                        className="recommend-thumbnails"
                        loading="lazy"
                      />
                      <p className="duration duration2">
                        {Math.floor(element.videoLength / 60) +
                          ":" +
                          (Math.round(element.videoLength % 60) < 10
                            ? "0" + Math.round(element.videoLength % 60)
                            : Math.round(element.videoLength % 60))}
                      </p>
                    </div>
                    <div className="video-right-side">
                      <p
                        className={
                          theme
                            ? "recommend-vid-title"
                            : "recommend-vid-title text-light-mode"
                        }
                      >
                        {element.Title}
                      </p>
                      <div
                        className={
                          theme
                            ? "recommend-uploader"
                            : "recommend-uploader text-light-mode2"
                        }
                      >
                        <p
                          className={
                            theme
                              ? "recommend-vid-uploader uploader"
                              : "recommend-vid-uploader uploader nohover"
                          }
                        >
                          {element.uploader}
                        </p>
                        <Tooltip
                          TransitionComponent={Zoom}
                          title="Verified"
                          placement="right"
                        >
                          <CheckCircleIcon
                            fontSize="100px"
                            style={{
                              color: "rgb(138, 138, 138)",
                              marginLeft: "4px",
                            }}
                          />
                        </Tooltip>
                      </div>
                      <div className="view-time">
                        <p className="views">
                          {element.views >= 1e9
                            ? `${(element.views / 1e9).toFixed(1)}B`
                            : element.views >= 1e6
                              ? `${(element.views / 1e6).toFixed(1)}M`
                              : element.views >= 1e3
                                ? `${(element.views / 1e3).toFixed(1)}K`
                                : element.views}{" "}
                          views
                        </p>
                        <p
                          className="upload-time"
                          style={{ marginLeft: "4px" }}
                        >
                          &#x2022;{" "}
                          {(() => {
                            const timeDifference =
                              new Date() - new Date(element.uploaded_date);
                            const minutes = Math.floor(timeDifference / 60000);
                            const hours = Math.floor(timeDifference / 3600000);
                            const days = Math.floor(timeDifference / 86400000);
                            const weeks = Math.floor(
                              timeDifference / 604800000
                            );
                            const years = Math.floor(
                              timeDifference / 31536000000
                            );

                            if (minutes < 1) {
                              return "just now";
                            } else if (minutes < 60) {
                              return `${minutes} mins ago`;
                            } else if (hours < 24) {
                              return `${hours} hours ago`;
                            } else if (days < 7) {
                              return `${days} days ago`;
                            } else if (weeks < 52) {
                              return `${weeks} weeks ago`;
                            } else {
                              return `${years} years ago`;
                            }
                          })()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            {userVideos &&
              rec &&
              userVideos.length > 0 &&
              userVideos.slice(0, 12).map((element, index) => {
                return (
                  <div
                    className="video-data12"
                    style={
                      element.thumbnailURL === thumbnailURL
                        ? { display: "none" }
                        : { display: "flex" }
                    }
                    key={index}
                    onClick={() => {
                      if (token) {
                        updateViews(element._id);
                        setTimeout(() => {
                          window.location.href = `/video/${element._id}`;
                        }, 400);
                      } else {
                        window.location.href = `/video/${element._id}`;
                      }
                    }}
                  >
                    <div className="video-left-side">
                      <img
                        src={element.thumbnailURL}
                        alt=""
                        className="recommend-thumbnails"
                        loading="lazy"
                      />
                      <p className="duration duration2">
                        {Math.floor(element.videoLength / 60) +
                          ":" +
                          (Math.round(element.videoLength % 60) < 10
                            ? "0" + Math.round(element.videoLength % 60)
                            : Math.round(element.videoLength % 60))}
                      </p>
                    </div>
                    <div className="video-right-side">
                      <p
                        className={
                          theme
                            ? "recommend-vid-title"
                            : "recommend-vid-title text-light-mode"
                        }
                      >
                        {element.Title}
                      </p>
                      <div
                        className={
                          theme
                            ? "recommend-uploader"
                            : "recommend-uploader text-light-mode2"
                        }
                      >
                        <p
                          className={
                            theme
                              ? "recommend-vid-uploader uploader"
                              : "recommend-vid-uploader uploader nohover"
                          }
                        >
                          {element.uploader}
                        </p>
                        <Tooltip
                          TransitionComponent={Zoom}
                          title="Verified"
                          placement="right"
                        >
                          <CheckCircleIcon
                            fontSize="100px"
                            style={{
                              color: "rgb(138, 138, 138)",
                              marginLeft: "4px",
                            }}
                          />
                        </Tooltip>
                      </div>
                      <div className="view-time">
                        <p className="views">
                          {element.views >= 1e9
                            ? `${(element.views / 1e9).toFixed(1)}B`
                            : element.views >= 1e6
                              ? `${(element.views / 1e6).toFixed(1)}M`
                              : element.views >= 1e3
                                ? `${(element.views / 1e3).toFixed(1)}K`
                                : element.views}{" "}
                          views
                        </p>
                        <p
                          className="upload-time"
                          style={{ marginLeft: "4px" }}
                        >
                          &#x2022;{" "}
                          {(() => {
                            const timeDifference =
                              new Date() - new Date(element.uploaded_date);
                            const minutes = Math.floor(timeDifference / 60000);
                            const hours = Math.floor(timeDifference / 3600000);
                            const days = Math.floor(timeDifference / 86400000);
                            const weeks = Math.floor(
                              timeDifference / 604800000
                            );
                            const years = Math.floor(
                              timeDifference / 31536000000
                            );

                            if (minutes < 1) {
                              return "just now";
                            } else if (minutes < 60) {
                              return `${minutes} mins ago`;
                            } else if (hours < 24) {
                              return `${hours} hours ago`;
                            } else if (days < 7) {
                              return `${days} days ago`;
                            } else if (weeks < 52) {
                              return `${weeks} weeks ago`;
                            } else {
                              return `${years} years ago`;
                            }
                          })()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* SECOND COMMENT OPTIONS  */}

          
        </div>
      </div>
      <div
        className="share-clicked"
        style={
          shareClicked === true ? { display: "block" } : { display: "none" }
        }
      >
        <Share />
      </div>

      {/* SIGNUP/SIGNIN  */}

      <div
        className={
          theme ? "auth-popup" : "auth-popup light-mode text-light-mode"
        }
        style={
          isbtnClicked === true ? { display: "block" } : { display: "none" }
        }
      >
        <ClearRoundedIcon
          onClick={() => {
            if (isbtnClicked === false) {
              setisbtnClicked(true);
            } else {
              setisbtnClicked(false);
              document.body.classList.remove("bg-css");
            }
          }}
          className="cancel"
          fontSize="large"
          style={{ color: "gray" }}
        />
        <div
          className="signup-last"
          style={
            isSwitch === false ? { display: "block" } : { display: "none" }
          }
        >
          <Signup />
          <div className="already">
            <p>Already have an account?</p>
            <p
              onClick={() => {
                if (isSwitch === false) {
                  setisSwitched(true);
                } else {
                  setisSwitched(false);
                }
              }}
            >
              Signin
            </p>
          </div>
        </div>
        <div
          className="signin-last"
          style={isSwitch === true ? { display: "block" } : { display: "none" }}
        >
          <Signin />
          <div className="already">
            <p>Don&apos;t have an account?</p>
            <p
              onClick={() => {
                if (isSwitch === false) {
                  setisSwitched(true);
                } else {
                  setisSwitched(false);
                }
              }}
            >
              Signup
            </p>
          </div>
        </div>
      </div>

      {/* PLAYLIST POPUP */}

      <div
        className={
          theme ? "playlist-pop" : "playlist-pop light-mode text-light-mode"
        }
        style={{
          minHeight: createPlaylistClicked === false ? "262px" : "420px",
          display: playlistClicked === true ? "block" : "none",
          width:
            UserPlaylist && !UserPlaylist.includes("No playlists available...")
              ? "270px"
              : "270px",
        }}
      >
        <div className="this-top-section">
          <p>Save video to...</p>
          <ClearRoundedIcon
            className="close-playlist-pop"
            fontSize="medium"
            style={{ color: theme ? "white" : "black", cursor: "pointer" }}
            onClick={() => {
              setPlaylistClicked(false);
              setcreatePlaylistClicked(false);
              document.body.classList.remove("bg-css");
            }}
          />
        </div>
        <div
          className="this-middle-section"
          style={
            createPlaylistClicked === true ? { top: "38%" } : { top: "50%" }
          }
        >
          {!UserPlaylist ||
            UserPlaylist.includes("No playlists available...") ? (
            <p>No Playlists available...</p>
          ) : (
            ""
          )}
        </div>
        <div className="this-middle-section2">
          <div className="show-playlists">
            {UserPlaylist &&
              !UserPlaylist.includes("No playlists available...") &&
              UserPlaylist.map((element, index) => {
                return (
                  <div className="all-playlists" key={index}>
                    {(playlistID &&
                      playlistID.length > 0 &&
                      playlistID.includes(element._id) === false) ||
                      playlistID === "Video doesn't exist in any playlist" ? (
                      <CheckBoxOutlineBlankIcon
                        className="tick-box"
                        fontSize="medium"
                        style={{ color: theme ? "white" : "black" }}
                        onClick={() => {
                          AddVideoToExistingPlaylist(element._id);
                        }}
                      />
                    ) : (
                      <CheckBoxIcon
                        className="tick-box"
                        fontSize="medium"
                        style={{ color: theme ? "white" : "black" }}
                        onClick={() => RemoveVideo(element._id)}
                      />
                    )}
                    {element.playlist_name.length <= 16
                      ? element.playlist_name
                      : `${element.playlist_name.slice(0, 16)}..`}
                    {element.playlist_privacy === "Public" ? (
                      <PublicOutlinedIcon
                        className="new-privacy"
                        fontSize="medium"
                        style={{ color: theme ? "white" : "black" }}
                      />
                    ) : (
                      ""
                    )}
                    {element.playlist_privacy === "Private" ? (
                      <LockOutlinedIcon
                        className="new-privacy"
                        fontSize="medium"
                        style={{ color: theme ? "white" : "black" }}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                );
              })}
          </div>
        </div>
        <div
          className="this-bottom-section"
          onClick={() => {
            if (createPlaylistClicked === false) {
              setcreatePlaylistClicked(true);
            }
          }}
          style={
            createPlaylistClicked === false
              ? { display: "flex" }
              : { display: "none" }
          }
        >
          <AddToPhotosOutlinedIcon
            fontSize="medium"
            style={{ color: theme ? "white" : "black" }}
          />
          <p style={{ marginLeft: "12px" }}>Create new playlist</p>
        </div>
        <div
          className="create-playlist-section"
          style={
            createPlaylistClicked === true
              ? { display: "block" }
              : { display: "none" }
          }
        >
          <div className="first-que">
            <p>Name</p>
            <input
              type="text"
              name="playlist_name"
              className={
                theme
                  ? "playlist-name"
                  : "playlist-name playlist-name-light light-mode text-light-mode"
              }
              placeholder="Enter playlist name..."
              value={playlistName}
              onChange={(e) => {
                setPlaylistName(e.target.value);
              }}
            />
          </div>
          <div className="second-que">
            <p>Privacy</p>
            <div
              className="combine2"
              onClick={() => {
                if (privacyClicked === false) {
                  setprivacyClicked(true);
                }
              }}
            >
              <p>{privacy}</p>
              <hr className="bottom-line" />
            </div>
          </div>
          <div
            className={
              theme
                ? "choose-privacy"
                : "choose-privacy light-mode text-light-mode"
            }
            style={
              privacyClicked === true
                ? { display: "block" }
                : { display: "none" }
            }
          >
            <div
              className={
                theme ? "first-privacy" : "first-privacy feature-light"
              }
              onClick={() => {
                setPrivacy("Public");
                setprivacyClicked(false);
              }}
            >
              <PublicOutlinedIcon
                fontSize="medium"
                style={{ color: theme ? "white" : "black" }}
              />
              <div className="right-privacy">
                <p>Public</p>
                <p className={theme ? "" : "text-light-mode2"}>
                  Anyone can view
                </p>
              </div>
            </div>
            <div
              className={
                theme ? "second-privacy" : "second-privacy feature-light"
              }
              onClick={() => {
                setPrivacy("Private");
                setprivacyClicked(false);
              }}
            >
              <LockOutlinedIcon
                fontSize="medium"
                style={{ color: theme ? "white" : "black" }}
              />
              <div className="right-privacy">
                <p>Private</p>
                <p className={theme ? "" : "text-light-mode2"}>
                  Only you can view
                </p>
              </div>
            </div>
          </div>
          <div
            className="playlist-create-btn"
            style={
              loading === true
                ? { pointerEvents: "none" }
                : { pointerEvents: "auto" }
            }
            onClick={() => {
              if (playlistName !== "" || privacy !== "") {
                AddPlaylist();
              } else {
                alert("Input fileds can't be empty");
              }
            }}
          >
            {loading === true ? <p>Loading...</p> : <p>Create</p>}
          </div>
        </div>
      </div>
    </>
  );
}

export default VideoSection;
