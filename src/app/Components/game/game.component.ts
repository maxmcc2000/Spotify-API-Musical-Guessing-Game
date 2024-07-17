import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GameStateService } from 'src/services/game-state.service';
import { Buffer }  from "buffer";
import { Howl, Howler } from "howler";
import fetchFromSpotify from 'src/services/api';

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

const clientId = '94cebb94925e4acf87b17551e9280009';
const clientSecret = '31a321fb362f463e8ed18d2b9099e2ac';
const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.css"],
})
export class GameComponent implements OnInit {

  private configSubscription: Subscription | undefined;

  rounds: number = 0;
  currentRound: number = 0;
  genre: string = '';
  numberOfOptions: number = 0;

  token: string = '';

  songPreviews: [] = [];
  howls: Howl[] = [];

  loading: boolean = true;

  gameSongs: SongInfo[] = [];
  choiceOptions: string[] = [];
  randomChoices: string[] = [];


  constructor(private router: Router, private gameService: GameStateService) { }

  ngOnInit(): void {
    this.configSubscription = this.gameService.config$.subscribe((config: GameConfig) => {
      this.rounds = config.rounds;
      this.genre = config.genre;
      switch (config.difficulty) {
        case 'easy':
          this.numberOfOptions = 2;
          break;
        case 'normal':
          this.numberOfOptions = 4;
          break;
        case 'hard':
          this.numberOfOptions = 0;
          break;
        default:
          break;
      }
    });
    this.getAccessToken();
  }

  getAccessToken = async () => {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${credentials}`,
      },
      body: 'grant_type=client_credentials',
    });

    const data = await response.json();
    this.token =  data.access_token;
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
      market: 'US'
    }
    const endpoint = 'recommendations';

    const response = await fetchFromSpotify({token: this.token, endpoint, params});

    if (response && response.tracks && response.tracks.length > 0) {
      this.songPreviews = response.tracks.filter((song: SongInfo) => {
        return song.preview_url !== null && song.explicit === false
      });
    }
    this.songPreviews.forEach((song) => this.randomChoices.push(song['name']));
    for (let i = 0; i < this.rounds; i++) {
      let randomIndex = Math.floor((Math.random() * this.songPreviews.length) + 1);
      this.gameSongs[i] = this.songPreviews[randomIndex];
    }
    this.initializeHowls();
  }

  initializeHowls(): void {
    this.gameSongs.forEach(song => {
      const howl = new Howl({
        src: [song['preview_url']],
        html5: true
      });
      this.howls.push(howl);
    });
    console.log('howls initialized');
    this.populateChoices();
  }

  playSong() {
      this.howls[this.currentRound].play();
      console.log('should be playing');
  }

  checkAnswer(guessedSong: string) {
    this.howls[this.currentRound].fade(1, 0, 200);
    if (this.gameSongs[this.currentRound].name === guessedSong) {
      console.log("Correct!");
    } else {
      console.log("Not Quite.");
    }
    this.currentRound = this.currentRound+=1;
    if (this.currentRound >= this.rounds) {
      this.completeGame();
      return;
    }
    this.populateChoices();
  }

  completeGame() {
    this.router.navigateByUrl('results');
  }

}
