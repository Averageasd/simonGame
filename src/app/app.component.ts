import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { colorConstants, NUM_CELLS } from './gameConstant';
import { Cell } from './Cell';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'simonGame';
  botMovement: Cell[] = [];
  playerPattern: Cell[] = [];
  playerTurn: boolean = false;
  botTurn: boolean = true;
  displayMove: boolean = false;
  allCellsDisabled: boolean = true;
  gameFinished: boolean = false;
  gameStart: boolean = false;
  cells: Cell[] = [];
  async ngOnInit(): Promise<any> {
    this.initGameState();
  }

  private initGameState(): void {
    this.cells.push({
      id: uuidv4(),
      backgroundColor: colorConstants.RED,
      selected: false,
    });
    this.cells.push({
      id: uuidv4(),
      backgroundColor: colorConstants.YELLOW,
      selected: false,
    });
    this.cells.push({
      id: uuidv4(),
      backgroundColor: colorConstants.PURPLE,
      selected: false,
    });
    this.cells.push({
      id: uuidv4(),
      backgroundColor: colorConstants.BLUE,
      selected: false,
    });
  }

  async onGameStart(): Promise<any>{
    this.playerPattern = [];
    this.botMovement = [];
    this.gameStart = true;
    this.displayMove = false;
    await this.botMove();
  }

  generateRandomMove(): void {
    this.botMovement = [];
    for (let i = 0; i < NUM_CELLS; i++) {
      const randMove: number = Math.floor(Math.random() * NUM_CELLS);
      this.botMovement.push(this.cells[randMove]);
    }
  }

  sleep(ms: number): Promise<any> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async botMove() {
    this.botTurn = true;
    this.generateRandomMove();
    for (let i = 0; i < this.botMovement.length; i++) {
      const curMove: Cell = this.botMovement[i];
      console.log(curMove);
      curMove.selected = true;
      await this.sleep(2000);
      curMove.selected = false;
      await this.sleep(1000);
    }

    await this.sleep(1000);
    this.playerTurn = true;
    this.allCellsDisabled = false;
    this.botTurn = false;
  }

  async userClick(cellPos: number) {
    this.cells[cellPos].selected = true;
    this.playerPattern.push(this.cells[cellPos]);
    this.allCellsDisabled = true;
    await this.sleep(1000);
    this.allCellsDisabled = false;
    this.cells[cellPos].selected = false;
    if (this.playerPattern.length === NUM_CELLS) {
      this.allCellsDisabled = true;
      this.playerTurn = false;
      this.gameFinished = true;
      await this.sleep(2000);
      this.displayMove = true;
      this.gameStart = false;
    }
  }
}
