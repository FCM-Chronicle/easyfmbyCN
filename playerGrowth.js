// 선수 성장 시스템
class PlayerGrowthSystem {
    constructor() {
        this.growthData = new Map(); // 선수별 성장 데이터 저장
    }

    // 게임 시작 시 25세 이하 선수들에게 성장 가능성 부여
    initializePlayerGrowth() {
        if (!gameData.selectedTeam) return;

        const teamPlayers = teams[gameData.selectedTeam];
        
        teamPlayers.forEach(player => {
            if (player.age <= 25 && !this.growthData.has(player.name)) {
                const growthPotential = this.calculateGrowthPotential(player);
                
                // 월별 성장을 최소 0.34 이상으로 보장
                let monthlyGrowth = Math.max(0.34, growthPotential / 12); // 1년 기간으로 나눔
                
                // 성장 기간 계산 (총 성장량 / 월별 성장)
                const monthsToGrow = Math.ceil(growthPotential / monthlyGrowth);
                
                this.growthData.set(player.name, {
                    currentRating: Math.round(player.rating), // 반올림 적용
                    maxGrowth: Math.round(growthPotential), // 반올림 적용
                    remainingGrowth: Math.round(growthPotential), // 반올림 적용
                    monthsToGrow: monthsToGrow,
                    monthlyGrowth: monthlyGrowth,
                    lastGrowthCheck: Date.now()
                });

                console.log(`${player.name}: 성장 가능성 ${Math.round(growthPotential)}, 월별 성장 ${monthlyGrowth.toFixed(2)}, 성장 기간 ${monthsToGrow}개월`);
            }
        });
    }

    // 성장 가능성 계산 (3-15 사이의 랜덤 값)
    calculateGrowthPotential(player) {
        const baseGrowth = 3 + Math.random() * 10; // 3-13 사이
        
        // 나이에 따른 보정
        let ageModifier = 1;
        if (player.age <= 18) {
            ageModifier = 1.5; // 18세 이하는 50% 더 성장
        } else if (player.age <= 21) {
            ageModifier = 1.3; // 21세 이하는 30% 더 성장
        } else if (player.age <= 23) {
            ageModifier = 1.1; // 23세 이하는 10% 더 성장
        }
        else if (player.age <= 25) {
            ageModifier = 0.8; // 25세 이하는 -20% 더 성장
        }
        // 현재 능력치에 따른 보정 (낮은 능력치는 성장 여지가 더 많음)
        let ratingModifier = 1;
        const currentRating = Math.round(player.rating); // 반올림된 능력치로 계산
        if (currentRating < 70) {
            ratingModifier = 1.7;
        } else if (currentRating < 80) {
            ratingModifier = 1.4;
        } else if (currentRating >= 90) {
            ratingModifier = 0.8; // 이미 높은 선수는 성장 제한
        }

        // 세륜중학교 특별 보너스 (1.5배 ~ 2.5배)
        let teamModifier = 1;
        if (gameData.selectedTeam === 'seryu3') {
            teamModifier = 1.5 + Math.random() * 1.0; // 1.5 ~ 2.5배
            console.log(`세륜중학교 ${player.name}에게 특별 성장 보너스 적용: x${teamModifier.toFixed(2)}`);
        }

        const finalGrowth = Math.round(baseGrowth * ageModifier * ratingModifier * teamModifier);
        
        // 세륜중학교 선수들은 최소 성장 보장
        if (gameData.selectedTeam === 'seryu3') {
            return Math.max(finalGrowth, 15); // 최소 15 성장 보장
        }

        return finalGrowth;
    }

    // 선수 성장 처리 (매월 또는 경기마다 호출)
    processPlayerGrowth() {
        if (!gameData.selectedTeam) return;

        const teamPlayers = teams[gameData.selectedTeam];
        let growthOccurred = false;

        teamPlayers.forEach(player => {
            if (this.growthData.has(player.name)) {
                const growthInfo = this.growthData.get(player.name);
                
                // 성장 조건 확인
                if (this.shouldPlayerGrow(player, growthInfo)) {
                    const growthAmount = this.calculateGrowthAmount(player, growthInfo);
                    
                    if (growthAmount > 0) {
                        this.applyGrowth(player, growthAmount, growthInfo);
                        growthOccurred = true;
                    }
                }
            }
        });

        if (growthOccurred) {
            this.updateSquadDisplay();
        }
    }

    // 성장 조건 확인
    shouldPlayerGrow(player, growthInfo) {
        // 아직 성장 여지가 있는 경우에만
        if (growthInfo.remainingGrowth <= 0) {
            return false;
        }

        // 세륜중학교는 더 자주 성장 (3경기마다)
        if (gameData.selectedTeam === 'seryu3') {
            return gameData.matchesPlayed > 0 && gameData.matchesPlayed % 3 === 0;
        }

        // 일반 팀은 5경기마다 성장 체크
        return gameData.matchesPlayed > 0 && gameData.matchesPlayed % 5   === 0;
    }

    // 성장량 계산
    calculateGrowthAmount(player, growthInfo) {
        // 기본 월별 성장량 (최소 0.34 보장)
        let baseGrowth = Math.max(0.34, growthInfo.monthlyGrowth);

        // 팀 사기에 따른 보정
        const moraleModifier = gameData.teamMorale / 100;
        baseGrowth *= moraleModifier;

        // 경기 출전에 따른 보정 (스쿼드에 포함된 선수는 더 빨리 성장)
        if (this.isPlayerInSquad(player)) {
            baseGrowth *= 2.0; // 1.5배로 빠른 성장
        }

        // 세륜중학교 추가 성장 보너스
        if (gameData.selectedTeam === 'seryun') {
            baseGrowth *= 2.5; // 80% 빠른 성장
            
            // 세륜중학교는 벤치 선수도 성장 (젊은 선수들이라서)
            if (!this.isPlayerInSquad(player)) {
                baseGrowth *= 0.8; // 벤치여도 80% 성장
            }
        }

        // 랜덤 요소 추가 (80% ~ 120%)
        const randomFactor = 0.8 + Math.random() * 0.4;
        baseGrowth *= randomFactor;

        // 성장량도 반올림 처리하되 최소 0.34 보장
        const roundedGrowth = Math.max(0.34, Math.round(baseGrowth * 10) / 10); // 소수점 첫째자리까지 반올림
        return Math.min(roundedGrowth, growthInfo.remainingGrowth);
    }

    // 선수가 현재 스쿼드에 포함되어 있는지 확인
    isPlayerInSquad(player) {
        const squad = gameData.squad;
        
        if (squad.gk && squad.gk.name === player.name) return true;
        
        for (let df of squad.df) {
            if (df && df.name === player.name) return true;
        }
        
        for (let mf of squad.mf) {
            if (mf && mf.name === player.name) return true;
        }
        
        for (let fw of squad.fw) {
            if (fw && fw.name === player.name) return true;
        }
        
        return false;
    }

    // 성장 적용
    applyGrowth(player, growthAmount, growthInfo) {
        const oldRating = Math.round(player.rating); // 기존 능력치 반올림
        const newRating = Math.min(99, Math.round(player.rating + growthAmount)); // 새 능력치 반올림
        
        player.rating = newRating; // 반올림된 값으로 적용
        growthInfo.remainingGrowth = Math.max(0, Math.round((growthInfo.remainingGrowth - growthAmount) * 10) / 10); // 남은 성장량도 반올림
        growthInfo.lastGrowthCheck = Date.now();

        // 성장 알림
        if (newRating > oldRating) {
            this.showGrowthNotification(player, oldRating, newRating);
        }

        // 성장 데이터 업데이트
        this.growthData.set(player.name, growthInfo);

        // 성장이 완료되면 성장 데이터에서 제거
        if (growthInfo.remainingGrowth <= 0) {
            this.growthData.delete(player.name);
            console.log(`${player.name}의 성장이 완료되어 성장 데이터에서 제거되었습니다.`);
        }
    }

    // 성장 알림 표시
    showGrowthNotification(player, oldRating, newRating) {
        const growthAmount = newRating - oldRating;
        let message = `🌟 ${player.name}의 능력치가 상승했습니다!\n${oldRating} → ${newRating} (+${growthAmount})`;
        
       
        
        // 알림을 게임 화면에 표시
        setTimeout(() => {
            alert(message);
        }, 1000);

        console.log(message);
    }

    // 모든 팀 선수 성장 처리 (AI 팀들)
    processAllTeamsGrowth() {
        Object.keys(teams).forEach(teamKey => {
            if (teamKey !== gameData.selectedTeam) {
                const teamPlayers = teams[teamKey];
                
                teamPlayers.forEach(player => {
                    if (player.age <= 25) {
                        // AI 팀 선수들도 약간의 성장 (유저팀보다 느리게)
                        let growthInterval = 15; // 기본 15경기마다
                        let growthChance = 0.1; // 10% 확률
                        let growthAmount = Math.max(0.34, 0.5 + Math.random() * 0.86); // 최소 0.34, 최대 1.5 성장
                        
                       
                     
                        
                        if (Math.random() < growthChance && gameData.matchesPlayed % growthInterval === 0) {
                            // AI 팀 선수들의 능력치도 반올림 처리
                            player.rating = Math.min(99, Math.round(player.rating + growthAmount));
                        }
                    }
                });
            }
        });
    }

    // 선수 나이 증가 처리 (시즌마다)
    advancePlayerAges() {
        Object.keys(teams).forEach(teamKey => {
            teams[teamKey].forEach(player => {
                player.age++;
                
                // 나이가 증가하면서 성장 완료된 선수의 데이터 정리
                if (this.growthData.has(player.name)) {
                    const growthInfo = this.growthData.get(player.name);
                    if (growthInfo.remainingGrowth <= 0) {
                        this.growthData.delete(player.name);
                    }
                }
            });
        });
    }

    // 스쿼드 화면 업데이트
    updateSquadDisplay() {
        if (document.getElementById('squad').classList.contains('active')) {
            displayTeamPlayers();
            updateFormationDisplay();
        }
    }

    // 선수 성장 정보 조회
    getPlayerGrowthInfo(playerName) {
        return this.growthData.get(playerName) || null;
    }

    // 팀의 모든 선수 성장 정보 조회
    getTeamGrowthSummary() {
        if (!gameData.selectedTeam) return [];

        const teamPlayers = teams[gameData.selectedTeam];
        const summary = [];

        teamPlayers.forEach(player => {
            if (this.growthData.has(player.name)) {
                const growthInfo = this.growthData.get(player.name);
                const currentRating = Math.round(player.rating); // 현재 능력치 반올림
                const maxPotential = Math.round(currentRating + growthInfo.remainingGrowth); // 최대 포텐셜 반올림
                
                summary.push({
                    name: player.name,
                    position: player.position,
                    age: player.age,
                    currentRating: currentRating,
                    maxPotential: maxPotential,
                    remainingGrowth: Math.round(growthInfo.remainingGrowth * 10) / 10, // 남은 성장량도 반올림
                    monthlyGrowth: Math.round(growthInfo.monthlyGrowth * 100) / 100 // 월별 성장량 표시
                });
            }
        });

        return summary.sort((a, b) => b.maxPotential - a.maxPotential);
    }

    // 성장 시스템 리셋
    resetGrowthSystem() {
        this.growthData.clear();
    }

    // 저장 데이터 준비
    getSaveData() {
        const saveData = {};
        this.growthData.forEach((value, key) => {
            // 저장할 때도 모든 수치를 반올림 처리
            const roundedValue = {
                ...value,
                currentRating: Math.round(value.currentRating),
                maxGrowth: Math.round(value.maxGrowth * 10) / 10,
                remainingGrowth: Math.round(value.remainingGrowth * 10) / 10,
                monthlyGrowth: Math.round(value.monthlyGrowth * 100) / 100
            };
            saveData[key] = roundedValue;
        });
        return saveData;
    }

    // 저장 데이터 로드
    loadSaveData(saveData) {
        this.growthData.clear();
        Object.entries(saveData).forEach(([key, value]) => {
            // 로드할 때도 모든 수치를 반올림 처리
            const roundedValue = {
                ...value,
                currentRating: Math.round(value.currentRating),
                maxGrowth: Math.round(value.maxGrowth * 10) / 10,
                remainingGrowth: Math.round(value.remainingGrowth * 10) / 10,
                monthlyGrowth: Math.round(value.monthlyGrowth * 100) / 100
            };
            this.growthData.set(key, roundedValue);
        });
    }
}

// 전역 성장 시스템 인스턴스
const playerGrowthSystem = new PlayerGrowthSystem();

// 게임 초기화 시 성장 시스템 초기화
function initializePlayerGrowth() {
    playerGrowthSystem.initializePlayerGrowth();
}

// 경기 후 성장 처리
function processPostMatchGrowth() {
    playerGrowthSystem.processPlayerGrowth();
    playerGrowthSystem.processAllTeamsGrowth();
}

// 시즌 종료 시 나이 증가
function advancePlayerAges() {
    playerGrowthSystem.advancePlayerAges();
}

// 성장 정보 표시 함수 - 수정된 부분
function showGrowthSummary() {
    const summary = playerGrowthSystem.getTeamGrowthSummary();
    
    if (summary.length === 0) {
        alert("현재 성장 중인 선수가 없습니다.");
        return;
    }
    
    let message = `📈 선수 성장 현황\n\n`;
    
    summary.forEach((player, index) => {
        message += `${index + 1}. ${player.name}: ${player.currentRating}→${player.maxPotential} (남은: ${player.remainingGrowth}, 월 +${player.monthlyGrowth})\n`;
    });
    
    alert(message);
}

// 경기 종료 후 성장 처리를 전역으로 노출
window.processPostMatchGrowth = processPostMatchGrowth;
window.showGrowthSummary = showGrowthSummary;
window.playerGrowthSystem = playerGrowthSystem;
