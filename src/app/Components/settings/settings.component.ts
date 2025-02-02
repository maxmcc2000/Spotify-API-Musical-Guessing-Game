import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { GameStateService } from "src/services/game-state.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.css"],
})
export class SettingsComponent implements OnInit {
  genres: string[] = [
    "rock",
    "pop",
    "country",
    "hip-hop",
    "jazz",
    "emo",
    "holidays",
    "movies",
  ];
  difficulties: string[] = ["easy", "normal", "hard"];
  rounds: number[] = [1, 5, 10, 15, 20];

  config = {
    genre: this.genres[0],
    difficulty: this.difficulties[1],
    rounds: this.rounds[1],
  };

  constructor(
    private gameStateService: GameStateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.gameStateService.config$.subscribe((config) => {
      if (config) {
        this.config = { ...config };
      }
    });
  }

  saveSettings() {
    this.gameStateService.updateConfig(this.config);
    this.router.navigateByUrl("game");
  }
}
