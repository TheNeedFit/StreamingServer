import React from "react";
import "../Css/firstpage.css";
import "react-loading-skeleton/dist/skeleton.css";
import "../Css/theme.css";

const FirstPage = () => {
    return (
        <body>
            <div id="videoMetadataContainer"></div>
            <div className="container">
                <img
                    className="background-image"
                    src="public/assets/home.svg"
                    alt="Wave background"
                />
                <nav id="menu">
                    <a href="/main" title="Logo">
                        <img
                            className="logo"
                            src="public/assets/media.svg"
                            alt="Logo"
                        />
                    </a>
                </nav>
                <h1>Video Streaming Server</h1>
                <div className="links">
                    <a href="https://video-streaming-kle.vercel.app/home" target="_blank" rel="noopener noreferrer">
                        Home
                    </a>
                </div>
            </div>
        </body>
    );
};

export default FirstPage;
