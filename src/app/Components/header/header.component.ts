import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { GameStateService } from "src/services/game-state.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  currentUrl: string = "";

  navigate(url: string) {
    this.gameService.triggerStopAudio();
    this.router.navigateByUrl(url);
  }

  constructor(private router: Router, private gameService: GameStateService) {}
  ngOnInit(): void {
    this.currentUrl = this.router.url;
  }
}
