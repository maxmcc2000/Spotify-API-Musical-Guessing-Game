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
  selected: string = '';

  constructor() { }

  ngOnInit(): void {
    this.loadLeaderboard('normal');
  }

  sortLeaderboard(): void {
    this.leaderboard.sort((a, b) => b.playerScore - a.playerScore);
  }

  loadLeaderboard(difficulty: string): void {
    this.selected = difficulty;
    const leaderboardData = localStorage.getItem('leaderboard');
    if (leaderboardData) {
      this.leaderboard = JSON.parse(leaderboardData)[difficulty];
      this.sortLeaderboard();
    }
  }

}
