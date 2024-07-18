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
  Finished
}

const clientId = "7e9cf50af43c43f2bb33a2f1eefe04f9";
const clientSecret = "8679164a112947fcb74bc11143c47fd5";
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
  choiceOptions: string[] = ['choice 1', 'choice 2', 'choice 3', 'choice 4'];
  randomChoices: string[] = [];

  constructor(private router: Router, private gameService: GameStateService) {}

  ngOnInit(): void {
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

    console.log(this.choiceOptions);
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
    this.songPreviews.forEach((song) => this.randomChoices.push(song["name"]));
    for (let i = 0; i < this.rounds; i++) {
      let randomIndex = Math.floor(
        Math.random() * this.songPreviews.length + 1
      );
      this.gameSongs[i] = this.songPreviews[randomIndex];
    }
    this.initializeHowls();
  }

  initializeHowls(): void {
    this.gameSongs.forEach((song) => {
      const howl = new Howl({
        src: [song["preview_url"]],
        html5: true,
        onend: () => this.onSongEnd()
      });
      this.howls.push(howl);
    });
    console.log("howls initialized");
    this.populateChoices();
  }

  cleanSongName(songName: string): string {
    return songName.split(/[/[\/\-\(\?]/)[0].trim();
  }

  playSong() {
    this.howls[this.currentRound].play();
    this.playbackState = PlaybackState.Playing;
    console.log("should be playing");
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
        return '../../../assets/pauseButton.svg';
      case PlaybackState.Paused:
        return '../../../assets/playButton.svg';
      case PlaybackState.Finished:
        return '../../../assets/replayButton.svg';
      default:
        return '../../../assets/playButton.svg';
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
    if (this.gameSongs[this.currentRound].name.toLowerCase().replace(/'/g, '') === guessedSong.toLowerCase().replace(/'/g, '')) {
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
    this.router.navigateByUrl("results");
  }
}
