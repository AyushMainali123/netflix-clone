import React, { useState, useEffect } from "react";
import axios from "./axios";
import "./Row.css";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";
// import SwiperCore, { Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import "swiper/";
const base_url = "https://image.tmdb.org/t/p/original";

// SwiperCore.use([Navigation, Pagination]);

const onReady = (event) => {
  // access to player in all event handlers via event.target
  event.target.pauseVideo();
};

const opts = {
  height: "390",
  width: "100%",
  playerVars: {
    autoplay: 1,
  },
};

const Row = ({ title, fetchUrl, isLargeRow }) => {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
      return request;
    };
    fetchData();
  }, [fetchUrl]);

  const handleCLick = (movie) => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      movieTrailer(movie?.name || "")
        .then((url) => {
          const urlParams = new URLSearchParams(new URL(url).search);
          setTrailerUrl(urlParams.get("v"));
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <div className="row">
      <h2>{title}</h2>
      <div className="row__posters">
        <Swiper
          tag="section"
          wrapperTag="ul"
          direction="horizontal"
          loop={true}
          slidesPerView={Math.floor(window.screen.width / 150)}
        >
          {movies.map((movie) => (
            <SwiperSlide key={`${movie.id}`} tag="li">
              <img
                onClick={() => handleCLick(movie)}
                className={`row__poster ${
                  isLargeRow && "row__posterLarge"
                } swiper-slide`}
                src={`${base_url}${
                  isLargeRow ? movie.poster_path : movie.backdrop_path
                }`}
                alt={movie.name}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      {trailerUrl && (
        <YouTube videoId={trailerUrl} opts={opts} onReady={onReady} />
      )}
    </div>
  );
};

export default Row;
