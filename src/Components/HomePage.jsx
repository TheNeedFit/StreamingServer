import React from "react";

const HomePage = () => {
  return (

    <div className="container" style={{
      width: "100%",
      height: "100%",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundImage: "url('/assets/home.svg')",
      backgroundColor: "#222",
    }}>
        
      <img
        className="background-image"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: -1,
        }}
        src="public/assets/home.svg"
        alt="Wave background"
      />
      <nav id="menu" style={{
        backgroundColor: "#ffffff",
        height: "45px",
        borderRadius: "10px",
        margin: "15px auto 0",
        fontWeight: "500",
      }}>
        <a href="/main" title="Logo" style={{
          position: "absolute",
          top: "7px",
          left: "50px",
        }}>
          <img
            className="logo"
            style={{
              height: "55px",
            }}
            src="public/assets/media.svg"
            alt="Logo"
          />
        </a>
      </nav>
      <center>
      <h1 style={{
        color: "#000",
        marginTop: "215px",
        fontSize: "50px",
        marginRight: "500px",
        fontWeight: "bold",
      }}>Video Streaming Server</h1>
      <div className="links" style={{
        marginTop: "20px",
        textAlign: "center",
      }}>
        <a href="https://video-streaming-kle.vercel.app/home" target="_blank" rel="noopener noreferrer" style={{
          display: "inline-block",
          padding: "10px 20px",
          margin: "0 10px",
          marginRight: "500px",

          textDecoration: "none",
          color: "#ffffff",
          backgroundColor: "#0066FF",
          borderRadius: "5px",
          boxShadow: "inset 0 0 0 0 #0066FF",
          transition: "color .4s ease-in-out, box-shadow .3s ease-in-out",
        }}>Home</a>
      </div>
      </center>
    </div>
  );
};

export default HomePage;
