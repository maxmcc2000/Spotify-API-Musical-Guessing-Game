import { Component, OnInit } from "@angular/core";
import { GameStateService } from "src/services/game-state.service";

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.css"],
})
export class GameComponent implements OnInit {
  constructor(private gameStateService: GameStateService) {}

  ngOnInit(): void {}
}
