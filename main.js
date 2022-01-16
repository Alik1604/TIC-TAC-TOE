const PubSub = (() => {
    //create communication between modules
    let Events = {};

    function Subscribe(NameOfEvent,fn){
       Events[NameOfEvent] = Events[NameOfEvent] || [];
       Events[NameOfEvent].push(fn);
    }
    
    function Publish (NameOfEvent, data) {
        if (Events[NameOfEvent]) {
          Events[NameOfEvent].forEach(f => {
            f(data);
          });
        }
    }

    return {
        subscribe : Subscribe,
        publish : Publish,
        events : Events
    };
})();
//adaptirovat board pod PubSub!!!
const boardModule = (() => {
    const gamePole = document.querySelector("#game_feeld")
    const gameSquers = [];
    for (let i = 0; i < 9; i++){
        let squer = document.createElement('div');
        squer.classList.add('game_squer');
        gameSquers[i] = squer;
        gamePole.appendChild(squer);
    }
    return {
        squers : gameSquers,
    };
})();

const startEndModule = (() => {
    const startButtton = document.querySelector('#start_button');
    
    PubSub.subscribe('gameEnd',prepareNewGame);

    startButtton.addEventListener('click', () => {

        const chosePole = document.createElement('div');
        const xButton = document.createElement('button');
        const oButton = document.createElement('button');

        xButton.textContent = 'X';
        oButton.textContent = 'O';

        xButton.classList.add('choseButton');
        oButton.classList.add('choseButton');
        chosePole.classList.add('chosePole');

        chosePole.appendChild(xButton);
        chosePole.appendChild(oButton);
        startButtton.parentElement.parentElement.appendChild(chosePole);

        xButton.addEventListener('click', () => {
            chosePole.innerHTML = '';
            chosePole.remove();
            PubSub.publish('FirstPlayer','X')
            PubSub.publish('gameStart','')
        });

        oButton.addEventListener('click', () => {
            chosePole.innerHTML = '';
            chosePole.remove();
            PubSub.publish('FirstPlayer','O')
            PubSub.publish('gameStart','')
        });

        startButtton.remove();
    });

    function prepareNewGame (data) {
      document.querySelector('#result_feeld').textContent = `Winner - ${data.Winner}`;
      document.querySelector('#bF').innerHTML = '';
      const resetB = document.createElement('button');  
      resetB.textContent = 'Reset';
      resetB.classList.add('resetB');
      document.querySelector('#bF').append(resetB);
      resetB.addEventListener("click", () => {
          for(let i = 0; i < 9;i++){
            data.Arr[i].textContent = '';
          } 
          resetB.parentElement.innerHTML = '';
          resetB.remove()
          console.log(document.querySelector('#bF'))
          document.querySelector('#bF').append(startButtton);
          document.querySelector('#Player1').textContent = 'Player1';
          document.querySelector('#Player2').textContent = 'Player2';
          document.querySelector('#result_feeld').textContent = '';
      })
    }
})();

const playerModule = (() => {
    // take eye on player`s turns and start game 

    PubSub.subscribe('gameEnd', fixS)
    PubSub.subscribe('FirstPlayer',game);
    PubSub.subscribe('gameStart', gStart);
    let firstPlayer = '';
    let currentTurn = 'X';
    let resF =  document.querySelector('#result_feeld');
    function game(data) {
        if(data == 'X'){
            document.querySelector("#Player1").textContent = 'Player1 - X';
            document.querySelector("#Player2").textContent = 'Player2 - O';
            resF.textContent = 'Player1 turn';
            firstPlayer = 'X';
        }else{
            document.querySelector("#Player1").textContent = 'Player1 - O';
            document.querySelector("#Player2").textContent = 'Player2 - X';
            resF.textContent = 'Player2 turn';
            firstPlayer = 'O';
        }
    }

    function gStart(){
        boardModule.squers.forEach( squre => squre.addEventListener('click',operate))
    } 
    
    function fixS(){
        boardModule.squers.forEach( squre => squre.removeEventListener('click',operate))
    }


    function operate(squre) {

        if(squre.target.innerText == ''){
            if(currentTurn == 'X'){
                squre.target.innerText = 'X';
                currentTurn = 'O';
                if(firstPlayer == 'O'){
                    resF.textContent = 'Player1 turn';
                }else{
                    resF.textContent = 'Player2 turn';
                }
            }else{
                squre.target.innerText = 'O';
                currentTurn = 'X';
                if(firstPlayer == 'O'){
                    resF.textContent = 'Player2 turn';
                }else{
                    resF.textContent = 'Player1 turn';
                }
                
            }
        }
        PubSub.publish('WinnerChek', boardModule.squers)
    }
})();

const regulatorModule = (() => {
    //check winer and display result  
    PubSub.subscribe('WinnerChek',checkResult);
    PubSub.subscribe('FirstPlayer',saveFP);
    let FP = '';
    function saveFP(data){
        FP = data;
    }

    let checkArr = [];
    let tieCheck = 0;

    function checkResult(data) {
       for(let i = 0; i < 9; i++){
            checkArr[i] = data[i].textContent
       }
       
       for(let i = 0; i <= 6; i+=3) {
            if(checkArr[i] == checkArr[i+1] && checkArr[i+1] == checkArr[i+2] && checkArr[i+2] == checkArr[i] && checkArr[i] != ''){
                PubSub.publish('gameEnd', {Winner : checkArr[i] == FP ? FP : checkArr[i], Arr : data});
            }
       }
       
       for(let i = 0; i < 3; i += 1) {
            if(checkArr[i] == checkArr[i+3] && checkArr[i+3] == checkArr[i+6] && checkArr[i+6] == checkArr[i] && checkArr[i] != ''){
                PubSub.publish('gameEnd', {Winner : checkArr[i] == FP ? FP : checkArr[i], Arr : data});
            }
        }

        for(let i = 0; i < 3; i += 2) {
            if(checkArr[i] == checkArr[4] && checkArr[4] == checkArr[8-i] && checkArr[8-i] == checkArr[i] && checkArr[i] != ''){
                PubSub.publish('gameEnd', {Winner : checkArr[i] == FP ? FP : checkArr[i], Arr : data});
            }
        }
        
        for(let i = 0; i < 9; i++) {
            if(checkArr[i] != ''){
                tieCheck++
            }
        }

        if(tieCheck == 9){
            PubSub.publish('gameEnd',{Winner : 'Tie', Arr : data})
        }else{
            tieCheck = 0;
        }
    }
})();