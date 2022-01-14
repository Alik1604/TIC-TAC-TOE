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

const boardModule = (() => {
    //controle game board
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

const startModule = (() => {
    const startButtton = document.querySelector('#start_button');
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
    });
})();

const playerModule = (() => {
    // take eye on player`s turns and start game 
    
    PubSub.subscribe('FirstPlayer',game);

    function game(data){
        boardModule.squers.forEach( squre => squre.addEventListener('click',operate(squre)))
    }
    
    function operate(squre) {
        
    }
    


   


    return {
        
    };
})();

const regulatorModule = (() => {
    //check winer and display result  
    
    return {
        
    };
})();

