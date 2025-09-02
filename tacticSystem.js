//tacticSystem.js

// 메모리 업데이트: 포지션별 골 확률이 FW: 75%, MF: 21%, DF: 4%로 설정됨

// 팀 전력 계산 함수들
function calculateUserTeamRating() {
    const squad = gameData.squad;
    let totalRating = 0;
    let playerCount = 0;

    // 골키퍼
    if (squad.gk) {
        totalRating += squad.gk.rating;
        playerCount++;
    }

    // 수비수들
    squad.df.forEach(player => {
        if (player) {
            totalRating += player.rating;
            playerCount++;
        }
    });

    // 미드필더들
    squad.mf.forEach(player => {
        if (player) {
            totalRating += player.rating;
            playerCount++;
        }
    });

    // 공격수들
    squad.fw.forEach(player => {
        if (player) {
            totalRating += player.rating;
            playerCount++;
        }
    });

    return playerCount > 0 ? totalRating / playerCount : 0;
}

function calculateOpponentTeamRating(teamKey) {
    const teamPlayers = teams[teamKey];
    if (!teamPlayers || teamPlayers.length === 0) return 70; // 기본값

    // 상위 11명의 평균 능력치 계산
    const sortedPlayers = teamPlayers.sort((a, b) => b.rating - a.rating);
    const topPlayers = sortedPlayers.slice(0, 11);
    const totalRating = topPlayers.reduce((sum, player) => sum + player.rating, 0);
    
    return totalRating / topPlayers.length;
}

function calculateTeamStrengthDifference() {
    const userRating = calculateUserTeamRating();
    const opponentRating = calculateOpponentTeamRating(gameData.currentOpponent);
    const difference = userRating - opponentRating;
    const strengthGap = Math.abs(difference);
    
    return {
        userRating: userRating,
        opponentRating: opponentRating,
        difference: difference,
        strengthGap: strengthGap,
        userAdvantage: difference > 0
    };
}

// 전력 계산을 수시로 업데이트하는 함수
function updateTeamStrength() {
    if (gameData.selectedTeam && gameData.currentOpponent) {
        const strengthData = calculateTeamStrengthDifference();
        
        // 전력 차이 정보를 화면에 표시 (있다면)
        const strengthDisplay = document.getElementById('strengthDisplay');
        if (strengthDisplay) {
            strengthDisplay.innerHTML = `
                <div>우리팀 전력: ${strengthData.userRating.toFixed(1)}</div>
                <div>상대팀 전력: ${strengthData.opponentRating.toFixed(1)}</div>
                <div>전력 차이: ${strengthData.difference > 0 ? '+' : ''}${strengthData.difference.toFixed(1)}</div>
                <div>상대적 우위: ${strengthData.userAdvantage ? '유리' : '불리'}</div>
            `;
        }
        
        return strengthData;
    }
    return null;
}

// 주기적으로 전력 계산 업데이트 (5초마다)
setInterval(() => {
    updateTeamStrength();
}, 5000);

// 전술 시스템
class TacticSystem {
    constructor() {
        // 전술 데이터
        this.tactics = {
            gegenpress: {
                name: "게겐프레싱",
                effective: ["twoLine", "possession"],
                ineffective: ["longBall", "catenaccio"],
                description: "높은 압박으로 빠른 역습을 노리는 전술"
            },
            twoLine: {
                name: "두 줄 수비",
                effective: ["longBall", "parkBus"],
                ineffective: ["gegenpress", "totalFootball"],
                description: "견고한 수비 라인으로 상대 공격을 차단"
            },
            lavolpiana: {
                name: "라볼피아나",
                effective: ["possession", "tikitaka"],
                ineffective: ["catenaccio", "longBall"],
                description: "측면 공격과 크로스를 중심으로 한 전술"
            },
            longBall: {
                name: "롱볼축구",
                effective: ["parkBus", "catenaccio"],
                ineffective: ["gegenpress", "tikitaka"],
                description: "긴 패스로 빠르게 공격을 전개하는 전술"
            },
            possession: {
                name: "점유율 축구",
                effective: ["tikitaka", "lavolpiana"],
                ineffective: ["longBall", "gegenpress"],
                description: "공을 오래 소유하며 천천히 공격 기회를 만드는 전술"
            },
            parkBus: {
                name: "침대 축구",
                effective: ["catenaccio", "twoLine"],
                ineffective: ["gegenpress", "totalFootball"],
                description: "극도로 수비적인 전술로 역습을 노림"
            },
            catenaccio: {
                name: "카테나치오",
                effective: ["twoLine", "parkBus"],
                ineffective: ["possession", "totalFootball"],
                description: "이탈리아식 견고한 수비 전술"
            },
            totalFootball: {
                name: "토탈 풋볼",
                effective: ["tikitaka", "gegenpress"],
                ineffective: ["twoLine", "catenaccio"],
                description: "모든 선수가 공격과 수비에 참여하는 전술"
            },
            tikitaka: {
                name: "티키타카",
                effective: ["possession", "lavolpiana"],
                ineffective: ["longBall", "parkBus"],
                description: "짧은 패스를 연결하며 공간을 만드는 전술"
            }
        };

        // 각 팀의 기본 전술
        this.teamTactics = {
            manCity: "tikitaka",
            liverpool: "gegenpress",
            manUnited: "possession",
            arsenal: "twoLine",
            chelsea: "longBall",
            tottenham: "gegenpress",
            realMadrid: "possession",
            barcelona: "totalFootball",
            acMilan: "gegenpress",
            inter: "totalFootball",
            bayern: "tikitaka",
            psg: "possession",
            leverkusen: "longBall",
            dortmund: "gegenpress",
            newCastle: "lavolpiana",
            asRoma: "longBall",
            atMadrid: "catenaccio",
            napoli: "parkBus",
            seryun: "longBall"
        };
    }

    // 전술 효과 계산
    calculateTacticEffect(userTactic, opponentTactic) {
        const userTacticData = this.tactics[userTactic];
        const opponentTacticData = this.tactics[opponentTactic];

        let effect = 0;

        // 내 전술이 상대 전술에 효과적인 경우
        if (userTacticData.effective.includes(opponentTactic)) {
            effect += 15; // 사기 +15
        }
        // 내 전술이 상대 전술에 비효과적인 경우
        else if (userTacticData.ineffective.includes(opponentTactic)) {
            effect -= 10; // 사기 -10
        }

        return effect;
    }

    // 상대팀의 전술 가져오기
    getOpponentTactic(opponentTeam) {
        return this.teamTactics[opponentTeam] || "possession";
    }

    // 전술에 따른 경기 이벤트 확률 조정
    getTacticModifiers(tactic) {
        const modifiers = {
            goalChance: 0,
            foulChance: 0,
            possessionBonus: 0,
            passAccuracy: 0
        };

        switch (tactic) {
            case "gegenpress":
                modifiers.goalChance = 0.01;
                modifiers.foulChance = 0.01;
                modifiers.possessionBonus = -5;
                modifiers.passAccuracy = -2;
                break;
            case "twoLine":
                modifiers.goalChance = -0.005;
                modifiers.foulChance = 0.005;
                modifiers.possessionBonus = -10;
                modifiers.passAccuracy = 5;
                break;
            case "lavolpiana":
                modifiers.goalChance = 0.005;
                modifiers.foulChance = 0;
                modifiers.possessionBonus = 5;
                modifiers.passAccuracy = 3;
                break;
            case "longBall":
                modifiers.goalChance = 0.008;
                modifiers.foulChance = -0.005;
                modifiers.possessionBonus = -15;
                modifiers.passAccuracy = -5;
                break;
            case "possession":
                modifiers.goalChance = 0;
                modifiers.foulChance = -0.01;
                modifiers.possessionBonus = 15;
                modifiers.passAccuracy = 8;
                break;
            case "parkBus":
                modifiers.goalChance = -0.01;
                modifiers.foulChance = 0.015;
                modifiers.possessionBonus = -20;
                modifiers.passAccuracy = -3;
                break;
            case "catenaccio":
                modifiers.goalChance = -0.008;
                modifiers.foulChance = 0.01;
                modifiers.possessionBonus = -12;
                modifiers.passAccuracy = 2;
                break;
            case "totalFootball":
                modifiers.goalChance = 0.01;
                modifiers.foulChance = 0;
                modifiers.possessionBonus = 8;
                modifiers.passAccuracy = 5;
                break;
            case "tikitaka":
                modifiers.goalChance = 0.005;
                modifiers.foulChance = -0.01;
                modifiers.possessionBonus = 20;
                modifiers.passAccuracy = 10;
                break;
        }

        return modifiers;
    }

    // 전술 설명 가져오기
    getTacticDescription(tactic) {
        return this.tactics[tactic] ? this.tactics[tactic].description : "";
    }

    // 전술 이름 가져오기
    getTacticName(tactic) {
        return this.tactics[tactic] ? this.tactics[tactic].name : tactic;
    }

    // 전술 상성 정보 가져오기
    getTacticMatchup(userTactic, opponentTactic) {
        const userTacticData = this.tactics[userTactic];
        const opponentTacticData = this.tactics[opponentTactic];

        let result = "중립";
        let advantage = 0;

        if (userTacticData.effective.includes(opponentTactic)) {
            result = "유리";
            advantage = 5;
        } else if (userTacticData.ineffective.includes(opponentTactic)) {
            result = "불리";
            advantage = -3;
        }

        return {
            result: result,
            advantage: advantage,
            userTacticName: this.getTacticName(userTactic),
            opponentTacticName: this.getTacticName(opponentTactic),
            description: `${this.getTacticName(userTactic)} vs ${this.getTacticName(opponentTactic)}: ${result}`
        };
    }

    // 모든 전술 목록 가져오기
    getAllTactics() {
        return Object.keys(this.tactics).map(key => ({
            key: key,
            name: this.tactics[key].name,
            description: this.tactics[key].description
        }));
    }

    // 추천 전술 계산
    getRecommendedTactic(opponentTactic) {
        const recommendations = [];

        Object.keys(this.tactics).forEach(tacticKey => {
            const tactic = this.tactics[tacticKey];
            if (tactic.effective.includes(opponentTactic)) {
                recommendations.push({
                    key: tacticKey,
                    name: tactic.name,
                    reason: `${this.getTacticName(opponentTactic)}에 효과적`
                });
            }
        });

        return recommendations;
    }

    // 전술 변경 시 팀 사기 영향
    changeTactic(newTactic) {
        const oldTactic = gameData.currentTactic;
        gameData.currentTactic = newTactic;

        // 전술 변경에 따른 사기 변화 (작은 변화)
        const moraleChange = Math.floor(Math.random() * 3) - 1; // -1, 0, 1
        gameData.teamMorale = Math.max(0, Math.min(100, gameData.teamMorale + moraleChange));

        return {
            oldTactic: this.getTacticName(oldTactic),
            newTactic: this.getTacticName(newTactic),
            moraleChange: moraleChange
        };
    }
}

// 경기 시뮬레이션에서 사용할 함수들
function startMatch() {
    if (!gameData.selectedTeam || !gameData.currentOpponent) {
        alert("팀이나 상대가 설정되지 않았습니다.");
        return;
    }

    // 스쿼드 확인
    const squad = gameData.squad;
    const requiredPlayers = 11;
    let currentPlayers = 0;

    if (squad.gk) currentPlayers++;
    squad.df.forEach(player => { if (player) currentPlayers++; });
    squad.mf.forEach(player => { if (player) currentPlayers++; });
    squad.fw.forEach(player => { if (player) currentPlayers++; });

    if (currentPlayers < requiredPlayers) {
        alert(`스쿼드에 ${requiredPlayers - currentPlayers}명의 선수가 더 필요합니다.`);
        return;
    }

    // 경기 화면으로 전환
    showScreen('matchScreen');
    
    // 경기 초기화
    const matchData = {
        homeTeam: gameData.selectedTeam,
        awayTeam: gameData.currentOpponent,
        homeScore: 0,
        awayScore: 0,
        minute: 0,
        events: [],
        isRunning: false // 처음에는 중지 상태
    };

    // 전술 효과 계산
    const tacticSystem = new TacticSystem();
    const opponentTactic = tacticSystem.getOpponentTactic(gameData.currentOpponent);
    const tacticEffect = tacticSystem.calculateTacticEffect(gameData.currentTactic, opponentTactic);
    
    // 팀 전력 차이 계산
    const strengthDiff = calculateTeamStrengthDifference();
    
    // 사기에 전술 효과 적용
    gameData.teamMorale = Math.max(0, Math.min(100, gameData.teamMorale + tacticEffect));

    // 화면 업데이트
    document.getElementById('homeTeam').textContent = teamNames[matchData.homeTeam];
    document.getElementById('awayTeam').textContent = teamNames[matchData.awayTeam];
    document.getElementById('scoreDisplay').textContent = `${matchData.homeScore} - ${matchData.awayScore}`;
    document.getElementById('matchTime').textContent = '0분';
    document.getElementById('eventList').innerHTML = '';

    // 전술 상성 정보 표시
    const matchup = tacticSystem.getTacticMatchup(gameData.currentTactic, opponentTactic);
    const tacticInfo = document.createElement('div');
    tacticInfo.className = 'event-card';
    tacticInfo.innerHTML = `
        <div class="event-time">경기 전</div>
        <div>전술 상성: ${matchup.description}</div>
        <div>우리팀 평균: ${strengthDiff.userRating.toFixed(1)} vs 상대팀: ${strengthDiff.opponentRating.toFixed(1)}</div>
        <div>전력 차이: ${strengthDiff.difference > 0 ? '+' : ''}${strengthDiff.difference.toFixed(1)} (${strengthDiff.userAdvantage ? '유리' : '불리'})</div>
        <div>사기 변화: ${tacticEffect > 0 ? '+' : ''}${tacticEffect}</div>
    `;
    document.getElementById('eventList').appendChild(tacticInfo);

    // 킥오프 버튼 표시
    showKickoffButton(matchData, tacticSystem, strengthDiff);
}

// 킥오프 버튼 표시
function showKickoffButton(matchData, tacticSystem, strengthDiff) {
    const eventList = document.getElementById('eventList');
    
    // 킥오프 안내 메시지
    const kickoffInfo = document.createElement('div');
    kickoffInfo.className = 'event-card kickoff-ready';
    kickoffInfo.innerHTML = `
        <div class="event-time">준비 완료</div>
        <div>경기 시작 준비가 완료되었습니다.</div>
        <button id="kickoffBtn" class="btn primary" style="margin-top: 10px;">⚽ 킥오프</button>
    `;
    eventList.appendChild(kickoffInfo);

    // 킥오프 버튼 이벤트
    document.getElementById('kickoffBtn').addEventListener('click', () => {
        startMatchSimulation(matchData, tacticSystem, strengthDiff);
        kickoffInfo.remove(); // 킥오프 버튼 제거
    });
}

// 실제 경기 시뮬레이션 시작
function startMatchSimulation(matchData, tacticSystem, strengthDiff) {
    matchData.isRunning = true;
    matchData.strengthDiff = strengthDiff; // 전력 차이 데이터 저장
    
    // 킥오프 메시지
    const kickoffEvent = {
        minute: 0,
        type: 'kickoff',
        description: `🟢 경기 시작! ${teamNames[matchData.homeTeam]} vs ${teamNames[matchData.awayTeam]}`
    };
    displayEvent(kickoffEvent, matchData);

    // 경기 시뮬레이션 시작
    simulateMatch(matchData, tacticSystem);
}

function simulateMatch(matchData, tacticSystem) {
    const matchInterval = setInterval(() => {
        if (!matchData.isRunning || matchData.minute >= 90) {
            if (matchData.minute >= 90) {
                endMatch(matchData);
            }
            clearInterval(matchInterval);
            return;
        }

        matchData.minute++;
        document.getElementById('matchTime').textContent = matchData.minute + '분';

        // 35% 확률로 이벤트 발생
        if (Math.random() > 0.4) {
            return; // 이벤트가 발생하지 않음
        }

        // 이벤트 발생 확률 계산
        const userModifiers = tacticSystem.getTacticModifiers(gameData.currentTactic);
        const opponentTactic = tacticSystem.getOpponentTactic(gameData.currentOpponent);
        const opponentModifiers = tacticSystem.getTacticModifiers(opponentTactic);

        // 팀 전력 차이에 따른 골 확률 조정
        const strengthDiff = matchData.strengthDiff;
        const strengthFactor = strengthDiff.difference / 60; // 50점 차이당 1% 골 확률 변화
        
        // 랜덤 이변 요소 (매 분마다 5% 확률로 이변 모드 활성화)
        const upsetMode = Math.random() < 0.07; // 5% 확률로 이변 모드
        let upsetFactor = 0;
        
        if (upsetMode) {
            // 이변 모드일 때 약한 팀에게 보너스 (최대 15% 골 확률 증가)
            upsetFactor = (Math.random() * 0.15) + 0.05; // 5~20% 보너스
            
            // 이변 메시지 출력 (10분마다 한 번씩만)
            if (matchData.minute % 10 === 0) {
                const upsetEvent = {
                    minute: matchData.minute,
                    type: 'upset',
                    description: `✨ ${strengthDiff.userAdvantage ? teamNames[gameData.currentOpponent] : teamNames[gameData.selectedTeam]}이(가) 예상 외의 좋은 플레이를 보이고 있습니다!`
                };
                displayEvent(upsetEvent, matchData);
            }
        }
        
        // 기본 골 확률을 3%로 설정
        let baseGoalChance = 0.015;
        const baseFoulChance = 0.08;
        const basePassChance = 0.755;
        const baseThrowInChance = 0.06;
        const baseGoalKickChance = 0.04;
        const baseCornerChance = 0.03;

        const eventRoll = Math.random();
        let event = null;

        // 골 이벤트 (사용자팀과 상대팀 각각 체크) - 전력 차이 반영
        let userGoalChance = baseGoalChance + userModifiers.goalChance;
        let opponentGoalChance = baseGoalChance + opponentModifiers.goalChance;
        
      
        // 전력 차이 적용 (강한 팀이 더 많은 골 기회)
        if (strengthDiff.userAdvantage) {
            userGoalChance += Math.abs(strengthFactor);
            opponentGoalChance -= Math.abs(strengthFactor) * 0.3; // 상대는 절반만큼 감소
            
            // 이변 모드에서는 약한 팀(상대)에게 보너스
            if (upsetMode) {
                opponentGoalChance += upsetFactor;
                userGoalChance -= upsetFactor * 0.3; // 강한 팀은 약간 감소
            }
        } else {
            opponentGoalChance += Math.abs(strengthFactor);
            userGoalChance -= Math.abs(strengthFactor) * 0.5; // 우리가 절반만큼 감소
            
            // 이변 모드에서는 약한 팀(우리)에게 보너스
            if (upsetMode) {
                userGoalChance += upsetFactor;
                opponentGoalChance -= upsetFactor * 0.3; // 강한 팀은 약간 감소
            }
        }
        
        // 추가 랜덤 요소 (-이십% 변동)
        const randomVariation = 0.8 + (Math.random() * 0.1); // 0.8 ~ 1.2
        userGoalChance *= randomVariation;
        opponentGoalChance *= (2 - randomVariation); // 반대로 적용
        
        // 음수 방지
        userGoalChance = Math.max(0.01, userGoalChance);
        opponentGoalChance = Math.max(0.01, opponentGoalChance);
        
        if (eventRoll < userGoalChance) {
            event = createGoalEvent(matchData, true); // 사용자팀 골
        } else if (eventRoll < userGoalChance + opponentGoalChance) {
            event = createGoalEvent(matchData, false); // 상대팀 골
        } else if (eventRoll < userGoalChance + opponentGoalChance + baseFoulChance) {
            event = createFoulEvent(matchData);
        } else if (eventRoll < userGoalChance + opponentGoalChance + baseFoulChance + basePassChance) {
            event = createPassEvent(matchData);
        } else if (eventRoll < userGoalChance + opponentGoalChance + baseFoulChance + basePassChance + baseThrowInChance) {
            event = createThrowInEvent(matchData);
        } else if (eventRoll < userGoalChance + opponentGoalChance + baseFoulChance + basePassChance + baseThrowInChance + baseGoalKickChance) {
            event = createGoalKickEvent(matchData);
        } else {
            event = createCornerEvent(matchData);
        }

        if (event) {
            displayEvent(event, matchData);
        }

    }, 1000); // 1초마다 1분 경과
}

function createGoalEvent(matchData, isUserTeam) {
    const team = isUserTeam ? gameData.selectedTeam : gameData.currentOpponent;
    const teamName = teamNames[team];
    
    // 골 넣은 선수 결정
    let scorer = null;
    let scorerPosition = null;
    
    if (isUserTeam) {
        // 사용자 팀에서 골 넣은 선수 선택 - 포지션별 확률 (FW: 75%, MF: 21%, DF: 4%)
        const squad = gameData.squad;
        const possibleScorers = [];
        
        // 공격수 (75% 확률)
        squad.fw.forEach(player => {
            if (player) {
                for (let i = 0; i < 75; i++) possibleScorers.push(player);
            }
        });
        
        // 미드필더 (21% 확률)
        squad.mf.forEach(player => {
            if (player) {
                for (let i = 0; i < 21; i++) possibleScorers.push(player);
            }
        });
        
        // 수비수 (4% 확률)
        squad.df.forEach(player => {
            if (player) {
                for (let i = 0; i < 4; i++) possibleScorers.push(player);
            }
        });
        
        if (possibleScorers.length > 0) {
            scorer = possibleScorers[Math.floor(Math.random() * possibleScorers.length)];
        }
    } else {
        // 상대 팀에서 포지션별 확률로 선수 선택
        const teamPlayers = teams[team];
        const forwards = teamPlayers.filter(p => p.position === 'FW').sort((a, b) => b.rating - a.rating);
        const midfielders = teamPlayers.filter(p => p.position === 'MF').sort((a, b) => b.rating - a.rating);
        const defenders = teamPlayers.filter(p => p.position === 'DF').sort((a, b) => b.rating - a.rating);
        
        const possibleScorers = [];
        
        // 공격수 (75% 확률) - 상위 3명만
        forwards.slice(0, 3).forEach(player => {
            for (let i = 0; i < 75; i++) possibleScorers.push(player);
        });
        
        // 미드필더 (21% 확률) - 상위 3명만
        midfielders.slice(0, 3).forEach(player => {
            for (let i = 0; i < 21; i++) possibleScorers.push(player);
        });
        
        // 수비수 (4% 확률) - 상위 4명만
        defenders.slice(0, 4).forEach(player => {
            for (let i = 0; i < 4; i++) possibleScorers.push(player);
        });
        
        if (possibleScorers.length > 0) {
            scorer = possibleScorers[Math.floor(Math.random() * possibleScorers.length)];
        }
    }

    // 어시스트 선수 결정 (85% 확률로 어시스트 존재)
    let assister = null;
    const hasAssist = Math.random() < 0.85; // 85% 확률
    
    if (hasAssist && scorer) {
        if (isUserTeam) {
            // 사용자 팀에서 어시스트 선수 선택 - 포지션별 확률 (FW: 50%, MF: 45%, DF: 5%)
            const squad = gameData.squad;
            const possibleAssisters = [];
            
            // 공격수 (50% 확률) - 득점자 제외
            squad.fw.forEach(player => {
                if (player && player.name !== scorer.name) {
                    for (let i = 0; i < 50; i++) possibleAssisters.push(player);
                }
            });
            
            // 미드필더 (45% 확률) - 득점자 제외
            squad.mf.forEach(player => {
                if (player && player.name !== scorer.name) {
                    for (let i = 0; i < 45; i++) possibleAssisters.push(player);
                }
            });
            
            // 수비수 (5% 확률) - 득점자 제외
            squad.df.forEach(player => {
                if (player && player.name !== scorer.name) {
                    for (let i = 0; i < 5; i++) possibleAssisters.push(player);
                }
            });
            
            if (possibleAssisters.length > 0) {
                assister = possibleAssisters[Math.floor(Math.random() * possibleAssisters.length)];
            }
        } else {
            // 상대 팀에서 어시스트 선수 선택
            const teamPlayers = teams[team];
            const forwards = teamPlayers.filter(p => p.position === 'FW' && p.name !== scorer.name).sort((a, b) => b.rating - a.rating);
            const midfielders = teamPlayers.filter(p => p.position === 'MF' && p.name !== scorer.name).sort((a, b) => b.rating - a.rating);
            const defenders = teamPlayers.filter(p => p.position === 'DF' && p.name !== scorer.name).sort((a, b) => b.rating - a.rating);
            
            const possibleAssisters = [];
            
            // 공격수 (50% 확률) - 상위 3명만, 득점자 제외
            forwards.slice(0, 3).forEach(player => {
                for (let i = 0; i < 50; i++) possibleAssisters.push(player);
            });
            
            // 미드필더 (45% 확률) - 상위 3명만, 득점자 제외
            midfielders.slice(0, 3).forEach(player => {
                for (let i = 0; i < 45; i++) possibleAssisters.push(player);
            });
            
            // 수비수 (5% 확률) - 상위 4명만, 득점자 제외
            defenders.slice(0, 4).forEach(player => {
                for (let i = 0; i < 5; i++) possibleAssisters.push(player);
            });
            
            if (possibleAssisters.length > 0) {
                assister = possibleAssisters[Math.floor(Math.random() * possibleAssisters.length)];
            }
        }
    }

    // 점수 업데이트
    if (isUserTeam) {
        matchData.homeScore++;
    } else {
        matchData.awayScore++;
    }

    document.getElementById('scoreDisplay').textContent = `${matchData.homeScore} - ${matchData.awayScore}`;

    // 골 타이밍과 상황에 따른 특별 메시지
    let specialMessage = "";
    const totalGoals = matchData.homeScore + matchData.awayScore;
    const scoreDiff = Math.abs(matchData.homeScore - matchData.awayScore);
    
    // 선제골 메시지
    if (totalGoals === 1) {
        specialMessage = " 🚀 선제골!";
    }
    
    if (matchData.minute >= 85) {
        if (scoreDiff <= 1) {
            specialMessage += " 🔥 극적인 골!";
        } else if (scoreDiff === 2) {
            specialMessage += " ⚡ 결정적인 골!";
        }
    } else if (matchData.minute >= 75) {
        if (scoreDiff === 1) {
            specialMessage += " ⚡ 후반 중요한 동점골!";
        } else {
            specialMessage += " ⚡ 후반 중요한 골!";
        }
    } else if (matchData.minute <= 5) {
        if (totalGoals === 1) {
            specialMessage = " 🚀 경기 시작과 함께 선제골!";
        } else {
            specialMessage += " 🚀 경기 초반 골!";
        }
    }
    
    // 추격골이나 역전골 메시지
    if (totalGoals >= 2) {
        const prevScoreDiff = isUserTeam ? 
            Math.abs((matchData.homeScore - 1) - matchData.awayScore) : 
            Math.abs(matchData.homeScore - (matchData.awayScore - 1));
        
        // 동점골 (가장 우선)
        if (scoreDiff === 0) {
            specialMessage += " ⚖️ 동점골!";
        }
        // 추격골 (2골 차에서 1골 차로)
        else if (prevScoreDiff >= 2 && scoreDiff <= 1) {
            specialMessage += " 🎯 추격골!";
        }
        // 역전골 체크
        else if (totalGoals >= 3) {
            // 이전에 뒤지고 있었는데 이제 앞서는 상황
            const prevHomeScore = isUserTeam ? matchData.homeScore - 1 : matchData.homeScore;
            const prevAwayScore = isUserTeam ? matchData.awayScore : matchData.awayScore - 1;
            
            if ((isUserTeam && prevHomeScore < prevAwayScore && matchData.homeScore > matchData.awayScore) ||
                (!isUserTeam && prevAwayScore < prevHomeScore && matchData.awayScore > matchData.homeScore)) {
                specialMessage += " 🔄 역전골!";
            }
        }
    }

    // 다양한 어시스트 메시지 배열
    const assistMessages = [
        // FW 어시스트 메시지 (공격적, 개인기 중심)
        "의 화려한 드리블 이후 완벽한 패스!",
        "의 감각적인 터치로 골문을 열어줬습니다!",
        "의 환상적인 개인기 후 찬스 메이킹!",
        "의 빠른 발놀림으로 수비를 농락한 뒤 어시스트!",
        "의 침착한 마무리 패스가 골로 연결됐습니다!",
        "의 눈부신 볼 컨트롤 후 결정적 패스!",
        "의 순간적인 판단력이 빛난 어시스트!",
        "의 기습적인 돌파 후 완벽한 패스!",
        "의 예술적인 터치가 골을 만들어냈습니다!",
        "의 창조적인 플레이로 골 기회 창출!",
        
        // MF 어시스트 메시지 (패스, 시야, 게임메이킹 중심)
        "의 감각적인 아웃프런트 패스!",
        "의 환상적인 시야로 완벽한 찬스 메이킹!",
        "의 정교한 스루패스가 수비라인을 갈랐습니다!",
        "의 킬패스가 골문을 열어젖혔습니다!",
        "의 날카로운 침투패스!",
        "의 절묘한 타이밍의 패스!",
        "의 예측불허 패스가 골로 이어졌습니다!",
        "의 완벽한 게임 리딩으로 만든 골!",
        "의 천재적인 발상의 전환으로 어시스트!",
        "의 마에스트로다운 패스 워크!",
        "의 창의적인 백힐 패스!",
        "의 로빙 패스가 수비를 무력화시켰습니다!",
        "의 순간적인 플레이메이킹!",
        "의 정밀한 장거리 패스!",
        
        // DF 어시스트 메시지 (장거리, 크로스, 의외성 중심)
        "의 놀라운 장거리 패스!",
        "의 예상치 못한 오버래핑으로 크로스!",
        "의 기습적인 측면 돌파 후 센터링!",
        "의 롱볼이 완벽하게 연결됐습니다!",
        "의 의외의 공격 가담으로 어시스트!",
        "의 정확한 크로스가 골로 이어졌습니다!",
        "의 서프라이즈 어시스트!",
        "의 긴 패스가 상대 수비를 뚫었습니다!",
        "의 깜짝 공격 가담으로 골 어시스트!",
        "의 절묘한 타이밍의 중거리 패스!"
    ];

    // 어시스트 선수의 포지션에 따라 적절한 메시지 선택
    function getAssistMessage(assisterPosition) {
        let messagePool = [];
        
        if (assisterPosition === 'FW') {
            // FW 메시지 (0-9번 인덱스)
            messagePool = assistMessages.slice(0, 10);
        } else if (assisterPosition === 'MF') {
            // MF 메시지 (10-23번 인덱스)  
            messagePool = assistMessages.slice(10, 24);
        } else if (assisterPosition === 'DF') {
            // DF 메시지 (24-33번 인덱스)
            messagePool = assistMessages.slice(24, 34);
        } else {
            // 기본 메시지
            messagePool = assistMessages.slice(10, 20);
        }
        
        return messagePool[Math.floor(Math.random() * messagePool.length)];
    }

    // 골 완성 메시지 배열
    const goalFinishMessages = [
        "의 완벽한 골!",
        "의 환상적인 골!",
        "의 멋진 골!",
        "의 강력한 골!",
        "의 정확한 골!",
        "의 침착한 골!",
        "의 기막힌 골!",
        "의 예술적인 골!",
        "의 완성도 높은 골!",
        "의 절묘한 골!",
        "가 골네트를 흔들었습니다!",
        "가 골문을 갈랐습니다!",
        "의 마무리가 골로 이어졌습니다!",
        "가 골을 만들어냈습니다!",
        "의 슛이 골문을 찾았습니다!"
    ];

    // 어시스트 정보를 포함한 골 메시지 생성
    let goalDescription;
    if (assister) {
        const assistMessage = getAssistMessage(assister.position);
        const goalFinish = goalFinishMessages[Math.floor(Math.random() * goalFinishMessages.length)];
        
        goalDescription = `⚽ ${teamName}의 ${assister.name}(${assister.rating})${assistMessage} ${scorer.name}(${scorer.rating})${goalFinish}${specialMessage}`;
    } else {
        // 어시스트 없을 때도 다양한 골 메시지
        const soloGoalMessages = [
            "의 개인기가 빛난 골!",
            "의 독주골!",
            "가 혼자서 만들어낸 골!",
            "의 단독 돌파골!",
            "의 완벽한 개인플레이!",
            "의 기막힌 개인기!",
            "가 혼자 힘으로 골을 만들었습니다!",
            "의 솔로런이 골로 이어졌습니다!",
            "의 순간적인 판단력이 만든 골!",
            "의 클래스가 돋보인 골!"
        ];
        
        const soloMessage = soloGoalMessages[Math.floor(Math.random() * soloGoalMessages.length)];
        goalDescription = `⚽ ${teamName}의 ${scorer ? scorer.name : '선수'}(${scorer ? scorer.rating : '?'})${soloMessage}${specialMessage}`;
    }

    return {
        minute: matchData.minute,
        type: 'goal',
        team: teamName,
        scorer: scorer ? scorer.name : '선수',
        assister: assister ? assister.name : null,
        description: goalDescription
    };
}

function createFoulEvent(matchData) {
    const teams = [gameData.selectedTeam, gameData.currentOpponent];
    const team = teams[Math.floor(Math.random() * teams.length)];
    
    return {
        minute: matchData.minute,
        type: 'foul',
        team: teamNames[team],
        description: `⚠️ ${teamNames[team]}의 파울입니다.`
    };
}

function createPassEvent(matchData) {
    const teams = [gameData.selectedTeam, gameData.currentOpponent];
    const team = teams[Math.floor(Math.random() * teams.length)];
    const message = passMessages[Math.floor(Math.random() * passMessages.length)];
    
    return {
        minute: matchData.minute,
        type: 'pass',
        team: teamNames[team],
        description: `⚽ ${teamNames[team]}${message}`
    };
}

function createThrowInEvent(matchData) {
    const teams = [gameData.selectedTeam, gameData.currentOpponent];
    const team = teams[Math.floor(Math.random() * teams.length)];
    
    return {
        minute: matchData.minute,
        type: 'throwin',
        team: teamNames[team],
        description: `🤾 ${teamNames[team]}의 스로인입니다.`
    };
}

function createGoalKickEvent(matchData) {
    const teams = [gameData.selectedTeam, gameData.currentOpponent];
    const team = teams[Math.floor(Math.random() * teams.length)];
    
    return {
        minute: matchData.minute,
        type: 'goalkick',
        team: teamNames[team],
        description: `🥅 ${teamNames[team]}의 골킥입니다.`
    };
}

function createCornerEvent(matchData) {
    const teams = [gameData.selectedTeam, gameData.currentOpponent];
    const team = teams[Math.floor(Math.random() * teams.length)];
    
    return {
        minute: matchData.minute,
        type: 'corner',
        team: teamNames[team],
        description: `🚩 ${teamNames[team]}의 코너킥입니다.`
    };
}

function displayEvent(event, matchData) {
    const eventList = document.getElementById('eventList');
    const eventCard = document.createElement('div');
    
    // 이벤트 타입에 따라 클래스 추가
    eventCard.className = `event-card ${event.type}`;
    
    eventCard.innerHTML = `
        <div class="event-time">${event.minute}분</div>
        <div>${event.description}</div>
    `;
    
    eventList.appendChild(eventCard);
    eventList.scrollTop = eventList.scrollHeight;
    
    matchData.events.push(event);
}

function endMatch(matchData) {
    document.getElementById('endMatchBtn').style.display = 'block';

    // 경기 결과 계산
    const userScore = matchData.homeScore;
    const opponentScore = matchData.awayScore;
    let result = '';
    let moraleChange = 0;
    let points = 0;

    // 전력 차이에 따른 결과 반영
    const strengthDiff = matchData.strengthDiff;
    const isUpset = (userScore > opponentScore && !strengthDiff.userAdvantage) ||
                     (userScore < opponentScore && strengthDiff.userAdvantage);

    if (userScore > opponentScore) {
        result = '승리';
        if (strengthDiff.userAdvantage) {
            moraleChange = Math.floor(Math.random() * 8) + 5; // 5-12
        } else {
            moraleChange = Math.floor(Math.random() * 15) + 10; // 10-24
        }
        points = 3;
        
        gameData.teamMoney += 50;
        if (gameData.currentSponsor) {
            gameData.teamMoney += gameData.currentSponsor.payPerWin;
        }
    } else if (userScore < opponentScore) {
        result = '패배';
        if (!strengthDiff.userAdvantage) {
            moraleChange = -(Math.floor(Math.random() * 8) + 3); // -3 to -10
        } else {
            moraleChange = -(Math.floor(Math.random() * 15) + 10); // -10 to -24
        }
        points = 0;
        
        gameData.teamMoney += 10;
        if (gameData.currentSponsor) {
            gameData.teamMoney += gameData.currentSponsor.payPerLoss;
        }
    } else {
        result = '무승부';
        if (strengthDiff.strengthGap < 5) {
            moraleChange = Math.floor(Math.random() * 3) - 1; // -1 to 1
        } else if (strengthDiff.userAdvantage) {
            moraleChange = -(Math.floor(Math.random() * 5) + 2); // -2 to -6
        } else {
            moraleChange = Math.floor(Math.random() * 8) + 3; // 3-10
        }
        points = 1;
        
        gameData.teamMoney += 15;
        if (gameData.currentSponsor) {
            gameData.teamMoney += Math.floor(gameData.currentSponsor.payPerWin / 2);
        }
    }

    // 리그 데이터 업데이트 - 수정된 부분 👇
    const userLeague = allTeams[gameData.selectedTeam].league;
    updateLeagueData(userLeague, matchData, points);
    
    // 사기 업데이트
    gameData.teamMorale = Math.max(0, Math.min(100, gameData.teamMorale + moraleChange));
    
    // 경기 수 증가
    gameData.matchesPlayed++;
    
    // 경기 종료 메시지 (이변 여부 반영)
    let finalMessage = `경기 종료! ${result} (${userScore}-${opponentScore})`;
    
    if (isUpset) {
        if (result === '승리') {
            finalMessage += `\n🎉 대이변! 전력상 불리했던 경기에서 승리!`;
        } else if (result === '패배') {
            finalMessage += `\n😱 충격! 전력상 유리했던 경기에서 패배...`;
        }
    }
    
    finalMessage += `\n${strengthDiff.userAdvantage ? '전력상 유리했던' : '전력상 불리했던'} 경기에서 ${result}`;
    finalMessage += `\n사기 변화: ${moraleChange > 0 ? '+' : ''}${moraleChange}`;
    
    const finalEvent = {
        minute: 90,
        type: 'final',
        description: finalMessage
    };
    displayEvent(finalEvent, matchData);
    
    // 경기 종료 버튼 이벤트
    document.getElementById('endMatchBtn').onclick = () => {
        // 인터뷰 화면으로 이동
        startInterview(result, userScore, opponentScore, strengthDiff);
    };
    
    // 선수 성장 처리
    if (typeof processPostMatchGrowth === 'function') {
        setTimeout(() => {
            processPostMatchGrowth();
        }, 2000);
    }

    // 개인기록 업데이트
    if (typeof updateRecordsAfterMatch === 'function') {
        updateRecordsAfterMatch(matchData);
    }
    
    // AI 팀들 경기 시뮬레이션
    simulateOtherMatches();
}

function updateLeagueData(matchData, points) {
    // 사용자 팀 데이터 업데이트
    
     // 현재 리그 확인
    const currentLeague = gameData.currentLeague;
    const divisionKey = `division${currentLeague}`;
    
    // 사용자 팀 데이터 업데이트
    const userData = gameData.leagueData[divisionKey][gameData.selectedTeam];
    if (!userData) {
        console.error('User team data not found:', gameData.selectedTeam);
        return;
    }
    if (points === 3) {
        userData.wins++;
    } else if (points === 1) {
        userData.draws++;
    } else {
        userData.losses++;
    }
    
    // 상대팀 데이터 업데이트
    const opponentData = gameData.leagueData[gameData.currentOpponent];
    opponentData.matches++;
    opponentData.goalsFor += matchData.awayScore;
    opponentData.goalsAgainst += matchData.homeScore;
    
    if (matchData.homeScore > matchData.awayScore) {
        opponentData.losses++;
    } else if (matchData.homeScore < matchData.awayScore) {
        opponentData.wins++;
        opponentData.points += 3;
    } else {
        opponentData.draws++;
        opponentData.points += 1;
    }
}

function simulateOtherMatches() {
    // 다른 팀들의 경기를 시뮬레이션 (전력 차이 반영)
    const otherTeams = Object.keys(teams).filter(team => 
        team !== gameData.selectedTeam && team !== gameData.currentOpponent
    );
    
    // 짝수개의 팀들을 랜덤하게 매칭
    for (let i = 0; i < otherTeams.length - 1; i += 2) {
        const team1 = otherTeams[i];
        const team2 = otherTeams[i + 1];
        
        // 각 팀의 전력 계산
        const team1Rating = calculateOpponentTeamRating(team1);
        const team2Rating = calculateOpponentTeamRating(team2);
        const ratingDiff = team1Rating - team2Rating;
        
        // 이변 요소 (10% 확률로 이변 발생)
        const upsetOccurs = Math.random() < 0.08;
        
        // 전력 차이에 따른 확률 조정
        let team1WinChance = 0.33; // 기본 33%
        let team2WinChance = 0.33; // 기본 33%
        let drawChance = 0.34; // 기본 34%
        
        if (ratingDiff > 0) {
            // team1이 더 강함
            const advantage = Math.min(0.3, ratingDiff / 150); // 최대 30% 우위
            team1WinChance += advantage;
            team2WinChance -= advantage * 0.7;
            drawChance -= advantage * 0.3;
            
            // 이변 발생 시 약한 팀에게 보너스
            if (upsetOccurs) {
                const upsetBonus = 0.15 + (Math.random() * 0.15); // 15~30% 보너스
                team2WinChance += upsetBonus;
                team1WinChance -= upsetBonus * 0.6;
                drawChance -= upsetBonus * 0.4;
            }
        } else if (ratingDiff < 0) {
            // team2가 더 강함
            const advantage = Math.min(0.3, Math.abs(ratingDiff) / 100);
            team2WinChance += advantage;
            team1WinChance -= advantage * 0.7;
            drawChance -= advantage * 0.3;
            
            // 이변 발생 시 약한 팀에게 보너스
            if (upsetOccurs) {
                const upsetBonus = 0.15 + (Math.random() * 0.15); // 15~30% 보너스
                team1WinChance += upsetBonus;
                team2WinChance -= upsetBonus * 0.6;
                drawChance -= upsetBonus * 0.4;
            }
        } else {
            // 비슷한 전력일 때도 랜덤 요소
            const randomFactor = (Math.random() - 0.5) * 0.2; // ±10%
            team1WinChance += randomFactor;
            team2WinChance -= randomFactor;
        }
        
        // 확률 보정 (음수 방지 및 합계 1.0 유지)
        team1WinChance = Math.max(0.05, team1WinChance);
        team2WinChance = Math.max(0.05, team2WinChance);
        drawChance = Math.max(0.05, drawChance);
        
        const total = team1WinChance + team2WinChance + drawChance;
        team1WinChance /= total;
        team2WinChance /= total;
        drawChance /= total;
        
        const resultRoll = Math.random();
        let score1, score2;
        
        if (resultRoll < team1WinChance) {
            // team1 승리 - 더 현실적인 스코어
            if (upsetOccurs && ratingDiff < 0) {
                // 이변 승리는 간신히 이기는 느낌
                score1 = Math.floor(Math.random() * 2) + 1; // 1-2골
                score2 = Math.floor(Math.random() * 2); // 0-1골
            } else {
                // 일반 승리도 현실적으로
                const goalType = Math.random();
                if (goalType < 0.4) {
                    // 40% - 1골 승부
                    score1 = 1;
                    score2 = 0;
                } else if (goalType < 0.7) {
                    // 30% - 2골 차 승부
                    score1 = 2;
                    score2 = Math.random() < 0.5 ? 0 : 1;
                } else if (goalType < 0.9) {
                    // 20% - 3골 이상 게임
                    score1 = Math.floor(Math.random() * 2) + 2; // 2-3골
                    score2 = Math.floor(Math.random() * 2); // 0-1골
                } else {
                    // 10% - 높은 득점 게임
                    score1 = Math.floor(Math.random() * 3) + 2; // 2-4골
                    score2 = Math.floor(Math.random() * 3); // 0-2골
                }
            }
        } else if (resultRoll < team1WinChance + team2WinChance) {
            // team2 승리 - 더 현실적인 스코어
            if (upsetOccurs && ratingDiff > 0) {
                // 이변 승리는 간신히 이기는 느낌
                score2 = Math.floor(Math.random() * 2) + 1; // 1-2골
                score1 = Math.floor(Math.random() * 2); // 0-1골
            } else {
                // 일반 승리도 현실적으로
                const goalType = Math.random();
                if (goalType < 0.4) {
                    // 40% - 1골 승부
                    score2 = 1;
                    score1 = 0;
                } else if (goalType < 0.7) {
                    // 30% - 2골 차 승부
                    score2 = 2;
                    score1 = Math.random() < 0.5 ? 0 : 1;
                } else if (goalType < 0.9) {
                    // 20% - 3골 이상 게임
                    score2 = Math.floor(Math.random() * 2) + 2; // 2-3골
                    score1 = Math.floor(Math.random() * 2); // 0-1골
                } else {
                    // 10% - 높은 득점 게임
                    score2 = Math.floor(Math.random() * 3) + 2; // 2-4골
                    score1 = Math.floor(Math.random() * 3); // 0-2골
                }
            }
        } else {
            // 무승부 - 더 다양한 스코어
            const drawType = Math.random();
            if (drawType < 0.4) {
                // 40% - 0-0 무승부
                score1 = 0;
                score2 = 0;
            } else if (drawType < 0.7) {
                // 30% - 1-1 무승부
                score1 = 1;
                score2 = 1;
            } else if (drawType < 0.9) {
                // 20% - 2-2 무승부
                score1 = 2;
                score2 = 2;
            } else {
                // 10% - 3-3 이상 무승부
                const drawScore = Math.floor(Math.random() * 2) + 3; // 3-4골
                score1 = drawScore;
                score2 = drawScore;
            }
        }
        
        // 리그 데이터 업데이트
        const team1Data = gameData.leagueData[team1];
        const team2Data = gameData.leagueData[team2];
        
        team1Data.matches++;
        team1Data.goalsFor += score1;
        team1Data.goalsAgainst += score2;
        
        team2Data.matches++;
        team2Data.goalsFor += score2;
        team2Data.goalsAgainst += score1;
        
        if (score1 > score2) {
            team1Data.wins++;
            team1Data.points += 3;
            team2Data.losses++;
        } else if (score1 < score2) {
            team2Data.wins++;
            team2Data.points += 3;
            team1Data.losses++;
        } else {
            team1Data.draws++;
            team2Data.draws++;
            team1Data.points += 1;
            team2Data.points += 1;
        }
    }
}

function startInterview(result, userScore, opponentScore, strengthDiff) {
    showScreen('interviewScreen');
    
    const questions = getInterviewQuestions(result, userScore, opponentScore, strengthDiff);
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    
    document.getElementById('interviewQuestion').textContent = randomQuestion.question;
    
    const optionButtons = document.querySelectorAll('.interview-btn');
    randomQuestion.options.forEach((option, index) => {
        if (optionButtons[index]) {
            optionButtons[index].textContent = option.text;
            optionButtons[index].dataset.morale = option.morale;
            optionButtons[index].style.display = 'block';
        }
    });
    
    // 사용하지 않는 버튼 숨기기
    for (let i = randomQuestion.options.length; i < optionButtons.length; i++) {
        optionButtons[i].style.display = 'none';
    }
}

function getInterviewQuestions(result, userScore, opponentScore, strengthDiff) {
    const scoreDiff = Math.abs(userScore - opponentScore);
    const isUpset = (result === '승리' && !strengthDiff.userAdvantage) || 
                   (result === '패배' && strengthDiff.userAdvantage);
    
    if (result === '승리') {
        if (isUpset) {
            // 업셋 승리
            return [{
                question: "전력상 불리했던 상대를 상대로 훌륭한 승리를 거뒀는데 소감은?",
                options: [
                    { text: "선수들이 정말 대단했습니다! 불가능을 가능하게 만들었어요!", morale: 20 },
                    { text: "우리의 전술과 준비가 완벽했습니다. 이런 결과가 우연이 아닙니다!", morale: 15 },
                    { text: "좋은 결과지만 상대가 컨디션이 좋지 않았던 것 같네요.", morale: 5 }
                ]
            }];
        } else if (scoreDiff >= 3) {
            // 대승
            return [{
                question: "예상대로 대승을 거둔 소감은 어떠신가요?",
                options: [
                    { text: "선수들이 정말 훌륭했습니다! 완벽한 경기였어요!", morale: 15 },
                    { text: "우리의 실력을 보여준 경기였습니다. 계속 이렇게 하겠습니다!", morale: 10 },
                    { text: "상대가 너무 약했네요. 별로 의미 없는 승리입니다.", morale: -5 }
                ]
            }];
        } else {
            // 일반 승리
            return [{
                question: "승리를 거둔 소감은 어떠신가요?",
                options: [
                    { text: "정말 훌륭한 경기였습니다! 여러분이 자랑스럽습니다!", morale: 10 },
                    { text: "팀워크가 빛났습니다! 계속 이렇게 해봅시다!", morale: 5 },
                    { text: "몇몇 실수는 아쉬웠습니다. 다음에는 더 집중해야 합니다.", morale: -5 }
                ]
            }];
        }
    } else if (result === '패배') {
        if (isUpset) {
            // 충격적 패배
            return [{
                question: "전력상 유리했음에도 불구하고 패배했는데 어떻게 생각하시나요?",
                options: [
                    { text: "이런 경기는 절대 용납할 수 없습니다! 무엇이 잘못되었는지 철저히 분석하겠습니다!", morale: -20 },
                    { text: "실망스럽지만 축구는 그런 스포츠입니다. 다음에는 더 집중하겠습니다.", morale: -10 },
                    { text: "상대가 정말 잘했습니다. 우리도 배울 점이 있었어요.", morale: 0 }
                ]
            }];
        } else if (scoreDiff >= 3) {
            // 대패
            return [{
                question: "어려운 상대를 만나 대패를 당했는데 소감은?",
                options: [
                    { text: "이번 경기는 정말 실망스러웠습니다. 더 잘할 수 있었는데...", morale: -15 },
                    { text: "상대가 훨씬 강했습니다. 우리는 더 많이 배우고 성장해야 합니다.", morale: -5 },
                    { text: "힘든 경기를 치렀지만, 여러분의 노력은 인정합니다. 다음에 더 좋은 결과를 기대합니다.", morale: 5 }
                ]
            }];
        } else {
            // 일반 패배
            return [{
                question: "아쉬운 패배를 당했는데 소감은 어떠신가요?",
                options: [
                    { text: "이번 경기는 정말 실망스러웠습니다. 더 잘할 수 있었는데...", morale: -10 },
                    { text: "아쉽지만 상대가 더 잘했습니다. 다음에는 더 준비해서 임하겠습니다.", morale: -3 },
                    { text: "힘든 경기를 치렀지만, 여러분의 노력은 인정합니다.", morale: 5 }
                ]
            }];
        }
    } else {
        // 무승부
        if (strengthDiff.userAdvantage && strengthDiff.strengthGap > 10) {
            // 강한 팀이 무승부
            return [{
                question: "유리한 전력에도 불구하고 무승부로 끝났는데 소감은?",
                options: [
                    { text: "승리할 수 있었던 경기였는데 정말 아쉽습니다.", morale: -8 },
                    { text: "상대의 수비가 견고했습니다. 다음에는 더 창의적으로 공격하겠습니다.", morale: -3 },
                    { text: "무승부도 나쁘지 않은 결과입니다. 꾸준히 발전하고 있어요.", morale: 2 }
                ]
            }];
        } else if (!strengthDiff.userAdvantage && strengthDiff.strengthGap > 10) {
            // 약한 팀이 무승부
            return [{
                question: "강한 상대를 상대로 무승부를 기록했는데 소감은?",
                options: [
                    { text: "정말 자랑스러운 결과입니다! 선수들이 최선을 다했어요!", morale: 12 },
                    { text: "좋은 결과입니다. 우리의 가능성을 보여준 경기였어요.", morale: 8 },
                    { text: "승리까지 이어가지 못해 아쉽습니다.", morale: 3 }
                ]
            }];
        } else {
            // 비슷한 전력 간 무승부
            return [{
                question: "팽팽한 경기에서 무승부로 경기가 끝났는데 소감은?",
                options: [
                    { text: "더 좋은 결과를 원했지만, 선수들이 최선을 다했습니다.", morale: 3 },
                    { text: "승리할 수 있었던 경기였는데 아쉽습니다.", morale: -5 },
                    { text: "무승부도 나쁘지 않은 결과입니다. 다음 경기에 집중하겠습니다.", morale: 1 }
                ]
            }];
        }
    }
}

function handleInterview(option) {
    const moraleChange = parseInt(document.querySelector(`[data-option="${option}"]`).dataset.morale);
    
    gameData.teamMorale = Math.max(0, Math.min(100, gameData.teamMorale + moraleChange));
    
    // 다음 상대 설정
    setNextOpponent();
    
    // 시즌 종료 체크
    checkSeasonEnd();
    
    // 로비로 돌아가기
    showScreen('lobby');
    updateDisplay();
    
    alert(`인터뷰 완료! 팀 사기가 ${moraleChange > 0 ? '+' : ''}${moraleChange} 변했습니다.\n현재 사기: ${gameData.teamMorale}`);
}

function checkSeasonEnd() {
    // 어느 한 팀이라도 36경기를 했는지 확인 (기존: 모든 팀이 36경기)
    const anyTeamCompleted = Object.values(gameData.leagueData).some(team => team.matches >= 36);
    
    if (anyTeamCompleted) {
        endSeason();
    }
}

function endSeason() {
    // 최종 순위 계산
    const standings = Object.keys(gameData.leagueData).map(teamKey => ({
        team: teamKey,
        ...gameData.leagueData[teamKey],
        goalDiff: gameData.leagueData[teamKey].goalsFor - gameData.leagueData[teamKey].goalsAgainst
    })).sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
        return b.goalsFor - a.goalsFor;
    });
    
    const userPosition = standings.findIndex(team => team.team === gameData.selectedTeam) + 1;
    let reward = 0;
    let achievement = '';
    
    if (userPosition === 1) {
        achievement = '우승';
        reward = 1500;
    } else if (userPosition <= 4) {
        achievement = '상위권';
        reward = 1000;
    } else if (userPosition <= 12) {
        achievement = '중위권';
        reward = 500;
    } else {
        achievement = '강등권';
        reward = 200;
    }
    
    gameData.teamMoney += reward;
    
    // 선수 나이 증가
    if (typeof advancePlayerAges === 'function') {
        advancePlayerAges();
    }
    
    // 시즌 리셋
    initializeLeagueData();
    gameData.matchesPlayed = 0;
    
    alert(`시즌 종료!\n최종 순위: ${userPosition}위 (${achievement})\n보상: ${reward}억원`);
}

// 전역으로 함수들 노출
window.TacticSystem = TacticSystem;
window.startMatch = startMatch;
window.handleInterview = handleInterview;
