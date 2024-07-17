import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { GameStateService } from "src/services/game-state.service";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.css"],
})
export class SettingsComponent implements OnInit {
  genres: string[] = [
    "rock",
    "rap",
    "pop",
    "country",
    "hip-hop",
    "jazz",
    "alternative",
    "j-pop",
    "k-pop",
    "emo",
  ];
  difficulties: string[] = ["Easy", "Medium", "Hard"];
  rounds: number[] = [1, 5, 10, 15, 20];

  config = {
    genre: this.genres[0],
    difficulty: this.difficulties[1],
    rounds: this.rounds[0],
  };

  constructor(private gameStateService: GameStateService) {}

  ngOnInit(): void {
    this.gameStateService.config$.subscribe((config) => {
      if (config) {
        this.config = { ...config };
      }
    });
  }

  saveSettings() {
    this.gameStateService.updateConfig(this.config);
  }
}
