import "./App.css";
import ListSong from "components/listSong";
import songList from 'data/music/music.json';

function App() {
  return (
    <div className="App">
      <ListSong items={songList} />
    </div>
  );
}

export default App;
