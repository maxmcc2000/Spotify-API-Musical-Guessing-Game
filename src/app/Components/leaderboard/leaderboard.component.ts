import { Component, OnInit } from '@angular/core';

interface playerInfo {
  playerName: string,
  playerScore: number
}

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {

  leaderboard: playerInfo[] = [];

  constructor() { }

  ngOnInit(): void {
    this.loadLeaderboard();
  }

  sortLeaderboard(): void {
    this.leaderboard.sort((a, b) => b.playerScore - a.playerScore);
  }

  loadLeaderboard(): void {
    const leaderboardData = localStorage.getItem('leaderboard');
    if (leaderboardData) {
      this.leaderboard = JSON.parse(leaderboardData);
      this.sortLeaderboard();
    }
  }

}
