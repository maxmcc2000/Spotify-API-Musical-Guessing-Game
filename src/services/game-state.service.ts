import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

interface GameConfig {
  genre: string;
  difficulty: string;
  rounds: number;
}

interface LeaderboardEntry {
  name: string;
  score: number;
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

  private configSubject = new BehaviorSubject<GameConfig>(this.initialConfig);
  private leaderboardSubject = new BehaviorSubject<LeaderboardEntry[]>([]);

  config$ = this.configSubject.asObservable();
  leaderboard$ = this.leaderboardSubject.asObservable();

  constructor() {}

  updateConfig(newConfig: GameConfig) {
    this.configSubject.next(newConfig);
    console.log(newConfig);
  }

  /*---Leaderboard methods---*/
  addLeaderboardEntry(newEntry: LeaderboardEntry) {
    const currentLeaderboard = this.leaderboardSubject.getValue();
    this.leaderboardSubject.next([...currentLeaderboard, newEntry]);
  }

  getLeaderboard(): LeaderboardEntry[] {
    return this.leaderboardSubject.getValue();
  }
  /*--------------------------*/
}
