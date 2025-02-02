import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { GameStateService } from "src/services/game-state.service";
import { Buffer } from "buffer";
import { Howl, Howler } from "howler";
import fetchFromSpotify from "src/services/api";

interface GameConfig {
  genre: string;
  difficulty: string;
  rounds: number;
}

interface SongInfo {
  artists: string;
  explicit: boolean;
  name: string;
  preview_url: string;
}

interface GameState {
  currentRound: number;
  currentScore: number;
  correctAnswers: number;
}

enum PlaybackState {
  Paused,
  Playing,
  Finished,
}

const clientId = "5ed7e77c36ab4ad3881c3861b63b91a9";
const clientSecret = "a5757766312243e5b5a714ba98333fa3";
const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
  "base64"
);

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.css"],
})
export class GameComponent implements OnInit {
  private configSubscription: Subscription | undefined;
  private playbackState: PlaybackState | undefined;
  private audioSubscription: Subscription = new Subscription();
  private gameOver: boolean = false;

  gameState: GameState = {
    currentRound: 1,
    currentScore: 0,
    correctAnswers: 0,
  };

  rounds: number = 0;
  currentRound: number = 0;
  genre: string = "";
  numberOfOptions: number = 0;

  token: string = "";

  songPreviews: [] = [];
  howls: Howl[] = [];

  loading: boolean = true;

  gameSongs: SongInfo[] = [];
  choiceOptions: string[] = [];
  randomChoices: string[] = [];

  constructor(private router: Router, private gameService: GameStateService) {}

  ngOnInit(): void {
    this.loading = true;
    this.configSubscription = this.gameService.config$.subscribe(
      (config: GameConfig) => {
        this.rounds = config.rounds;
        this.genre = config.genre;
        switch (config.difficulty) {
          case "easy":
            this.numberOfOptions = 2;
            break;
          case "normal":
            this.numberOfOptions = 4;
            break;
          case "hard":
            this.numberOfOptions = 0;
            break;
          default:
            break;
        }
      }
    );
    this.getAccessToken();
    this.gameService.updateGameState(this.gameState);

    // Stops playing song when a button on the header is clicked (Home or Leaderboard)
    this.audioSubscription = this.gameService.stopAudio$.subscribe(() => {
      this.pauseSong();
    });
  }

  ngOnDestroy(): void {
    if (this.configSubscription) {
      this.configSubscription.unsubscribe();
    }
    if (this.audioSubscription) {
      this.audioSubscription.unsubscribe();
    }
    if (!this.gameOver) {
      this.pauseSong(); // Ensure audio stops when component is destroyed
    }
  }

  getAccessToken = async () => {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${credentials}`,
      },
      body: "grant_type=client_credentials",
    });

    const data = await response.json();
    this.token = data.access_token;
    this.pullRandomSong();
  };

  populateChoices() {
    this.choiceOptions = [];
    for (let i = 0; i < this.numberOfOptions - 1; i++) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * this.randomChoices.length);
      } while (this.choiceOptions.includes(this.randomChoices[randomIndex]));

      this.choiceOptions[i] = this.randomChoices[randomIndex];
    }
    this.choiceOptions.push(this.gameSongs[this.currentRound].name);
    this.shuffleChoices(this.choiceOptions);
    this.loading = false;
  }

  shuffleChoices(songs: string[]) {
    for (let i = songs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [songs[i], songs[j]] = [songs[j], songs[i]];
    }
    return songs;
  }

  async pullRandomSong() {
    const params = {
      seed_genres: this.genre,
      limit: 100,
      market: "US",
    };
    const endpoint = "recommendations";

    const response = await fetchFromSpotify({
      token: this.token,
      endpoint,
      params,
    });

    if (response && response.tracks && response.tracks.length > 0) {
      this.songPreviews = response.tracks.filter((song: SongInfo) => {
        song.name = this.cleanSongName(song.name);
        return song.preview_url !== null && song.explicit === false;
      });
    }
    const tempPreviews = [...this.songPreviews];
    for (let i = 0; i < this.rounds; i++) {
      let randomIndex = Math.floor(Math.random() * tempPreviews.length);
      this.gameSongs[i] = tempPreviews[randomIndex];
      tempPreviews.splice(randomIndex, 1);
    }
    tempPreviews.forEach((song) => this.randomChoices.push(song["name"]));
    this.initializeHowls();
  }

  initializeHowls(): void {
    this.gameSongs.forEach((song) => {
      const howl = new Howl({
        src: [song["preview_url"]],
        html5: true,
        onend: () => this.onSongEnd(),
      });
      this.howls.push(howl);
    });
    this.populateChoices();
  }

  cleanSongName(songName: string): string {
    return songName.split(/[/[\/\-\(\?]/)[0].trim();
  }

  playSong() {
    this.howls[this.currentRound].play();
    this.playbackState = PlaybackState.Playing;
  }

  pauseSong() {
    this.howls[this.currentRound].pause();
    this.playbackState = PlaybackState.Paused;
  }

  onSongEnd() {
    this.playbackState = PlaybackState.Finished;
  }

  getPlayPauseIcon(): string {
    switch (this.playbackState) {
      case PlaybackState.Playing:
        return "../../../assets/pauseButton.svg";
      case PlaybackState.Paused:
        return "../../../assets/playButton.svg";
      case PlaybackState.Finished:
        return "../../../assets/replayButton.svg";
      default:
        return "../../../assets/playButton.svg";
    }
  }

  togglePlayPause(): void {
    if (this.playbackState === PlaybackState.Playing) {
      this.pauseSong();
    } else {
      this.playSong();
    }
  }

  checkAnswer(guessedSong: string) {
    this.playbackState = PlaybackState.Paused;
    this.howls[this.currentRound].unload();
    if (
      this.gameSongs[this.currentRound].name.toLowerCase().replace(/'/g, "") ===
      guessedSong.toLowerCase().replace(/'/g, "")
    ) {
      console.log("Correct!");
      this.gameState.currentScore += 1000;
      this.gameState.correctAnswers += 1;
    } else {
      console.log("Not Quite.");
    }
    this.currentRound = this.currentRound += 1;
    this.gameState.currentRound += 1;
    if (this.currentRound >= this.rounds) {
      this.completeGame();
      return;
    }
    this.gameService.updateGameState(this.gameState);
    console.log(this.gameService.getGameState());
    this.populateChoices();
  }

  completeGame() {
    this.gameOver = true;
    this.router.navigateByUrl("results");
  }
}
