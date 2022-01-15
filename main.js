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
        startButtton.parentElement.appendChild(chosePole);

        xButton.addEventListener('click', () => {
            chosePole.innerHTML = '';
            chosePole.remove();
            PubSub.publish('FirstPlayer','X')
        });

        oButton.addEventListener('click', () => {
            chosePole.innerHTML = '';
            chosePole.remove();
            PubSub.publish('FirstPlayer','O')
        });

        startButtton.remove();
    });

    function prepareNewGame (data) {
        console.log(data);
        //make logic
        //get Winner
    }
})();

const playerModule = (() => {
    // take eye on player`s turns and start game 
    
    // PubSub.publish("gameEnd",???);

    PubSub.subscribe('FirstPlayer',game);
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
    
    boardModule.squers.forEach( squre => squre.addEventListener('click',operate))
    
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

    function checkResult(data) {
       for(let i = 0; i < 9; i++){
            checkArr[i] = data[i].textContent
       }
       
       if(checkArr[0] == checkArr[1] && checkArr[1] == checkArr[2] && checkArr[2] == checkArr[0]){
           console.log(checkArr[0])
            PubSub.publish('gameEnd', checkArr[1] == FP ? FP : '?');
       }
    }

    return {
        
    };
})();

