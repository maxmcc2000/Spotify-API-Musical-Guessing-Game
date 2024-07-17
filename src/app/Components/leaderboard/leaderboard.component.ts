import { Component, OnInit } from "@angular/core";

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
  leaderboard: playerInfo[] = [
    { playerName: "harry", playerScore: 3000, playerRank: 0 },
    { playerName: "john", playerScore: 2000, playerRank: 0 },
    { playerName: "larry", playerScore: 4000, playerRank: 0 },
    { playerName: "barry", playerScore: 4000, playerRank: 0 },
  ];

<<<<<<< HEAD
  leaderboard: playerInfo[] = [];
  selected: string = '';

  constructor() { }
=======
  constructor() {}
>>>>>>> 6ea59544e7ae0ab94c193fcb04475ff28b2037e2

  ngOnInit(): void {
    this.loadLeaderboard('normal');
  }

  sortLeaderboard(): void {
    this.leaderboard.sort((a, b) => b.playerScore - a.playerScore);

<<<<<<< HEAD
  loadLeaderboard(difficulty: string): void {
    this.selected = difficulty;
    const leaderboardData = localStorage.getItem('leaderboard');
    if (leaderboardData) {
      this.leaderboard = JSON.parse(leaderboardData)[difficulty];
      this.sortLeaderboard();
=======
    // Sets the ranking for each player
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
>>>>>>> 6ea59544e7ae0ab94c193fcb04475ff28b2037e2
    }
  }

  loadLeaderboard(): void {
    const leaderboardData = localStorage.getItem("leaderboard");
    if (leaderboardData) {
      this.leaderboard = JSON.parse(leaderboardData);
    }
    this.sortLeaderboard();
  }
}
