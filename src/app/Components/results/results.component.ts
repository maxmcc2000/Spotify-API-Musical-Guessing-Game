import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  score: number = 0;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  saveScoreToLocalStorage(name: string, score: string): void {
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
    leaderboard.push({ playerName: name, playerScore: score });
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    this.router.navigateByUrl("");
  }
  

}
