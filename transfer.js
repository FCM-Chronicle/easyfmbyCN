// 이적 시스템
class TransferSystem {
    constructor() {
        this.transferMarket = [];
        this.aiTransferCooldown = 0;
        this.basePrice = 500; // 기본 가격 500억
        
        // 타 리그 선수들
        this.extraPlayers = [,
            { "name": "바르트 페르브뤼헌", "position": "GK", "rating": 80, "age": 22, "team": "외부리그" },
  { "name": "기욤 레스테스", "position": "GK", "rating": 78, "age": 19, "team": "외부리그" },
  { "name": "토마소 마르티넬리", "position": "GK", "rating": 72, "age": 18, "team": "외부리그" },
  { "name": "윤도영", "position": "GK", "rating": 68, "age": 20, "team": "외부리그" },
  { "name": "조르조 스칼비니", "position": "DF", "rating": 85, "age": 21, "team": "외부리그" },
  { "name": "오스만 디오망드", "position": "DF", "rating": 83, "age": 21, "team": "외부리그" },
  { "name": "요렐 하토", "position": "DF", "rating": 82, "age": 18, "team": "외부리그" },
  { "name": "파비오 카발리", "position": "DF", "rating": 73, "age": 19, "team": "외부리그" },
  { "name": "아론 히키", "position": "DF", "rating": 80, "age": 22, "team": "외부리그" },
  { "name": "디오고 코스타", "position": "GK", "rating": 86, "age": 25, "team": "외부리그" },
  { "name": "후고 라르손", "position": "MF", "rating": 81, "age": 20, "team": "외부리그" },
  { "name": "주앙 네베스", "position": "MF", "rating": 86, "age": 19, "team": "외부리그" },
  { "name": "아담 와튼", "position": "MF", "rating": 80, "age": 20, "team": "외부리그" },
  { "name": "아산 우에드라오고", "position": "MF", "rating": 78, "age": 18, "team": "외부리그" },
  { "name": "마틴 바투리나", "position": "MF", "rating": 79, "age": 21, "team": "외부리그" },
  { "name": "자비 게라", "position": "MF", "rating": 79, "age": 21, "team": "외부리그" },
  { "name": "옌스 카스트로프", "position": "MF", "rating": 75, "age": 21, "team": "외부리그" },
  { "name": "플로리안 비르츠", "position": "MF", "rating": 88, "age": 21, "team": "외부리그" },
  { "name": "히오르히 수다코프", "position": "MF", "rating": 82, "age": 22, "team": "외부리그" },
  { "name": "켄드리 파에스", "position": "MF", "rating": 76, "age": 17, "team": "외부리그" },
  { "name": "김민수", "position": "MF", "rating": 69, "age": 18, "team": "외부리그" },
  { "name": "안토니오 누사", "position": "FW", "rating": 80, "age": 19, "team": "외부리그" },
  { "name": "윌프리드 그난토", "position": "FW", "rating": 79, "age": 20, "team": "외부리그" },
  { "name": "엘리에스 벤 세기르", "position": "FW", "rating": 80, "age": 19, "team": "외부리그" },
  { "name": "에반 퍼거슨", "position": "FW", "rating": 83, "age": 19, "team": "외부리그" },
  { "name": "카림 코네", "position": "FW", "rating": 77, "age": 20, "team": "외부리그" },
  { "name": "엄지성", "position": "FW", "rating": 72, "age": 22, "team": "외부리그" },
  { "name": "배준호", "position": "FW", "rating": 75, "age": 21, "team": "외부리그" },
  { "name": "아데몰라 루크먼", "position": "FW", "rating": 83, "age": 27, "team": "외부리그" },
  { "name": "퇸 코프메이너르스", "position": "MF", "rating": 85, "age": 27, "team": "외부리그" },
  { "name": "에데르송", "position": "MF", "rating": 84, "age": 26, "team": "외부리그" },
  { "name": "마르텐 더 룬", "position": "MF", "rating": 82, "age": 33, "team": "외부리그" },
  { "name": "베랏 짐시티", "position": "DF", "rating": 82, "age": 32, "team": "외부리그" },
  { "name": "엘 빌랄 투레", "position": "FW", "rating": 78, "age": 24, "team": "외부리그" },
  { "name": "오현규", "position": "FW", "rating": 75, "age": 23, "team": "외부리그" },
  { "name": "포그바", "position": "MF", "rating": 80, "age": 32, "team": "외부리그" },
  { "name": "델레 알리", "position": "MF", "rating": 79, "age": 29, "team": "외부리그" }
        ];
    }

    // 이적 시장 초기화
    initializeTransferMarket() {
        this.transferMarket = [];
        
        // 다른 팀의 일부 선수들을 이적 시장에 추가
        Object.keys(teams).forEach(teamKey => {
            if (teamKey !== gameData.selectedTeam) {
                const teamPlayers = teams[teamKey];
                
                // 각 팀에서 20% 확률로 선수를 이적 시장에 내놓음
                teamPlayers.forEach(player => {
                    if (Math.random() < 0.2) {
                        this.transferMarket.push({
                            ...player,
                            originalTeam: teamKey,
                            price: this.calculatePlayerPrice(player),
                            daysOnMarket: Math.floor(Math.random() * 30)
                        });
                    }
                });
            }
        });

        // 타 리그 선수들도 추가
        this.extraPlayers.forEach(player => {
            this.transferMarket.push({
                ...player,
                originalTeam: "외부리그",
                price: this.calculatePlayerPrice(player),
                daysOnMarket: Math.floor(Math.random() * 30)
            });
        });

        this.shuffleTransferMarket();
    }

   // 선수 가격 계산 함수 수정 (기존 calculatePlayerPrice 함수를 이것으로 교체)
calculatePlayerPrice(player) {
    let price = this.basePrice;
    
    // 능력치에 따른 가격 조정
    const ratingMultiplier = Math.pow(player.rating / 70, 2.5);
    price *= ratingMultiplier;
    
    // 나이에 따른 가격 조정
    let ageMultiplier = 1;
    if (player.age <= 20) {
        ageMultiplier = 1.3; // 젊은 선수는 30% 비싸게
    } else if (player.age <= 25) {
        ageMultiplier = 1.2; // 25세 이하는 20% 비싸게
    } else if (player.age >= 45) {
        ageMultiplier = 2.1; // 45세 이상은 3.5배 (레전드 보정)
    } else if (player.age >= 35) {
        ageMultiplier = 0.8; // 35세 이상은 60%
    } else if (player.age >= 30) {
        ageMultiplier = 0.8; // 30세 이상은 80%
    }
    
    price *= ageMultiplier;
    
    // 포지션에 따른 가격 조정
    const positionMultiplier = {
        'GK': 1,
        'DF': 1,
        'MF': 1,
        'FW': 1.2
    };
    
    price *= positionMultiplier[player.position] || 1;
    
    // 랜덤 요소 추가 (90% ~ 150%)
    const randomFactor = 0.9 + Math.random() * 0.7;
    price *= randomFactor;
    
    return Math.round(price);
}

    // 이적 시장 섞기
    shuffleTransferMarket() {
        for (let i = this.transferMarket.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.transferMarket[i], this.transferMarket[j]] = [this.transferMarket[j], this.transferMarket[i]];
        }
    }

    // 선수 검색
    searchPlayers(filters) {
        let filteredPlayers = [...this.transferMarket];
        
        // 이름 검색
        if (filters.name && filters.name.trim()) {
            const searchName = filters.name.toLowerCase();
            filteredPlayers = filteredPlayers.filter(player => 
                player.name.toLowerCase().includes(searchName)
            );
        }
        
        // 포지션 필터
        if (filters.position) {
            filteredPlayers = filteredPlayers.filter(player => 
                player.position === filters.position
            );
        }
        
        // 최소 능력치 필터
        if (filters.minRating) {
            filteredPlayers = filteredPlayers.filter(player => 
                player.rating >= filters.minRating
            );
        }
        
        // 최대 나이 필터
        if (filters.maxAge) {
            filteredPlayers = filteredPlayers.filter(player => 
                player.age <= filters.maxAge
            );
        }
        
        return filteredPlayers;
    }

    // 선수 영입
    signPlayer(player) {
        if (gameData.teamMoney < player.price) {
            return { success: false, message: "자금이 부족합니다!" };
        }
        
        // 팀 인원 제한 확인 (30명 제한)
        if (teams[gameData.selectedTeam].length >= 30) {
            return { success: false, message: "팀 인원이 가득 찼습니다! (최대 30명)" };
        }
        
        // 영입 처리
        gameData.teamMoney -= player.price;
        
        // 선수를 팀에 추가
        const newPlayer = {
            name: player.name,
            position: player.position,
            rating: player.rating,
            age: player.age
        };
        
        teams[gameData.selectedTeam].push(newPlayer);
        
        // 이적 시장에서 제거
        this.transferMarket = this.transferMarket.filter(p => p !== player);
        
        // AI 팀에서 선수 제거 (외부리그가 아닌 경우)
        if (player.originalTeam !== "외부리그") {
            const originalTeamPlayers = teams[player.originalTeam];
            const playerIndex = originalTeamPlayers.findIndex(p => 
                p.name === player.name && p.position === player.position
            );
            if (playerIndex !== -1) {
                originalTeamPlayers.splice(playerIndex, 1);
            }
        }
        
        return { 
            success: true, 
            message: `${player.name}을(를) ${player.price}억에 영입했습니다!`,
            player: newPlayer
        };
    }

    // 선수 방출
    releasePlayer(player, transferFee = 0) {
        const teamPlayers = teams[gameData.selectedTeam];
        const playerIndex = teamPlayers.findIndex(p => 
            p.name === player.name && p.position === player.position
        );
        
        if (playerIndex === -1) {
            return { success: false, message: "해당 선수를 찾을 수 없습니다." };
        }
        
        // 스쿼드에서도 제거
        this.removePlayerFromSquad(player);
        
        // 팀에서 제거
        teamPlayers.splice(playerIndex, 1);
        
        // 이적료 받기
        gameData.teamMoney += transferFee;
        
        // 무작위 팀으로 이적시키기
        const availableTeams = Object.keys(teams).filter(team => team !== gameData.selectedTeam);
        if (availableTeams.length > 0) {
            const randomTeam = availableTeams[Math.floor(Math.random() * availableTeams.length)];
            
            // 선수를 무작위 팀에 추가
            teams[randomTeam].push({
                name: player.name,
                position: player.position,
                rating: player.rating,
                age: player.age
            });
            
            return { 
                success: true, 
                message: `${player.name}을(를) 방출했습니다. ${teamNames[randomTeam]}로 이적했습니다.${transferFee > 0 ? ` (이적료: ${transferFee}억)` : ''}`
            };
        } else {
            // 다른 팀이 없을 경우 이적 시장에 추가
            this.transferMarket.push({
                ...player,
                originalTeam: "외부리그",
                price: Math.round(this.calculatePlayerPrice(player) * 0.7), // 70% 가격으로
                daysOnMarket: 0
            });
            
            return { 
                success: true, 
                message: `${player.name}을(를) 방출했습니다. 외부리그로 이적했습니다.${transferFee > 0 ? ` (이적료: ${transferFee}억)` : ''}`
            };
        }
    }

    // 스쿼드에서 선수 제거
    removePlayerFromSquad(player) {
        if (gameData.squad.gk && gameData.squad.gk.name === player.name) {
            gameData.squad.gk = null;
        }
        
        gameData.squad.df = gameData.squad.df.map(p => 
            p && p.name === player.name ? null : p
        );
        
        gameData.squad.mf = gameData.squad.mf.map(p => 
            p && p.name === player.name ? null : p
        );
        
        gameData.squad.fw = gameData.squad.fw.map(p => 
            p && p.name === player.name ? null : p
        );
    }

    // AI 팀 간 이적 시뮬레이션
    simulateAITransfers() {
        this.aiTransferCooldown--;
        
        if (this.aiTransferCooldown <= 0 && Math.random() < 0.3) { // 30% 확률로 AI 이적 발생
            this.processAITransfer();
            this.aiTransferCooldown = 5; // 5경기 후 다시 시도
        }
    }

    // AI 팀 이적 처리
    processAITransfer() {
        const availableTeams = Object.keys(teams).filter(team => team !== gameData.selectedTeam);
        
        if (availableTeams.length < 2) return;
        
        const buyingTeam = availableTeams[Math.floor(Math.random() * availableTeams.length)];
        const sellingTeams = availableTeams.filter(team => team !== buyingTeam);
        const sellingTeam = sellingTeams[Math.floor(Math.random() * sellingTeams.length)];
        
        const sellingTeamPlayers = teams[sellingTeam];
        if (sellingTeamPlayers.length <= 15) return; // 최소 인원 유지
        
        // 낮은 능력치 선수를 이적시킬 확률이 높음
        const transferCandidate = sellingTeamPlayers
            .filter(p => p.rating < 85)
            .sort((a, b) => a.rating - b.rating)[0];
        
        if (transferCandidate && Math.random() < 0.5) {
            // 이적 실행
            const playerIndex = sellingTeamPlayers.findIndex(p => p === transferCandidate);
            sellingTeamPlayers.splice(playerIndex, 1);
            
            teams[buyingTeam].push(transferCandidate);
            
            console.log(`AI 이적: ${transferCandidate.name}이(가) ${teamNames[sellingTeam]}에서 ${teamNames[buyingTeam]}로 이적했습니다.`);
        }
    }

    // 이적 시장 업데이트 (매일/매경기)
    updateTransferMarket() {
        // 시장에 있는 선수들의 일수 증가
        this.transferMarket.forEach(player => {
            player.daysOnMarket++;
            
            // 30일 이상 시장에 있으면 가격 하락
            if (player.daysOnMarket > 30) {
                player.price = Math.round(player.price * 0.95);
            }
            
            // 60일 이상이면 시장에서 제거 (다른 팀으로 이적했다고 가정)
            if (player.daysOnMarket > 60 && Math.random() < 0.1) {
                player.daysOnMarket = -1; // 제거 표시
            }
        });
        
        // 제거 표시된 선수들 제거
        this.transferMarket = this.transferMarket.filter(player => player.daysOnMarket >= 0);
        
        // 새로운 선수 추가 (20% 확률)
        if (Math.random() < 0.2) {
            this.addRandomPlayerToMarket();
        }
        
        // AI 이적 시뮬레이션
        this.simulateAITransfers();
    }

    // 랜덤 선수를 시장에 추가
    addRandomPlayerToMarket() {
        const availableTeams = Object.keys(teams).filter(team => team !== gameData.selectedTeam);
        
        if (availableTeams.length === 0) return;
        
        const randomTeam = availableTeams[Math.floor(Math.random() * availableTeams.length)];
        const teamPlayers = teams[randomTeam];
        
        if (teamPlayers.length <= 20) return; // 최소 인원 유지
        
        const availablePlayers = teamPlayers.filter(player => 
            !this.transferMarket.some(tp => tp.name === player.name && tp.originalTeam === randomTeam)
        );
        
        if (availablePlayers.length > 0) {
            const randomPlayer = availablePlayers[Math.floor(Math.random() * availablePlayers.length)];
            
            this.transferMarket.push({
                ...randomPlayer,
                originalTeam: randomTeam,
                price: this.calculatePlayerPrice(randomPlayer),
                daysOnMarket: 0
            });
        }
    }

    // 이적 시장 표시용 데이터 가져오기
    getTransferMarketDisplay(limit = 20) {
        return this.transferMarket
            .sort((a, b) => b.rating - a.rating)
            .slice(0, limit);
    }

    // 선수 계약 연장 (추후 구현)
    renewContract(player, newSalary, contractLength) {
        // 계약 연장 로직
        return { success: true, message: `${player.name}과(와) 계약을 연장했습니다.` };
    }

    // 저장 데이터 준비
    getSaveData() {
        return {
            transferMarket: this.transferMarket,
            aiTransferCooldown: this.aiTransferCooldown
        };
    }

    // 저장 데이터 로드
    loadSaveData(saveData) {
        this.transferMarket = saveData.transferMarket || [];
        this.aiTransferCooldown = saveData.aiTransferCooldown || 0;
    }
}

// 전역 이적 시스템 인스턴스
const transferSystem = new TransferSystem();

// 이적 시장 초기화
function initializeTransferMarket() {
    transferSystem.initializeTransferMarket();
}

// 이적 화면 로드
function loadTransferScreen() {
    displayTransferPlayers();
}

// 이적 가능 선수 표시
function displayTransferPlayers() {
    const container = document.getElementById('transferPlayers');
    container.innerHTML = '';
    const transferPlayers = transferSystem.getTransferMarketDisplay();

    if (transferPlayers.length === 0) {
        container.innerHTML = '<p>현재 이적 가능한 선수가 없습니다.</p>';
        return;
    }

    transferPlayers.forEach(player => {
        const playerCard = document.createElement('div');
        playerCard.className = 'transfer-player';
        
        const teamInfo = player.originalTeam === "외부리그" ? 
            "외부리그" : teamNames[player.originalTeam];
        
        playerCard.innerHTML = `
            <div class="player-name">${player.name}</div>
            <div class="player-position">${player.position}</div>
            <div class="player-rating">능력치: ${player.rating}</div>
            <div class="player-age">나이: ${player.age}</div>
            <div class="player-team">소속: ${teamInfo}</div>
            <div class="transfer-price">${player.price}억</div>
            <div class="market-days">시장 ${player.daysOnMarket}일째</div>
        `;
        
        playerCard.addEventListener('click', () => {
            const result = transferSystem.signPlayer(player);
            
            if (result.success) {
                gameData.teamMoney = Math.max(0, gameData.teamMoney);
                updateDisplay();
                
                alert(result.message);
                displayTransferPlayers(); // 목록 새로고침
                
                // 성장 시스템에 새 선수 추가
                if (result.player.age <= 25 && typeof playerGrowthSystem !== 'undefined') {
                    playerGrowthSystem.initializePlayerGrowth();
                }
                
                // 팀 선수 목록 새로고침
                if (document.getElementById('squad').classList.contains('active')) {
                    displayTeamPlayers();
                }
            } else {
                alert(result.message);
            }
        });
        
        container.appendChild(playerCard);
    });
}

// 선수 검색
function searchPlayers() {
    const filters = {
        name: document.getElementById('nameSearch').value,
        position: document.getElementById('positionFilter').value,
        minRating: parseInt(document.getElementById('minRating').value) || 0,
        maxAge: parseInt(document.getElementById('maxAge').value) || 999
    };
    
    const container = document.getElementById('transferPlayers');
    container.innerHTML = '';

    const filteredPlayers = transferSystem.searchPlayers(filters);

    if (filteredPlayers.length === 0) {
        container.innerHTML = '<p>검색 조건에 맞는 선수가 없습니다.</p>';
        return;
    }

    filteredPlayers.forEach(player => {
        const playerCard = document.createElement('div');
        playerCard.className = 'transfer-player';
        
        const teamInfo = player.originalTeam === "외부리그" ? 
            "외부리그" : teamNames[player.originalTeam];
        
        playerCard.innerHTML = `
            <div class="player-name">${player.name}</div>
            <div class="player-position">${player.position}</div>
            <div class="player-rating">능력치: ${player.rating}</div>
            <div class="player-age">나이: ${player.age}</div>
            <div class="player-team">소속: ${teamInfo}</div>
            <div class="transfer-price">${player.price}억</div>
            <div class="market-days">시장 ${player.daysOnMarket}일째</div>
        `;
        
        playerCard.addEventListener('click', () => {
            const result = transferSystem.signPlayer(player);
            
            if (result.success) {
                gameData.teamMoney = Math.max(0, gameData.teamMoney);
                updateDisplay();
                
                alert(result.message);
                searchPlayers(); // 검색 결과 새로고침
                
                // 성장 시스템에 새 선수 추가
                if (result.player.age <= 25 && typeof playerGrowthSystem !== 'undefined') {
                    playerGrowthSystem.initializePlayerGrowth();
                }
            } else {
                alert(result.message);
            }
        });
        
        container.appendChild(playerCard);
    });
}

// 선수 방출 기능 (팀 선수 목록에서 우클릭)
function addReleasePlayerOption() {
    document.addEventListener('contextmenu', function(e) {
        if (e.target.closest('.player-card') && document.getElementById('squad').classList.contains('active')) {
            e.preventDefault();
            
            const playerCard = e.target.closest('.player-card');
            const playerName = playerCard.querySelector('.name').textContent;
            
            // 현재 팀에서 해당 선수 찾기
            const teamPlayers = teams[gameData.selectedTeam];
            const player = teamPlayers.find(p => p.name === playerName);
            
            if (player && confirm(`${player.name}을(를) 방출하시겠습니까?`)) {
                const result = transferSystem.releasePlayer(player);
                
                if (result.success) {
                    alert(result.message);
                    displayTeamPlayers();
                    updateFormationDisplay();
                    displayTransferPlayers(); // 이적 시장 새로고침
                } else {
                    alert(result.message);
                }
            }
        }
    });
}

// 경기 후 이적 시장 업데이트
function updateTransferMarketPostMatch() {
    transferSystem.updateTransferMarket();
}

// 이적 시스템 초기화 (게임 로드 시)
function initializeTransferSystem() {
    // 이적 시장 초기화
    if (transferSystem.transferMarket.length === 0) {
        transferSystem.initializeTransferMarket();
    }
    
    // 우클릭 이벤트 추가
    addReleasePlayerOption();
}

// 저장/불러오기에 이적 데이터 포함하도록 기존 함수 확장
function saveGameWithTransfer() {
    // 기존 게임 데이터에 이적 시스템 데이터 추가
    gameData.transferSystemData = transferSystem.getSaveData();
    
    // 선수 성장 데이터도 포함
    if (typeof playerGrowthSystem !== 'undefined') {
        gameData.playerGrowthData = playerGrowthSystem.getSaveData();
    }
    
    const saveData = {
        gameData: gameData,
        teams: teams,
        timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(saveData, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${teamNames[gameData.selectedTeam]}_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function loadGameWithTransfer(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const saveData = JSON.parse(e.target.result);
            gameData = saveData.gameData;
            
            // 팀 데이터 복원
            if (saveData.teams) {
                Object.assign(teams, saveData.teams);
            }
            
            // 이적 시스템 데이터 복원
            if (gameData.transferSystemData && typeof transferSystem !== 'undefined') {
                transferSystem.loadSaveData(gameData.transferSystemData);
            }
            
            // 선수 성장 데이터 복원
            if (gameData.playerGrowthData && typeof playerGrowthSystem !== 'undefined') {
                playerGrowthSystem.loadSaveData(gameData.playerGrowthData);
            }
            
            // 화면 업데이트
            document.getElementById('teamName').textContent = teamNames[gameData.selectedTeam];
            updateDisplay();
            updateFormationDisplay();
            displayTeamPlayers();
            displayTransferPlayers();
            
            alert('게임을 불러왔습니다!');
        } catch (error) {
            alert('저장 파일을 불러오는 중 오류가 발생했습니다.');
            console.error(error);
        }
    };
    reader.readAsText(file);
}

// 기존 저장/불러오기 함수 대체
function replaceSaveLoadFunctions() {
    // 기존 저장 버튼 이벤트 대체
    const saveBtn = document.getElementById('saveGameBtn');
    if (saveBtn) {
        saveBtn.removeEventListener('click', saveGame);
        saveBtn.addEventListener('click', saveGameWithTransfer);
    }
    
    // 기존 불러오기 이벤트 대체
    const loadInput = document.getElementById('loadGameInput');
    if (loadInput) {
        loadInput.removeEventListener('change', loadGame);
        loadInput.addEventListener('change', loadGameWithTransfer);
    }
}

// 페이지 로드 시 이적 시스템 초기화
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        initializeTransferSystem();
        replaceSaveLoadFunctions();
    }, 1000);
});

// 경기 종료 후 이적 시장 업데이트를 위한 이벤트 연결
if (typeof window.endMatch === 'function') {
    const originalEndMatch = window.endMatch;
    window.endMatch = function(matchData) {
        if (originalEndMatch) {
            originalEndMatch.call(this, matchData);
        }
        setTimeout(() => {
            updateTransferMarketPostMatch();
        }, 3000);
    };
}

// 전역으로 함수들 노출
window.transferSystem = transferSystem;
window.displayTransferPlayers = displayTransferPlayers;
window.searchPlayers = searchPlayers;
window.initializeTransferMarket = initializeTransferMarket;
