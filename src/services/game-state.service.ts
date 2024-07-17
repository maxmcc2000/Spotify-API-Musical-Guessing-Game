import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

interface GameConfig {
  genre: string;
  difficulty: string;
  rounds: number;
}

@Injectable({
  providedIn: "root",
})
export class GameStateService {
  private initialConfig: GameConfig = {
    genre: "pop",
    difficulty: "normal",
    rounds: 5,
  };

  private configSubject = new BehaviorSubject<GameConfig>(this.initialConfig);
  config$ = this.configSubject.asObservable();

  constructor() {}

  updateConfig(newConfig: GameConfig) {
    this.configSubject.next(newConfig);
    console.log(newConfig);
  }
}
