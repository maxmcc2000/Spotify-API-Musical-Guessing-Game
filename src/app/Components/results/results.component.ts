import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { GameStateService } from "src/services/game-state.service";

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
  score: number = 10000;
  correctCount: number = 10;
  totalCount: number = 10;
  message: string = "Game Over";
  error: string = '';

  difficulty: string = "";
  private configSubscription: Subscription | undefined;

  constructor(private router: Router, private gameService: GameStateService) {}

  ngOnInit(): void {
    this.configSubscription = this.gameService.config$.subscribe(
      (config: GameConfig) => {
        this.difficulty = config.difficulty;
      }
    );

    //gameService will store the resulting score and number of correct answers until a new game is started
    this.score = this.gameService.getGameState().currentScore;
    this.correctCount = this.gameService.getGameState().correctAnswers;
    this.totalCount = this.gameService.getTotalQuestions();

    // Game Over Messages
    if (this.correctCount / this.totalCount === 1) {
      this.message = "You Got Them All!!!";
    }
  }

  ngOnDestroy(): void {
    if (this.configSubscription) {
      this.configSubscription.unsubscribe();
    }
  }

  navigate(url: string) {
    this.router.navigateByUrl(url);
  }

  clearErrors() {
    this.error = '';
  }

  saveScoreToLocalStorage(name: string, score: number): void {
    try {
      if (name.length >= 3) {
        let leaderboard = JSON.parse(localStorage.getItem("leaderboard") || "{}");

        if (!leaderboard.easy) leaderboard.easy = [];
        if (!leaderboard.normal) leaderboard.normal = [];
        if (!leaderboard.hard) leaderboard.hard = [];

        leaderboard[this.difficulty].push({ playerName: name, playerScore: score });
        localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
        this.router.navigateByUrl("");
      } else {
        throw new Error('Name must be at least 3 characters long');
      }
    } catch (error: any) {
      this.error = error.message;
    }
  }
}
