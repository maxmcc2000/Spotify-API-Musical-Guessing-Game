import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { GameStateService } from "src/services/game-state.service";

@Component({
  selector: "app-results",
  templateUrl: "./results.component.html",
  styleUrls: ["./results.component.css"],
})
export class ResultsComponent implements OnInit {
  points: number = 0;
  correctAnswers: number = 0;
  totalQuestions: number = 0;

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
    this.router.navigateByUrl("");
  }
}
