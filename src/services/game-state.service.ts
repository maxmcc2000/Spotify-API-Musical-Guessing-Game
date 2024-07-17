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
  correctAnswers: number;
}

@Injectable({
  providedIn: "root",
})
export class GameStateService {
  private initialConfig: GameConfig = {
    genre: "",
    difficulty: "",
    rounds: 0,
  };

  private initialState: GameState = {
    currentRound: 0,
    currentScore: 0,
    currentSong: null,
    correctAnswers: 0,
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

  getGameState() {
    return this.stateSubject;
  }

  getCurrentScore() {
    return this.stateSubject.value.currentScore;
  }

  getNumberCorrectAnswers() {
    return this.stateSubject.value.correctAnswers;
  }

  getTotalQuestions() {
    return this.configSubject.value.rounds;
  }

  getDifficulty() {
    return this.configSubject.value.difficulty;
  }
}
