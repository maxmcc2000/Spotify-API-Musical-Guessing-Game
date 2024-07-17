import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

interface GameConfig {
  genre: string;
  difficulty: string;
  rounds: number;
}

interface GameState {
  currentRound: number;
  currentScore: number;
  currentSong: string | null;
}

@Injectable({
  providedIn: "root",
})
export class GameStateService {
  private initialConfig: GameConfig = {
    genre: "Pop",
    difficulty: "Medium",
    rounds: 5,
  };

  private initialState: GameState = {
    currentRound: 0,
    currentScore: 0,
    currentSong: null,
  };

  private configSubject = new BehaviorSubject<GameConfig>(this.initialConfig);
  private stateSubject = new BehaviorSubject<GameState>(this.initialState);

  config$ = this.configSubject.asObservable();
  state$ = this.stateSubject.asObservable();

  constructor() {}

  updateConfig(newConfig: GameConfig) {
    this.configSubject.next(newConfig);
    console.log(newConfig);
  }

  //Method to update the player's score, round, and current song
  updateGameState(newState: GameState) {
    this.stateSubject.next(newState);
  }
}
