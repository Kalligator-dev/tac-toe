// Global variables

let turn = 0;
let firstTurn = 0;

let scoreA = 0;

let scoreB = 0;

let playerOneName = '';
let playerTwoName = '';

score = `${playerOneName}: ${scoreA} - ${scoreB}:${playerTwoName}`;

let errMsgLog = 0;

let lastCard;


// Storage Ctrl
const StorageCtrl = (function(){
    return {
        storeUser: function(user){
            let users = [];
            if(localStorage.getItem('users') === null){
                users.push(user);
                localStorage.setItem('users', JSON.stringify(users));
            } else {
                users = JSON.parse(localStorage.getItem('users'));
                users.push(user);
                localStorage.setItem('users', JSON.stringify(users));
            }
        },

        getUsersFromLS: function(){
            let users;
            if(localStorage.getItem('users') === null){
                users = [];
            } else {
                users = JSON.parse(localStorage.getItem('users'));
            }

            return users
        },

        updateUserInLS: function(updatedUser){
            let users = JSON.parse(localStorage.getItem('users'));

            users.forEach(function(u){
                if(u.id === updatedUser.id){
                    u.games = updatedUser.games;
                    u.wins = updatedUser.wins;
                    u.losses = updatedUser.losses;
                    u.draws = updatedUser.draws;
                    u.against = updatedUser.against;
                    u.rank = updatedUser.rank;
                    u.streak = updatedUser.streak;
                    u.bestWS = updatedUser.bestWS;
                    u.rating = updatedUser.rating;
                }
            });

            localStorage.setItem('users', JSON.stringify(users));
        }
    }
})();

// User Ctrl
const UserCtrl = (function(){
    // Player Constructor
    const Player = function(id, name, password){
        this.id = id;
        this.name = name;
        this.password = password;
        this.games = 0;
        this.wins = 0;
        this.losses = 0;
        this.draws = 0;
        this.against = [];
        this.rank = 'NA';
        this.streak = 0;
        this.bestWS = 0;
        this.rating = 500;
    }

    // VS Constructor
    const VSLog = function(id){
        this.id = id;
        this.gamesLog = '';
    }

    
    // Data structure
    const data = {
        users: StorageCtrl.getUsersFromLS(),

        playerOne: {
            id: 0,
            name: 'user',
            password: 'user',
            games: 12,
            wins: 4,
            losses: 4,
            draws: 4,
            against: [
                {id: 1, gamesLog: 'wldwldwldwldwwwld'}
            ],
            rating: 1800,
            elo: 0,
            act: 0,
            rank: 2,
            streak: 2,
            bestWS: 2
        },

        playerTwo: {
            id: 1,
            name: 'PC',
            password: 'pc',
            games: 50,
            wins: 25,
            losses: 10,
            draws: 15,
            against: [
                {id: 0, gamesLog: 'lwdlwdlwdlwdlllwd'}
            ],
            rating: 2000,
            elo: 0,
            act: 0,
            rank: 1,
            streak: 5,
            bestWS: 5
        }
    };


    return {
        logdata: function(){
            return data;
        },

        getUsers: function(){
            return data.users;
        },

        addPlayer: function(name, password){
            let ID;
            if(data.users.length === 0){
                ID = 0;
            } else {
                ID = data.users.length;
            };
            
            const newPlayer = new Player(ID, name, password);
            data.users.push(newPlayer);


            return newPlayer;
        },

        updatePlayer: function(player){
            data.users.forEach(function(user){
                if(user.id === player.id){
                    user.wins = player.wins,
                    user.draws = player.draws;
                    user.games = player.games;
                    user.losses = player.losses;
                    user.against = player.against;
                    user.rating = player.rating;
                    user.rank = player.rank;
                    user.bestWS = player.bestWS;
                    user.streak = player.streak;
                }
            });
        },

        updateRank: function(){
            let ratings = [];
            data.users.forEach(function(user){
                ratings.push(user.rating);
            });
            let sortedR = ratings.sort(function(a,b){return b-a});
            data.playerOne.rank = sortedR.indexOf(data.playerOne.rating);
            data.playerTwo.rank = sortedR.indexOf(data.playerTwo.rating);
            data.users.forEach(u => {
                u.rank = ratings.indexOf(u.rating)+1
                StorageCtrl.updateUserInLS(u)
            })
        },

        updateStreakX: function(res){
            if(data.playerOne.streak === 0){
                data.playerOne.streak += res;
            } else if(data.playerOne.streak < 0){
                if(res === 0){
                    data.playerOne.streak = 0;
                } else if(res === 1){
                    data.playerOne.streak = 1;
                } else if(res === -1){
                    data.playerOne.streak += res;
                }

            } else if(data.playerOne.streak > 0){
                if(res === 0){
                    data.playerOne.streak = 0;
                } else if(res === 1){
                    data.playerOne.streak += res;
                } else if(res === -1){
                    data.playerOne.streak = -1;
                }
            }
        },

        updateStreakO: function(res){
            if(data.playerTwo.streak === 0){
                data.playerTwo.streak += res;
            } else if(data.playerTwo.streak < 0){
                if(res === 0){
                    data.playerTwo.streak = 0;
                } else if(res === 1){
                    data.playerTwo.streak = 1;
                } else if(res === -1){
                    data.playerTwo.streak += res;
                }

            } else if(data.playerTwo.streak > 0){
                if(res === 0){
                    data.playerTwo.streak = 0;
                } else if(res === 1){
                    data.playerTwo.streak += res;
                } else if(res === -1){
                    data.playerTwo.streak = -1;
                }
            }
        },

        updateBWSX: function(){
            if(data.playerOne.streak > data.playerOne.bestWS){
                data.playerOne.bestWS = data.playerOne.streak;
            }
        },

        updateBWSO: function(){
            if(data.playerTwo.streak > data.playerTwo.bestWS){
                data.playerTwo.bestWS = data.playerTwo.streak;
            }
        },

        setVS: function(){
            let idsVSX = [];
            let idsVSO = [];
            data.playerOne.against.forEach(function(opp){
                idsVSX.push(opp.id);
            });

            data.playerTwo.against.forEach(function(opp){
                idsVSO.push(opp.id);
            });

            if(idsVSX.indexOf(data.playerTwo.id) === -1){
                const oVSX = new VSLog(data.playerTwo.id);
                data.playerOne.against.push(oVSX);
            };

            if(idsVSO.indexOf(data.playerOne.id) === -1){
                const xVSO = new VSLog(data.playerOne.id);
                data.playerTwo.against.push(xVSO);
            };
        },

        updateVS: function(resX, resO){
            let gamesLogX = '';
            let gamesLogO = '';

            data.playerOne.against.forEach(function(opp){
                if(opp.id === data.playerTwo.id){
                    gamesLogX = opp.gamesLog;
                }
            });
            data.playerTwo.against.forEach(function(opp){
                if(opp.id === data.playerOne.id){
                    gamesLogO = opp.gamesLog;
                }
            });

            gamesLogX += resX;
            gamesLogO += resO;

            data.playerOne.against.forEach(function(opp){
                if(opp.id === data.playerTwo.id){
                    opp.gamesLog = gamesLogX;
                }
            });
            data.playerTwo.against.forEach(function(opp){
                if(opp.id === data.playerOne.id){
                    opp.gamesLog = gamesLogO;
                }
            });
        },

        setPlayerX: function(player){
            data.playerOne = player;
            return data.playerOne;
        },

        setPlayerO: function(player){
            data.playerTwo = player;
            return data.playerTwo;
        },

        setNames: function(){
            playerOneName = data.playerOne.name;
            playerTwoName = data.playerTwo.name;

            return {
                playerOneName, playerTwoName
            }
        },

        updateElo: function(){
            data.playerOne.elo = 1 / (1 + Math.pow(10, ((data.playerTwo.rating - data.playerOne.rating) / 400)));

            data.playerTwo.elo = 1 / (1 + Math.pow(10, ((data.playerOne.rating - data.playerTwo.rating) / 400)));

            return {
                playerOneElo: data.playerOne.elo,
                playerTwoElo: data.playerTwo.elo
            }
        },

        updateRating: function(playerWW){
            if(firstTurn === 0){
                if(playerWW === 1){
                    data.playerOne.rating = data.playerOne.rating + (16 * (1 - data.playerOne.elo));

                    data.playerTwo.rating = data.playerTwo.rating + (16 * (0 - data.playerTwo.elo));
                } else if(playerWW === 2){
                    data.playerOne.rating = data.playerOne.rating + (64 * (0 - data.playerOne.elo));

                    data.playerTwo.rating = data.playerTwo.rating + (64 * (1 - data.playerTwo.elo));
                } else if(playerWW === 0){
                    data.playerOne.rating = data.playerOne.rating + (16 * (0.5 - data.playerOne.elo));

                    data.playerTwo.rating = data.playerTwo.rating + (16 * (0.5 - data.playerTwo.elo));
                }
            } else if(firstTurn === 1){
                if(playerWW === 1){
                    data.playerOne.rating = data.playerOne.rating + (64 * (1 - data.playerOne.elo));

                    data.playerTwo.rating = data.playerTwo.rating + (64 * (0 - data.playerTwo.elo));
                } else if(playerWW === 2){
                    data.playerOne.rating = data.playerOne.rating + (16 * (0 - data.playerOne.elo));

                    data.playerTwo.rating = data.playerTwo.rating + (16 * (1 - data.playerTwo.elo));
                } else if(playerWW === 0){
                    data.playerOne.rating = data.playerOne.rating + (16 * (0.5 - data.playerOne.elo));

                    data.playerTwo.rating = data.playerTwo.rating + (16 * (0.5 - data.playerTwo.elo));
                }
            }
            
            
        },

        getPlayerOne: function(){
            return playerOne;
        },

        getPlayerTwo: function(){
            return playerTwo;
        },

        getScoreText: function(){
            return `${data.playerOne.name}: ${scoreA} - ${scoreB} :${data.playerTwo.name}`
        }
    }
})();


// UI Ctrl
const UICtrl = (function(){
    const selectors = {
        // Nav Bar selectors
        navBar: '#main-nav',
        newGameBtn : '#new-btn',
        undoBtn: '#undo-btn',
        clearBtn: '#clear-btn',
        usersBtn: '#users-btn',

        // Leaderboard selectors
        leaderboardID: 'leaderboard',
        lbContentID: 'lb-content',
        lbHeaderID: 'lb-header',

        // Reg Form Selectors
        gameUI: '#game-ui',
        gameHQ: '#game-hq',
        formHeaing: '#form-heading',
        spanX: '.x-h3',
        spanO: '.o-h3',
        inputName : '#player-name',
        inputPW : '#player-pw',
        regBtn: '#reg-btn',
        backBtn: '#back-btn',
        regIcon: '#reg-icon',
        regText: '#reg',
        loginIcon: '#login-icon',
        loginText: '#login',

        // Game Selectors
        gameCanvas: '#game',
        scoreBoard: '#score',
        scoreTxt: '#score-text',
        playerOne: '#player-one',
        playerTwo: '#player-two',
            // P1 Selectors
            xName: '#player-x-h2',
            xRank: '#rank-one',
            xRating: '#rating-one',
            xGames: '#games-one',
            xDraws: '#draws-one',
            xWins: '#wins-one',
            xLosses: '#losses-one',
            xStreak: '#streak-one',
            xBestWinning: '#best-winning-one',
            xVS: '#vs-one',
            // P2 Selectors
            oName: '#player-o-h2',
            oRank: '#rank-two',
            oRating: '#rating-two',
            oGames: '#games-two',
            oDraws: '#draws-two',
            oWins: '#wins-two',
            oLosses: '#losses-two',
            oStreak: '#streak-two',
            oBestWinning: '#best-winning-two',
            oVS: '#vs-two',
        // Game Board Selectors
        tileOneOne: '#one-1',
        tileOneTwo: '#one-2',
        tileOneThree: '#one-3',
        tileTwoOne: '#two-1',
        tileTwoTwo: '#two-2',
        tileTwoThree: '#two-3',
        tileThreeOne: '#three-1',
        tileThreeTwo: '#three-2',
        tileThreeThree: '#three-3'
    };

    return {
        UISelectors: selectors,
        getRegInput: function(){
            return {
                name: document.querySelector(selectors.inputName).value,
                password: document.querySelector(selectors.inputPW).value
            }
        },

        setScore: function(){
            UserCtrl.setNames();

            document.querySelector(selectors.scoreTxt).textContent = UserCtrl.getScoreText();
        },

        populateUI: function(){
            const playerX = UserCtrl.logdata().playerOne;
            const playerO = UserCtrl.logdata().playerTwo;

            const nameOne = playerX.name;
            const rankOne = playerX.rank;
            const ratingOne = Math.round(playerX.rating);
            const gamesOne = playerX.games;
            const drawsOne = playerX.draws;
            const winsOne = playerX.wins;
            const lossesOne = playerX.losses;
            const streakOne = playerX.streak;
            const bestWSOne = playerX.bestWS;
            const vsOne = playerX.against;
            const xID = playerX.id;
            let gamesLogXO;
            let xVSOW = 0;
            let xVSOD = 0;
            let xVSOL = 0;
            document.querySelector(selectors.xName).textContent = nameOne;
            document.querySelector(selectors.xRank).textContent = rankOne;
            document.querySelector(selectors.xRating).textContent = ratingOne;
            document.querySelector(selectors.xGames).textContent = gamesOne;
            document.querySelector(selectors.xDraws).textContent = drawsOne;
            document.querySelector(selectors.xWins).textContent = winsOne;
            document.querySelector(selectors.xLosses).textContent = lossesOne;
            document.querySelector(selectors.xStreak).textContent = streakOne;
            document.querySelector(selectors.xBestWinning).textContent = bestWSOne;
            

            const nameTwo = playerO.name;
            const rankTwo = playerO.rank;
            const ratingTwo = Math.round(playerO.rating);
            const gamesTwo = playerO.games;
            const drawsTwo = playerO.draws;
            const winsTwo = playerO.wins;
            const lossesTwo = playerO.losses;
            const streakTwo = playerO.streak;
            const bestWSTwo = playerO.bestWS;
            const vsTwo = playerO.against;
            const oID = playerO.id;
            document.querySelector(selectors.oName).textContent = nameTwo;
            document.querySelector(selectors.oRank).textContent = rankTwo;
            document.querySelector(selectors.oRating).textContent = ratingTwo;
            document.querySelector(selectors.oGames).textContent = gamesTwo;
            document.querySelector(selectors.oDraws).textContent = drawsTwo;
            document.querySelector(selectors.oWins).textContent = winsTwo;
            document.querySelector(selectors.oLosses).textContent = lossesTwo;
            document.querySelector(selectors.oStreak).textContent = streakTwo;
            document.querySelector(selectors.oBestWinning).textContent = bestWSTwo;
            

            vsOne.forEach(function(opp){
                if(opp.id === oID){
                    gamesLogXO = opp.gamesLog;
                    xVSOW = (gamesLogXO.match(/w/g) || []).length;
                    xVSOL = (gamesLogXO.match(/l/g) || []).length;
                    xVSOD = (gamesLogXO.match(/d/g) || []).length;
                }
            });

            

            document.querySelector(selectors.xVS).textContent = `${xVSOW} - ${xVSOL} - ${xVSOD}`;
            document.querySelector(selectors.oVS).textContent = `${xVSOL} - ${xVSOW} - ${xVSOD}`;
        },

        showGameState: function(){
            document.querySelector(selectors.gameHQ).style.display = 'none';
            document.querySelector(selectors.gameCanvas).style.display = 'block';
            document.querySelector(selectors.scoreBoard).style.display = 'block';
            document.querySelector(selectors.newGameBtn).className = 'activated';
            document.querySelector(selectors.undoBtn).className = 'deactivated';
            document.querySelector(selectors.clearBtn).className = 'deactivated';
            this.populateUI();
        },

        showRegState: function(){
            document.querySelector(selectors.gameHQ).style.display = 'block';
            document.querySelector(selectors.gameCanvas).style.display = 'none';
            document.querySelector(selectors.scoreBoard).style.display = 'none';
            document.querySelector(selectors.newGameBtn).className = 'deactivated';
            document.querySelector(selectors.undoBtn).className = 'deactivated';
            document.querySelector(selectors.clearBtn).className = 'deactivated';
        },

        setRegStateX: function(){
            document.querySelector(selectors.gameHQ).className = 'x-form';
            document.querySelector(selectors.formHeaing).innerHTML = 'Register';
            document.querySelector(selectors.spanX).style.display = 'inline';
            document.querySelector(selectors.spanO).style.display = 'none';
            document.querySelector(selectors.inputName).className = 'x-input';
            document.querySelector(selectors.inputPW).className = 'x-input';
            document.querySelector(selectors.regBtn).className = 'btn';
            document.querySelector(selectors.regIcon).style.display = 'inline';
            document.querySelector(selectors.regText).style.display = 'inline';
            document.querySelector(selectors.loginIcon).style.display = 'none';
            document.querySelector(selectors.loginText).style.display = 'none';
            document.querySelector(selectors.backBtn).style.display = 'none';
        },

        setRegStateO: function(){
            document.querySelector(selectors.gameHQ).className = 'o-form';
            document.querySelector(selectors.formHeaing).innerHTML = 'Register';
            document.querySelector(selectors.spanX).style.display = 'none';
            document.querySelector(selectors.spanO).style.display = 'inline';
            document.querySelector(selectors.inputName).className = 'o-input';
            document.querySelector(selectors.inputPW).className = 'o-input';
            document.querySelector(selectors.regBtn).className = 'btn';
            document.querySelector(selectors.regIcon).style.display = 'inline';
            document.querySelector(selectors.regText).style.display = 'inline';
            document.querySelector(selectors.loginIcon).style.display = 'none';
            document.querySelector(selectors.loginText).style.display = 'none';
            document.querySelector(selectors.backBtn).style.display = 'inline-block';
        },

        setLoginStateX: function(){
            document.querySelector(selectors.formHeaing).innerHTML = 'Login';
            document.querySelector(selectors.regBtn).className = 'btn btn-login-x';
            document.querySelector(selectors.regIcon).style.display = 'none';
            document.querySelector(selectors.regText).style.display = 'none';
            document.querySelector(selectors.loginIcon).style.display = 'inline';
            document.querySelector(selectors.loginText).style.display = 'inline';
        },

        setLoginStateO: function(){
            document.querySelector(selectors.formHeaing).innerHTML = 'Login';
            document.querySelector(selectors.regBtn).className = 'btn btn-login-o';
            document.querySelector(selectors.regIcon).style.display = 'none';
            document.querySelector(selectors.regText).style.display = 'none';
            document.querySelector(selectors.loginIcon).style.display = 'inline';
            document.querySelector(selectors.loginText).style.display = 'inline';
        },

        uiState: 'regState',
        regState: 'regStateX',

        clearInput: function(){
            document.querySelector(selectors.inputName).value = '';
            document.querySelector(selectors.inputPW).value = '';
        },

        clearGameUI: function(){
            document.querySelector(selectors.tileOneOne).className = 'card';
            document.querySelector(selectors.tileOneTwo).className = 'card';
            document.querySelector(selectors.tileOneThree).className = 'card';
            document.querySelector(selectors.tileTwoOne).className = 'card';
            document.querySelector(selectors.tileTwoTwo).className = 'card';
            document.querySelector(selectors.tileTwoThree).className = 'card';
            document.querySelector(selectors.tileThreeOne).className = 'card';
            document.querySelector(selectors.tileThreeTwo).className = 'card';
            document.querySelector(selectors.tileThreeThree).className = 'card';
            document.querySelector(selectors.tileOneOne).innerHTML = '<i class="fas fa-ellipsis-h fa-5x"></i>';
            document.querySelector(selectors.tileOneTwo).innerHTML = '<i class="fas fa-ellipsis-h fa-5x"></i>';
            document.querySelector(selectors.tileOneThree).innerHTML = '<i class="fas fa-ellipsis-h fa-5x"></i>';
            document.querySelector(selectors.tileTwoOne).innerHTML = '<i class="fas fa-ellipsis-h fa-5x"></i>';
            document.querySelector(selectors.tileTwoTwo).innerHTML = '<i class="fas fa-ellipsis-h fa-5x"></i>';
            document.querySelector(selectors.tileTwoThree).innerHTML = '<i class="fas fa-ellipsis-h fa-5x"></i>';
            document.querySelector(selectors.tileThreeOne).innerHTML = '<i class="fas fa-ellipsis-h fa-5x"></i>';
            document.querySelector(selectors.tileThreeTwo).innerHTML = '<i class="fas fa-ellipsis-h fa-5x"></i>';
            document.querySelector(selectors.tileThreeThree).innerHTML = '<i class="fas fa-ellipsis-h fa-5x"></i>';
            let error = document.querySelector('.error');
            if(error) error.remove();
            errMsgLog = 0;
        },

        undoCardUI: function(idUndo){
            document.querySelector(idUndo).className = 'card';
            document.querySelector(idUndo).innerHTML = '<i class="fas fa-ellipsis-h fa-5x"></i>';
        },

        undoBtnDeactivate : function(){
            document.querySelector(selectors.undoBtn).className = 'deactivated';
        }
    }
})();


// Game Ctrl
const Game = (function(UserCtrl, StorageCtrl, UICtrl){
    // Import selectors from UICtrl
    const gameSelectors = UICtrl.UISelectors;
    // Game Grid
    let gameGrid = [0,0,0,0,0,0,0,0,0];
    let rowOne = '';
    let rowTwo = '';
    let rowThree = '';
    let columnOne = '';
    let columnTwo = '';
    let columnThree = '';
    let diagonalOne = '';
    let diagonalTwo = '';
    const cardOneOne = document.querySelector(gameSelectors.tileOneOne);
    const cardOneTwo = document.querySelector(gameSelectors.tileOneTwo);
    const cardOneThree = document.querySelector(gameSelectors.tileOneThree);
    const cardTwoOne = document.querySelector(gameSelectors.tileTwoOne);
    const cardTwoTwo = document.querySelector(gameSelectors.tileTwoTwo);
    const cardTwoThree = document.querySelector(gameSelectors.tileTwoThree);
    const cardThreeOne = document.querySelector(gameSelectors.tileThreeOne);
    const cardThreeTwo = document.querySelector(gameSelectors.tileThreeTwo);
    const cardThreeThree = document.querySelector(gameSelectors.tileThreeThree);

    const undoBtnInGame = document.querySelector(gameSelectors.undoBtn);

    let gameOn = true;
    let winnerOn = false;
    // Clear Input
    const clearGameInput = function(){
        gameGrid = [0,0,0,0,0,0,0,0,0];
        rowOne = '';
        rowTwo = '';
        rowThree = '';
        columnOne = '';
        columnTwo = '';
        columnThree = '';
        diagonalOne = '';
        diagonalTwo = '';
    }

    const changeTurn = function(){
        if(turn === 0){
            turn = 1;
        } else if(turn === 1){
            turn = 0;
        }
    }
    // Game Logic
    const checkGameLogic = function(){
        if(rowOne === '111' || rowTwo === '111' || rowThree === '111' || columnOne === '111' || columnTwo === '111' || columnThree === '111' ||diagonalOne === '111' || diagonalTwo === '111'){
            gameOverX();
            gameOver();

        } else if(rowOne === '222' || rowTwo === '222' || rowThree === '222' || columnOne === '222' || columnTwo === '222' || columnThree === '222' ||diagonalOne === '222' || diagonalTwo === '222'){
            gameOverO();
            gameOver();

        }
    }

    const checkForDraw = function(){
        if(gameGrid.includes(0) === false){
            if(winnerOn === false){
                gameOverDraw();
                gameOver();
            }
        }
    }

    const gameOverX = function(){
        document.querySelector(gameSelectors.scoreTxt).textContent = `${UserCtrl.logdata().playerOne.name} Won!!!`;
        scoreA += 1;
        UserCtrl.logdata().playerOne.games += 1;
        UserCtrl.logdata().playerTwo.games += 1;
        UserCtrl.logdata().playerOne.wins += 1;
        UserCtrl.logdata().playerTwo.losses += 1;
        UserCtrl.updateVS('w', 'l');
        UserCtrl.updateRating(1);
        UserCtrl.updateStreakX(1);
        UserCtrl.updateStreakO(-1);
        winnerOn = true;
        gameOn = false;
    }

    const gameOverO = function(){
        document.querySelector(gameSelectors.scoreTxt).textContent = `${UserCtrl.logdata().playerTwo.name} Won!!!`;
        scoreB += 1;
        UserCtrl.logdata().playerOne.games += 1;
        UserCtrl.logdata().playerTwo.games += 1;
        UserCtrl.logdata().playerTwo.wins += 1;
        UserCtrl.logdata().playerOne.losses += 1;
        UserCtrl.updateVS('l', 'w');
        UserCtrl.updateRating(2);
        UserCtrl.updateStreakX(-1);
        UserCtrl.updateStreakO(1);
        winnerOn = true;
        gameOn = false;
    }

    const gameOverDraw = function(){
        document.querySelector(gameSelectors.scoreTxt).textContent = 'Game ended in a draw!';
        scoreA += 0.5;
        scoreB += 0.5;
        UserCtrl.logdata().playerOne.games += 1;
        UserCtrl.logdata().playerTwo.games += 1;
        UserCtrl.logdata().playerOne.draws += 1;
        UserCtrl.logdata().playerTwo.draws += 1;
        UserCtrl.updateVS('d', 'd');
        UserCtrl.updateRating(0);
        UserCtrl.updateStreakX(0);
        UserCtrl.updateStreakO(0);
        gameOn = false;
    }



    const gameOver = function(){
        if(firstTurn === 0){
            firstTurn = 1;
            turn = 1
        } else if(firstTurn === 1){
            firstTurn = 0;
            turn = 0
        };

        UICtrl.undoBtnDeactivate();
        document.querySelector(gameSelectors.clearBtn).className = 'deactivated';
        
        setTimeout(function(){
            clearGameInput();
            // document.querySelector(gameSelectors.scoreTxt).textContent = score;
            gameOn = true;
            winnerOn = false;
            UserCtrl.updateElo();
            UserCtrl.updateRank();
            UserCtrl.updateBWSX();
            UserCtrl.updateBWSO();
            StorageCtrl.updateUserInLS(UserCtrl.logdata().playerOne);
            StorageCtrl.updateUserInLS(UserCtrl.logdata().playerTwo);
            UICtrl.setScore();
            UICtrl.populateUI();
            UICtrl.clearGameUI();
        }, 3500);
    }
    // Load Event listiners
    const loadEventListeners = function(){
        // Card click
        document.querySelector('.ttt').addEventListener('click', cardClick);
        // New game click
        document.querySelector(gameSelectors.newGameBtn).addEventListener('click', newBtnClick);
        // Undo Button click
        document.querySelector(gameSelectors.undoBtn).addEventListener('click', undoBtnClick);
        // Clear Button click
        document.querySelector(gameSelectors.clearBtn).addEventListener('click', clearBtnClick);
        // Users Button Click
        document.querySelector(gameSelectors.usersBtn).addEventListener('click', usersBtnClick);

        // Reg Button Click
        document.querySelector(gameSelectors.regBtn).addEventListener('click', regBtnClick);
        // Input Change
        document.querySelector(gameSelectors.inputName).addEventListener('input', checkUserID);
        // Back Button Click
        document.querySelector(gameSelectors.backBtn).addEventListener('click', backBtnClick);
    }

    // Event listeners
    const cardClick = function(e){
        if(gameOn === true){
            if(e.target.parentNode.classList.contains('x-class') || e.target.parentNode.classList.contains('o-class')) {
                if(errMsgLog === 0){
                    // Get GameUI div
                    const gameUIDiv = document.querySelector(gameSelectors.gameUI);
                    const scoreDiv = document.querySelector(gameSelectors.scoreBoard);
                    // Create Error Msg
                    const regErrMsg = document.createElement('div');
                    regErrMsg.className = 'error';
                    const errTxt = document.createTextNode('Cannot overwrite previous moves');
                    regErrMsg.appendChild(errTxt);
                    // Append Error Msg
                    gameUIDiv.insertBefore(regErrMsg, scoreDiv);
                    // Set Error true
                    errMsgLog = 1;
                    // Timeout
                    setTimeout(function(){
                        let error = document.querySelector('.error');
                        if(error) error.remove();
                        errMsgLog = 0;
                    }, 2000);
                    }
            } else {
                if(turn === 0 && e.target.parentNode.classList.contains('card')) {
                    e.target.parentNode.classList.add('x-class');
                    e.target.setAttribute('class', 'fas fa-times fa-5x');
                    document.querySelector(gameSelectors.undoBtn).className = 'activated';
                    document.querySelector(gameSelectors.clearBtn).className = 'activated';
                    let _class;
                    if(e.target.parentNode === cardOneOne){
                        lastCard = 0;
                        gameGrid[0] = 1;
                        rowOne += 1;
                        columnOne += 1;
                        diagonalOne += 1;
                    } else if(e.target.parentNode === cardOneTwo){
                        lastCard = 1;
                        gameGrid[1] = 1;
                        rowOne += 1;
                        columnTwo += 1;
                    } else if(e.target.parentNode === cardOneThree){
                        lastCard = 2;
                        gameGrid[2] = 1;
                        rowOne += 1;
                        columnThree += 1;
                        diagonalTwo += 1;
                    } else if(e.target.parentNode === cardTwoOne){
                        lastCard = 3;
                        gameGrid[3] = 1;
                        rowTwo += 1;
                        columnOne += 1;
                    } else if(e.target.parentNode === cardTwoTwo){
                        lastCard = 4;
                        gameGrid[4] = 1;
                        rowTwo += 1;
                        columnTwo += 1;
                        diagonalOne += 1;
                        diagonalTwo += 1;
                    } else if(e.target.parentNode === cardTwoThree){
                        lastCard = 5;
                        gameGrid[5] = 1;
                        rowTwo += 1;
                        columnThree += 1;
                    } else if(e.target.parentNode === cardThreeOne){
                        lastCard = 6;
                        gameGrid[6] = 1;
                        rowThree += 1;
                        columnOne += 1;
                        diagonalTwo += 1;
                    } else if(e.target.parentNode === cardThreeTwo){
                        lastCard = 7;
                        gameGrid[7] = 1;
                        rowThree += 1;
                        columnTwo += 1;
                    } else if(e.target.parentNode === cardThreeThree){
                        lastCard = 8;
                        gameGrid[8] = 1;
                        rowThree += 1;
                        columnThree += 1;
                        diagonalOne += 1;
                    }
                    turn = 1;
                    checkGameLogic();
                    checkForDraw();
                } else if(turn === 1 && e.target.parentNode.classList.contains('card')){
                    e.target.parentNode.classList.add('o-class');
                    e.target.setAttribute('class', 'far fa-circle fa-5x');
                    document.querySelector(gameSelectors.undoBtn).className = 'activated';
                    document.querySelector(gameSelectors.clearBtn).className = 'activated';
                    if(e.target.parentNode === cardOneOne){
                        lastCard = 0;
                        gameGrid[0] = 2;
                        rowOne += 2;
                        columnOne += 2;
                        diagonalOne += 2;
                    } else if(e.target.parentNode === cardOneTwo){
                        lastCard = 1;
                        gameGrid[1] = 2;
                        rowOne += 2;
                        columnTwo += 2;
                    } else if(e.target.parentNode === cardOneThree){
                        lastCard = 2;
                        gameGrid[2] = 2;
                        rowOne += 2;
                        columnThree += 2;
                        diagonalTwo += 2;
                    } else if(e.target.parentNode === cardTwoOne){
                        lastCard = 3;
                        gameGrid[3] = 2;
                        rowTwo += 2;
                        columnOne += 2;
                    } else if(e.target.parentNode === cardTwoTwo){
                        lastCard = 4;
                        gameGrid[4] = 2;
                        rowTwo += 2;
                        columnTwo += 2;
                        diagonalOne += 2;
                        diagonalTwo += 2;
                    } else if(e.target.parentNode === cardTwoThree){
                        lastCard = 5;
                        gameGrid[5] = 2;
                        rowTwo += 2;
                        columnThree += 2;
                    } else if(e.target.parentNode === cardThreeOne){
                        lastCard = 6;
                        gameGrid[6] = 2;
                        rowThree += 2;
                        columnOne += 2;
                        diagonalTwo += 2;
                    } else if(e.target.parentNode === cardThreeTwo){
                        lastCard = 7;
                        gameGrid[7] = 2;
                        rowThree += 2;
                        columnTwo += 2;
                    } else if(e.target.parentNode === cardThreeThree){
                        lastCard = 8;
                        gameGrid[8] = 2;
                        rowThree += 2;
                        columnThree += 2;
                        diagonalOne += 2;
                    }
                    turn = 0;
                    checkGameLogic();
                    checkForDraw();
                }
            }
        } else if(gameOn === false){
            if(errMsgLog === 0){
                // Get GameUI div
                const gameUIDiv = document.querySelector(gameSelectors.gameUI);
                const scoreDiv = document.querySelector(gameSelectors.scoreBoard);
                // Create Error Msg
                const regErrMsg = document.createElement('div');
                regErrMsg.className = 'error';
                const errTxt = document.createTextNode('GameOver. Start a new game');
                regErrMsg.appendChild(errTxt);
                // Append Error Msg
                gameUIDiv.insertBefore(regErrMsg, scoreDiv);
                // Set Error true
                errMsgLog = 1;
                // Timeout
                setTimeout(function(){
                    let error = document.querySelector('.error');
                    if(error) error.remove();
                    errMsgLog = 0;
                }, 2000);
                }
        }
        
    }

    const newBtnClick = function(e){
        if(e.target.parentNode.classList.contains('deactivated') === false){
            UICtrl.uiState = 'regState';
            UICtrl.regState = 'regStateX';
            clearGameInput();
            turn = 0;
            firstTurn = 0;
            UICtrl.showRegState();
            UICtrl.setRegStateX();
            UICtrl.clearGameUI();
        }

        e.preventDefault();
    }

    const undoBtnClick = function(e){
        if(undoBtnInGame.classList.contains('deactivated') === false){
                if(lastCard === 0){
                    gameGrid[0] = 0;
                    rowOne = rowOne.slice(0, -1);
                    columnOne = columnOne.slice(0, -1);
                    diagonalOne = diagonalOne.slice(0, -1);
                    UICtrl.undoCardUI(gameSelectors.tileOneOne);
                    UICtrl.undoBtnDeactivate();
                    changeTurn();
                } else if(lastCard === 1){
                    gameGrid[1] = 0;
                    rowOne = rowOne.slice(0, -1);
                    columnTwo = columnTwo.slice(0, -1);
                    changeTurn();
                    UICtrl.undoCardUI(gameSelectors.tileOneTwo);
                    UICtrl.undoBtnDeactivate();
                } else if(lastCard === 2){
                    gameGrid[2] = 0;
                    rowOne = rowOne.slice(0, -1);
                    columnThree = columnThree.slice(0, -1);
                    diagonalTwo = diagonalTwo.slice(0, -1);
                    changeTurn();
                    UICtrl.undoCardUI(gameSelectors.tileOneThree);
                    UICtrl.undoBtnDeactivate();
                } else if(lastCard === 3){
                    gameGrid[3] = 0;
                    rowTwo = rowTwo.slice(0, -1);
                    columnOne = columnOne.slice(0, -1);
                    changeTurn();
                    UICtrl.undoCardUI(gameSelectors.tileTwoOne);
                    UICtrl.undoBtnDeactivate();
                } else if(lastCard === 4){
                    gameGrid[4] = 0;
                    rowTwo = rowTwo.slice(0, -1);
                    columnTwo = columnTwo.slice(0, -1);
                    diagonalOne = diagonalOne.slice(0, -1);
                    diagonalTwo = diagonalTwo.slice(0, -1);
                    changeTurn();
                    UICtrl.undoCardUI(gameSelectors.tileTwoTwo);
                    UICtrl.undoBtnDeactivate();
                } else if(lastCard === 5){
                    gameGrid[5] = 0;
                    rowTwo = rowTwo.slice(0, -1);
                    columnThree = columnThree.slice(0, -1);
                    changeTurn();
                    UICtrl.undoCardUI(gameSelectors.tileTwoThree);
                    UICtrl.undoBtnDeactivate();
                } else if(lastCard === 6){
                    gameGrid[6] = 0;
                    rowThree = rowThree.slice(0, -1);
                    columnOne = columnOne.slice(0, -1);
                    diagonalTwo = diagonalTwo.slice(0, -1);
                    changeTurn();
                    UICtrl.undoCardUI(gameSelectors.tileThreeOne);
                    UICtrl.undoBtnDeactivate();
                } else if(lastCard === 7){
                    gameGrid[7] = 0;
                    rowThree = rowThree.slice(0, -1);
                    columnTwo = columnTwo.slice(0, -1);
                    changeTurn();
                    UICtrl.undoCardUI(gameSelectors.tileThreeTwo);
                    UICtrl.undoBtnDeactivate();
                } else if(lastCard === 8){
                    gameGrid[8] = 0;
                    rowThree = rowThree.slice(0, -1);
                    columnThree = columnThree.slice(0, -1);
                    diagonalOne = diagonalOne.slice(0, -1);
                    changeTurn();
                    UICtrl.undoCardUI(gameSelectors.tileThreeThree);
                    UICtrl.undoBtnDeactivate();
                }
        }
        


        e.preventDefault();
    }

    const clearBtnClick = function(e){
        if(document.querySelector(gameSelectors.clearBtn).classList.contains('deactivated') === false){
            clearGameInput();
            turn = firstTurn;
            document.querySelector(gameSelectors.undoBtn).className = 'deactivated';
            document.querySelector(gameSelectors.clearBtn).className = 'deactivated';
            UICtrl.clearGameUI();
        }
        
        e.preventDefault();
    }

    const usersBtnClick = function(e){
        
        e.preventDefault();
        const lb = document.getElementById(gameSelectors.leaderboardID);
        if(lb){
            const lbContent = document.getElementById(gameSelectors.lbContentID)
            lb.style.width = 0.1 + 'rem'
            lb.style.height = 0.1 + 'rem'
            lbContent.style.opacity = 0.3
            setTimeout(() => {
                lb.style.transform = 'translate(50%, 0)'
            }, 150);
            setTimeout(() => {
                lbContent.remove()
            }, 450);
            setTimeout(() => {
                lb.remove()
            }, 1000);
        } else {
            const usersButton = document.querySelector(gameSelectors.usersBtn);
            const navBar = document.querySelector(gameSelectors.navBar);
            const coord = usersButton.getBoundingClientRect();
            const usersX = coord.x;
            const usersY = coord.y;
            const leaderboard = document.createElement('div');
            leaderboard.id = gameSelectors.leaderboardID;
            leaderboard.style.width = "0.1rem";
            leaderboard.style.height = "0.1rem";
            leaderboard.style.transform = 'translate(25%, -25%)'
            leaderboard.style.top = usersY + 'px';
            leaderboard.style.right = window.innerWidth - usersX + 'px';
            leaderboard.style.opacity = 0.5;
            navBar.appendChild(leaderboard);
            const lbContent = document.createElement('div');
            lbContent.id = gameSelectors.lbContentID
            const lbHeader = document.createElement('div');
            lbHeader.id = gameSelectors.lbHeaderID;
            lbHeader.innerHTML = '<i class="fas fa-trophy fa-3x"></i> <h1>Leaderboard</h1> <i class="fas fa-trophy fa-3x"></i>';
            const lbList = document.createElement('ul');
            let usersList = StorageCtrl.getUsersFromLS();
            usersList.sort((a,b) => a.rank - b.rank)
            for(let i = 0; i< usersList.length; i++){
                if(i > 9) break;
                let userLi = document.createElement('li');
                let txtUser;
                if(usersList[i].rank <=3){
                    txtUser = '<i class="fas fa-trophy"></i> '
                    if(usersList[i].rank === 1) userLi.style.color = 'var(--x-bg)';
                    if(usersList[i].rank === 2) userLi.style.color = 'var(--light-grey)';
                    if(usersList[i].rank === 3) userLi.style.color = 'var(--error-bg)';
                } else {
                    txtUser = ''
                }
                userLi.innerHTML = `${txtUser}${usersList[i].rank}. ${usersList[i].name} ${usersList[i].rating.toFixed(2)}`
                lbList.appendChild(userLi);
            }
            lbContent.appendChild(lbHeader);
            lbContent.appendChild(lbList);
            setTimeout(() => {
                let widHeight = Math.max(window.innerWidth, window.innerHeight) * 2;
                leaderboard.style.width = widHeight + 'px';
                leaderboard.style.height = widHeight + 'px';
                leaderboard.style.opacity = 0.9;
            }, 100);
            setTimeout(() => {
                document.body.appendChild(lbContent);
            }, 500);
        }
    }

    const regBtnClick = function(e){
        const input = UICtrl.getRegInput();
        if(input.name !== '' && input.password !== ''){
            if(UICtrl.regState === 'regStateX') {
                const newPlayer = UserCtrl.addPlayer(input.name, input.password);
                UserCtrl.setPlayerX(newPlayer);
                StorageCtrl.storeUser(newPlayer);

                UICtrl.clearInput();
                UICtrl.setRegStateO();
                UICtrl.regState = 'regStateO';
            } else if(UICtrl.regState === 'regStateO') {
                const newPlayer = UserCtrl.addPlayer(input.name, input.password);
                UserCtrl.setPlayerO(newPlayer);
                UserCtrl.setVS();
                StorageCtrl.storeUser(newPlayer);

                UICtrl.uiState = 'gameState';
                UICtrl.clearInput();
                scoreA = 0;
                scoreB = 0;
                UserCtrl.setNames();
                UserCtrl.updateElo();
                UserCtrl.updateRank();
                UICtrl.setScore();
                UICtrl.showGameState();
            } else if(UICtrl.regState === 'loginStateX') {
                e.preventDefault();
                const input = UICtrl.getRegInput();
                const users = UserCtrl.getUsers();
                let loginPassword;
                let loginPlayer;
                users.forEach(function(user){
                    if(user.name.toLowerCase() === input.name.toLowerCase()){
                        loginPassword = user.password;
                        loginPlayer = user;
                    }
                });
                if(loginPassword === input.password){
                    UserCtrl.setPlayerX(loginPlayer);
                    UICtrl.clearInput();
                    UICtrl.setRegStateO();
                    UICtrl.regState = 'regStateO';
                    let error = document.querySelector('.error');
                    if(error) error.remove();
                } else {
                    if(errMsgLog === 0){
                        // Get GameUI div
                        const gameUIDiv = document.querySelector(gameSelectors.gameUI);
                        const scoreDiv = document.querySelector(gameSelectors.scoreBoard);
                        // Create Error Msg
                        const regErrMsg = document.createElement('div');
                        regErrMsg.className = 'error';
                        const errTxt = document.createTextNode('Password is not correct!');
                        regErrMsg.appendChild(errTxt);
                        // Append Error Msg
                        gameUIDiv.insertBefore(regErrMsg, scoreDiv);
                        // Set Error true
                        errMsgLog = 1;
                        // Timeout
                        setTimeout(function(){
                            let error = document.querySelector('.error');
                            if(error) error.remove();
                            errMsgLog = 0;
                        }, 2000);
                        }
                }
            } else if(UICtrl.regState === 'loginStateO') {
                e.preventDefault();
                const input = UICtrl.getRegInput();
                const users = UserCtrl.getUsers();
                let loginPassword;
                let loginPlayer;
                users.forEach(function(user){
                    if(user.name.toLowerCase() === input.name.toLowerCase()){
                        loginPassword = user.password;
                        loginPlayer = user;
                    }
                });
                if(loginPassword === input.password){
                    UserCtrl.setPlayerO(loginPlayer);
                    UserCtrl.setVS();
                    UICtrl.clearInput();
                    scoreA = 0;
                    scoreB = 0;
                    UserCtrl.setNames();
                    UserCtrl.updateElo();
                    UserCtrl.updateRank();
                    UICtrl.setScore();
                    UICtrl.showGameState();
                    UICtrl.regState = '';
                    UICtrl.uiState = 'gameState';
                    let error = document.querySelector('.error');
                    if(error) error.remove();
                } else {
                    if(errMsgLog === 0){
                        // Get GameUI div
                        const gameUIDiv = document.querySelector(gameSelectors.gameUI);
                        const scoreDiv = document.querySelector(gameSelectors.scoreBoard);
                        // Create Error Msg
                        const regErrMsg = document.createElement('div');
                        regErrMsg.className = 'error';
                        const errTxt = document.createTextNode('Password is not correct!');
                        regErrMsg.appendChild(errTxt);
                        // Append Error Msg
                        gameUIDiv.insertBefore(regErrMsg, scoreDiv);
                        // Set Error true
                        errMsgLog = 1;
                        // Timeout
                        setTimeout(function(){
                            let error = document.querySelector('.error');
                            if(error) error.remove();
                            errMsgLog = 0;
                        }, 2000);
                        }
                }
            }
        } else {
            if(errMsgLog === 0){
            // Get GameUI div
            const gameUIDiv = document.querySelector(gameSelectors.gameUI);
            const scoreDiv = document.querySelector(gameSelectors.scoreBoard);
            // Create Error Msg
            const regErrMsg = document.createElement('div');
            regErrMsg.className = 'error';
            const errTxt = document.createTextNode('Please fill Username and Password fields');
            regErrMsg.appendChild(errTxt);
            // Append Error Msg
            gameUIDiv.insertBefore(regErrMsg, scoreDiv);
            // Set Error true
            errMsgLog = 1;
            // Timeout
            setTimeout(function(){
                let error = document.querySelector('.error');
                if(error) error.remove();
                errMsgLog = 0;
            }, 2000);
            }
        }

        // Set UI Score
        UserCtrl.setNames();
        UICtrl.setScore();

        // UICtrl.clearInput();
        e.preventDefault();
    }

    const checkUserID = function(){
        const input = UICtrl.getRegInput();
        const users = UserCtrl.getUsers();
        users.every(function(user){
            if(user.name.toLowerCase() === input.name.toLowerCase()){
                if(UICtrl.regState === 'regStateX'){
                    UICtrl.setRegStateX();
                    UICtrl.setLoginStateX();
                    UICtrl.regState = 'loginStateX';
                } else if(UICtrl.regState === 'regStateO'){
                    UICtrl.setRegStateO();
                    UICtrl.setLoginStateO();
                    UICtrl.regState = 'loginStateO';
                }

                return false;
            } else {
                if(UICtrl.regState === 'regStateX' || UICtrl.regState === 'loginStateX') {
                    UICtrl.setRegStateX();
                    UICtrl.regState = 'regStateX';
                } else if (UICtrl.regState === 'regStateO' || UICtrl.regState === 'loginStateO'){
                    UICtrl.setRegStateO();
                    UICtrl.regState = 'regStateO';
                }

                return true;
            }
        })
    }

    const backBtnClick = function(e){
        UICtrl.setRegStateX();
        UICtrl.regState = 'regStateX';

        e.preventDefault();
    }


    // Init game
    return {
        init: function() {
            // Clear Reg Input
            UICtrl.clearInput();
            // set state to reg
            UICtrl.showRegState();
            // Set reg state to player one
            UICtrl.setRegStateX();



            // Load Ev Listeners
            loadEventListeners();
            // Set Score
            UserCtrl.setNames();
            UICtrl.setScore();
        }
    }
})(UserCtrl, StorageCtrl, UICtrl);

Game.init();