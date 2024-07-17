import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GameStateService } from 'src/services/game-state.service';


interface GameConfig {
  genre: string;
  difficulty: string;
  rounds: number;
}

@Component({
  selector: "app-results",
  templateUrl: "./results.component.html",
  styleUrls: ["./results.component.css"],
})
export class ResultsComponent implements OnInit {
  points: number = 0;
  correctAnswers: number = 0;
  totalQuestions: number = 0;

  score: number = 10000;
  correctCount: number = 10;
  totalCount: number = 10;

  difficulty: string = '';
  private configSubscription: Subscription | undefined;

  constructor(private router: Router, private gameService: GameStateService) { }

  ngOnInit(): void {
    this.configSubscription = this.gameService.config$.subscribe((config: GameConfig) => {
      this.difficulty = config.difficulty;
    });
  }

  ngOnDestroy(): void {
    if (this.configSubscription) {
      this.configSubscription.unsubscribe();
    }
  }

  saveScoreToLocalStorage(name: string, score: number): void {
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '{}');

    if (!leaderboard.easy) leaderboard.easy = [];
    if (!leaderboard.normal) leaderboard.normal = [];
    if (!leaderboard.hard) leaderboard.hard = [];

    leaderboard[this.difficulty].push({ playerName: name, playerScore: score });
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    this.router.navigateByUrl("");
  }
}
