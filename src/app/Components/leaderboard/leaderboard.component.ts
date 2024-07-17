import { Component, OnInit } from "@angular/core";
import { GameStateService } from "src/services/game-state.service";

interface playerInfo {
  playerName: string;
  playerScore: number;
  playerRank: number;
}

@Component({
  selector: "app-leaderboard",
  templateUrl: "./leaderboard.component.html",
  styleUrls: ["./leaderboard.component.css"],
})
export class LeaderboardComponent implements OnInit {
  leaderboard: playerInfo[] = [];
  selected: string = "";

  constructor() {}

  ngOnInit(): void {
    this.loadLeaderboard("normal");
  }

  sortLeaderboard(): void {
    this.leaderboard.sort((a, b) => b.playerScore - a.playerScore);

    //Sets the ranking for each player
    let rank = 1;
    let previousScore = null;
    let previousRank = 1;

    for (let i = 0; i < this.leaderboard.length; i++) {
      if (this.leaderboard[i].playerScore === previousScore) {
        this.leaderboard[i].playerRank = previousRank;
      } else {
        this.leaderboard[i].playerRank = rank;
        previousRank = rank;
      }
      previousScore = this.leaderboard[i].playerScore;
      rank++;
    }
  }

  loadLeaderboard(difficulty: string): void {
    this.selected = difficulty;
    const leaderboardData = localStorage.getItem("leaderboard");
    if (leaderboardData) {
      this.leaderboard = JSON.parse(leaderboardData)[difficulty];
    }
    this.sortLeaderboard();
  }
}
