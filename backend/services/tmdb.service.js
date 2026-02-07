import axios from "axios";

const BASE_URL = "https://api.themoviedb.org/3";

export async function fetchMovieFromTMDB(industry, apiKey) {
  const params = {
    api_key: apiKey,
    sort_by: "popularity.desc",
    page: Math.floor(Math.random() * 5) + 1
  };

  if (industry === "bollywood") {
    params.with_original_language = "hi";
    params.region = "IN";
  } else {
    params.with_original_language = "en";
  }

  const res = await axios.get(`${BASE_URL}/discover/movie`, { params });
  return res.data.results;
}
