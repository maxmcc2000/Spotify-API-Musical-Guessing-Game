import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-result",
  templateUrl: "./result.component.html",
  styleUrls: ["./result.component.css"],
})
export class ResultComponent implements OnInit {
  //replaced index with playerRank
  //@Input() index: number = 0;
  @Input() playerName: string = "";
  @Input() playerScore: number = 0;
  @Input() playerRank: number = 0;

  constructor() {}

  ngOnInit(): void {}
}
