import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";

import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { HeaderComponent } from './Components/header/header.component';
import { SettingsComponent } from './Components/settings/settings.component';
import { LeaderboardComponent } from './Components/leaderboard/leaderboard.component';
import { GameComponent } from './Components/game/game.component';
import { ResultsComponent } from './Components/results/results.component';
import { ResultComponent } from './Components/result/result.component';

const routes: Routes = [
    {path: "", component: HomeComponent},
    {path: "settings", component: SettingsComponent},
    {path: "game", component: GameComponent},
    {path: "leaderboard", component: LeaderboardComponent},
    {path: "results", component: ResultsComponent}
 ];

@NgModule({
  declarations: [AppComponent, HomeComponent, HeaderComponent, SettingsComponent, LeaderboardComponent, GameComponent, ResultsComponent, ResultComponent],
  imports: [BrowserModule, FormsModule, RouterModule.forRoot(routes)],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
