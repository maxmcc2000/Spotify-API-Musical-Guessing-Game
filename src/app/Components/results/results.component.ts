<<<<<<< HEAD
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GameStateService } from 'src/services/game-state.service';


interface GameConfig {
  genre: string;
  difficulty: string;
  rounds: number;
}
=======
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { GameStateService } from "src/services/game-state.service";
>>>>>>> 6ea59544e7ae0ab94c193fcb04475ff28b2037e2

@Component({
  selector: "app-results",
  templateUrl: "./results.component.html",
  styleUrls: ["./results.component.css"],
})
export class ResultsComponent implements OnInit {
  points: number = 0;
  correctAnswers: number = 0;
  totalQuestions: number = 0;

<<<<<<< HEAD
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
=======
  constructor(
    private router: Router,
    private gameStateService: GameStateService
  ) {}

  ngOnInit(): void {
    this.points = this.gameStateService.getCurrentScore();
    this.correctAnswers = this.gameStateService.getNumberCorrectAnswers();
    this.totalQuestions = this.gameStateService.getTotalQuestions();
  }

  saveScoreToLocalStorage(name: string, points: string): void {
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard") || "[]");
    leaderboard.push({ playerName: name, playerScore: points });
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
>>>>>>> 6ea59544e7ae0ab94c193fcb04475ff28b2037e2
    this.router.navigateByUrl("");
  }
}
