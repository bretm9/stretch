import { cleanGenreTrackData, Playlist, AlbumTrack, randomizeSongs } from './utils/utils'

const apiUrl = `https://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=`;

export const getGenres = () => {
  return (
    fetch('https://binaryjazz.us/wp-json/genrenator/v1/genre/25')
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw Error
        }
      })
      .catch(() => 'error')
  )
}

export const getPlaylist = (genreArray: string[]): Promise<any> => {
  return (
    Promise.all(
      genreArray.map(genre => {
        return fetch(`${apiUrl}${genre}&api_key=${process.env.REACT_APP_LASTFM_APIKEY}&limit=100&format=json`)
          .then(response => {
            if(response.ok) {
              return response.json()
            } else {
              throw Error
            }
          })
      })
    )
    .then(data => {
      const combinedPlaylist: Playlist = {
        id: Date.now(),
        name: genreArray.join(" "),
        isSaved: false,
        tracks: data.flatMap(playlist => {
          return playlist.tracks.track.map((song: AlbumTrack) => {
            return cleanGenreTrackData(song);
          });
        })
      }
      const randomPlaylist = randomizeSongs(combinedPlaylist);
      combinedPlaylist.tracks = randomPlaylist.filter((_playlist, index) => index < 15);
      return combinedPlaylist;
    })
    .catch(() => 'error')
  )
}