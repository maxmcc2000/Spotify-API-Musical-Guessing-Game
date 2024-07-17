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

const clientId = '5ed7e77c36ab4ad3881c3861b63b91a9';
const clientSecret = 'a5757766312243e5b5a714ba98333fa3';
const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  private configSubscription: Subscription | undefined;

  rounds: number = 0;
  currentRound: number = 0;
  genre: string = '';
  token: string = '';
  songPreviews: string[] = [];
  howls: Howl[] = [];
  loading: boolean = true;


  constructor(private router: Router, private gameService: GameStateService) { }

  ngOnInit(): void {
    this.configSubscription = this.gameService.config$.subscribe((config: GameConfig) => {
      this.rounds = config.rounds;
      this.genre = config.genre;
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

  async getAllSongs() {
    // console.log('Loading...');
    // for (let i = 0; this.songPreviews.length < this.rounds; i++) {
    //   let song = await this.pullRandomSong();
    //   if (song['preview_url'] !== null && song['explicit'] === false) {
    //     this.songPreviews.push(song['preview_url']);
    //   }
    // }
    // console.log(this.songPreviews);
    // this.loading = false;
    // this.initializeHowls();
  }

  async pullRandomSong() {
    const params = {
      seed_genres: this.genre,
      limit: 40,
      market: 'US'
    }
    const endpoint = 'recommendations';

    const response = await fetchFromSpotify({token: this.token, endpoint, params});

    if (response && response.tracks && response.tracks.length > 0) {
      const songList = response.tracks;
      this.songPreviews = songList;
    }
  }

  initializeHowls(): void {
    this.songPreviews.forEach(url => {
      const howl = new Howl({
        src: [url],
        html5: true
      });
      this.howls.push(howl);
    });
  }

  playSong(index: number) {
    if (index >= 0 && index < this.howls.length) {
      this.howls[index].play();
    }
  }

  checkAnswer() {
    this.currentRound = this.currentRound+=1;
  }

  completeGame() {
    this.router.navigateByUrl('results');
  }

}
