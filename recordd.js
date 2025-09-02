// 개인기록 시스템
class RecordsSystem {
    constructor() {
        this.playerStats = new Map(); // 선수별 통계
        this.matchRecords = []; // 경기 기록
        this.initialized = false;
    }

    // 시스템 초기화
    initialize() {
        if (this.initialized) return;
        
        // 모든 팀의 선수들 초기화
        Object.keys(teams).forEach(teamKey => {
            teams[teamKey].forEach(player => {
                this.initializePlayer(player.name, teamKey, player.position);
            });
        });
        
        this.initialized = true;
        console.log('개인기록 시스템이 초기화되었습니다.');
    }

    // 선수 초기화
    initializePlayer(playerName, teamKey, position) {
        if (!this.playerStats.has(playerName)) {
            this.playerStats.set(playerName, {
                name: playerName,
                team: teamKey,
                position: position,
                goals: 0,
                assists: 0,
                matches: 0
            });
        }
    }

    // 골 기록 추가
    addGoal(scorerName, assisterName = null, teamKey) {
        // 득점자 기록
        if (this.playerStats.has(scorerName)) {
            const scorerStats = this.playerStats.get(scorerName);
            scorerStats.goals++;
        } else {
            // 새로운 선수라면 초기화 후 기록
            const player = this.findPlayerByName(scorerName, teamKey);
            if (player) {
                this.initializePlayer(scorerName, teamKey, player.position);
                const scorerStats = this.playerStats.get(scorerName);
                scorerStats.goals++;
            }
        }

        // 어시스트 기록
        if (assisterName && this.playerStats.has(assisterName)) {
            const assisterStats = this.playerStats.get(assisterName);
            assisterStats.assists++;
        } else if (assisterName) {
            // 새로운 선수라면 초기화 후 기록
            const player = this.findPlayerByName(assisterName, teamKey);
            if (player) {
                this.initializePlayer(assisterName, teamKey, player.position);
                const assisterStats = this.playerStats.get(assisterName);
                assisterStats.assists++;
            }
        }
    }

    // 경기 출전 기록 추가
    addMatchAppearance(playerName, teamKey) {
        if (this.playerStats.has(playerName)) {
            const playerStats = this.playerStats.get(playerName);
            playerStats.matches++;
        } else {
            const player = this.findPlayerByName(playerName, teamKey);
            if (player) {
                this.initializePlayer(playerName, teamKey, player.position);
                const playerStats = this.playerStats.get(playerName);
                playerStats.matches++;
            }
        }
    }

    // 이름으로 선수 찾기
    findPlayerByName(playerName, teamKey) {
        if (teams[teamKey]) {
            return teams[teamKey].find(p => p.name === playerName);
        }
        
        // 모든 팀에서 찾기
        for (const [key, teamPlayers] of Object.entries(teams)) {
            const player = teamPlayers.find(p => p.name === playerName);
            if (player) return player;
        }
        
        return null;
    }

    // 득점왕 순위 가져오기 (상위 5명)
    getTopScorers(limit = 5) {
        const scorers = Array.from(this.playerStats.values())
            .filter(player => player.goals > 0)
            .sort((a, b) => {
                if (b.goals !== a.goals) return b.goals - a.goals;
                return b.assists - a.assists; // 동득점시 어시스트로 정렬
            })
            .slice(0, limit);

        return scorers;
    }

    // 도움왕 순위 가져오기 (상위 5명)
    getTopAssisters(limit = 5) {
        const assisters = Array.from(this.playerStats.values())
            .filter(player => player.assists > 0)
            .sort((a, b) => {
                if (b.assists !== a.assists) return b.assists - a.assists;
                return b.goals - a.goals; // 동어시스트시 골로 정렬
            })
            .slice(0, limit);

        return assisters;
    }

    // 기존 simulateOtherMatches 함수에 개인기록을 추가하는 함수
    enhanceExistingSimulation(otherTeams) {
        console.log('=== AI 팀들 간 경기 결과 ===');
        
        // 짝수개의 팀들을 랜덤하게 매칭 (기존 로직과 동일)
        for (let i = 0; i < otherTeams.length - 1; i += 2) {
            const team1 = otherTeams[i];
            const team2 = otherTeams[i + 1];
            
            // 기존 simulateOtherMatches에서 생성된 스코어를 사용하는 대신
            // 여기서는 개인 기록을 위한 상세 데이터를 생성
            const matchResult = this.createDetailedMatchRecord(team1, team2);
            this.matchRecords.push(matchResult);
            
            console.log(`${teamNames[team1]} ${matchResult.score1} - ${matchResult.score2} ${teamNames[team2]}`);
            
            // 골 기록 출력
            matchResult.goals.forEach(goal => {
                let goalLog = `  ⚽ ${goal.minute}분: ${goal.scorer}`;
                if (goal.assister) {
                    goalLog += ` (도움: ${goal.assister})`;
                }
                goalLog += ` [${teamNames[goal.team]}]`;
                console.log(goalLog);
            });
        }
        
        console.log('========================');
    }

    // 기존 AI 경기 결과에 상세 기록을 추가하는 함수
    createDetailedMatchRecord(team1Key, team2Key) {
        // 리그 데이터에서 이미 계산된 결과를 가져오거나 새로 계산
        const team1Data = gameData.leagueData[team1Key];
        const team2Data = gameData.leagueData[team2Key];
        
        // 현재 경기의 득실점을 추정 (최근 경기 결과)
        const estimatedScore1 = Math.max(0, Math.min(5, Math.floor(Math.random() * 3)));
        const estimatedScore2 = Math.max(0, Math.min(5, Math.floor(Math.random() * 3)));
        
        // 골 이벤트 생성
        const goals = this.generateGoalEvents(team1Key, team2Key, estimatedScore1, estimatedScore2);
        
        // 개인기록에 반영
        goals.forEach(goal => {
            this.addGoal(goal.scorer, goal.assister, goal.team);
        });
        
        // 출전 기록 추가
        this.addMatchAppearancesForTeam(team1Key);
        this.addMatchAppearancesForTeam(team2Key);
        
        return {
            team1: team1Key,
            team2: team2Key,
            score1: estimatedScore1,
            score2: estimatedScore2,
            goals: goals,
            minute: 90
        };
    }

    // 단일 AI 경기 시뮬레이션
    simulateSingleAIMatch(team1Key, team2Key) {
        const team1Rating = this.calculateAITeamRating(team1Key);
        const team2Rating = this.calculateAITeamRating(team2Key);
        const ratingDiff = team1Rating - team2Rating;
        
        // 이변 요소
        const upsetOccurs = Math.random() < 0.08;
        
        // 전력 차이에 따른 확률 조정
        let team1WinChance = 0.33;
        let team2WinChance = 0.33;
        let drawChance = 0.34;
        
        if (ratingDiff > 0) {
            const advantage = Math.min(0.3, ratingDiff / 150);
            team1WinChance += advantage;
            team2WinChance -= advantage * 0.7;
            drawChance -= advantage * 0.3;
            
            if (upsetOccurs) {
                const upsetBonus = 0.15 + (Math.random() * 0.15);
                team2WinChance += upsetBonus;
                team1WinChance -= upsetBonus * 0.6;
                drawChance -= upsetBonus * 0.4;
            }
        } else if (ratingDiff < 0) {
            const advantage = Math.min(0.3, Math.abs(ratingDiff) / 100);
            team2WinChance += advantage;
            team1WinChance -= advantage * 0.7;
            drawChance -= advantage * 0.3;
            
            if (upsetOccurs) {
                const upsetBonus = 0.15 + (Math.random() * 0.15);
                team1WinChance += upsetBonus;
                team2WinChance -= upsetBonus * 0.6;
                drawChance -= upsetBonus * 0.4;
            }
        }
        
        // 확률 보정
        team1WinChance = Math.max(0.05, team1WinChance);
        team2WinChance = Math.max(0.05, team2WinChance);
        drawChance = Math.max(0.05, drawChance);
        
        const total = team1WinChance + team2WinChance + drawChance;
        team1WinChance /= total;
        team2WinChance /= total;
        drawChance /= total;
        
        // 경기 결과 결정
        const resultRoll = Math.random();
        let score1, score2;
        
        if (resultRoll < team1WinChance) {
            [score1, score2] = this.generateRealisticScore(true, upsetOccurs && ratingDiff < 0);
        } else if (resultRoll < team1WinChance + team2WinChance) {
            [score2, score1] = this.generateRealisticScore(true, upsetOccurs && ratingDiff > 0);
        } else {
            [score1, score2] = this.generateDrawScore();
        }
        
        // 골 이벤트 생성
        const goals = this.generateGoalEvents(team1Key, team2Key, score1, score2);
        
        // 개인기록에 반영
        goals.forEach(goal => {
            this.addGoal(goal.scorer, goal.assister, goal.team);
        });
        
        // 출전 기록 추가 (각 팀 주전 11명)
        this.addMatchAppearancesForTeam(team1Key);
        this.addMatchAppearancesForTeam(team2Key);
        
        return {
            team1: team1Key,
            team2: team2Key,
            score1: score1,
            score2: score2,
            goals: goals,
            minute: 90
        };
    }

    // AI 팀 전력 계산
    calculateAITeamRating(teamKey) {
        const teamPlayers = teams[teamKey];
        if (!teamPlayers || teamPlayers.length === 0) return 70;

        const sortedPlayers = teamPlayers.sort((a, b) => b.rating - a.rating);
        const topPlayers = sortedPlayers.slice(0, 11);
        const totalRating = topPlayers.reduce((sum, player) => sum + player.rating, 0);
        
        return totalRating / topPlayers.length;
    }

    // 현실적인 승부 스코어 생성
    generateRealisticScore(isWin, isUpset) {
        if (isUpset) {
            const winScore = Math.floor(Math.random() * 2) + 1;
            const loseScore = Math.floor(Math.random() * 2);
            return [winScore, loseScore];
        }
        
        const goalType = Math.random();
        if (goalType < 0.4) {
            return [1, 0];
        } else if (goalType < 0.7) {
            return [2, Math.random() < 0.5 ? 0 : 1];
        } else if (goalType < 0.9) {
            return [Math.floor(Math.random() * 2) + 2, Math.floor(Math.random() * 2)];
        } else {
            return [Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3)];
        }
    }

    // 무승부 스코어 생성
    generateDrawScore() {
        const drawType = Math.random();
        if (drawType < 0.4) {
            return [0, 0];
        } else if (drawType < 0.7) {
            return [1, 1];
        } else if (drawType < 0.9) {
            return [2, 2];
        } else {
            const drawScore = Math.floor(Math.random() * 2) + 3;
            return [drawScore, drawScore];
        }
    }

    // 골 이벤트 생성
    generateGoalEvents(team1Key, team2Key, score1, score2) {
        const goals = [];
        const totalGoals = score1 + score2;
        
        // 골 시간대 생성 (5분~90분 사이)
        const goalTimes = [];
        for (let i = 0; i < totalGoals; i++) {
            goalTimes.push(Math.floor(Math.random() * 86) + 5);
        }
        goalTimes.sort((a, b) => a - b);
        
        let team1Goals = 0;
        let team2Goals = 0;
        
        goalTimes.forEach((minute, index) => {
            let scoringTeam;
            
            // 어느 팀이 골을 넣을지 결정
            if (team1Goals < score1 && team2Goals < score2) {
                scoringTeam = Math.random() < 0.5 ? team1Key : team2Key;
            } else if (team1Goals < score1) {
                scoringTeam = team1Key;
            } else {
                scoringTeam = team2Key;
            }
            
            if (scoringTeam === team1Key) {
                team1Goals++;
            } else {
                team2Goals++;
            }
            
            const goalEvent = this.generateSingleGoal(scoringTeam, minute);
            goals.push(goalEvent);
        });
        
        return goals;
    }

    // 단일 골 이벤트 생성
    generateSingleGoal(teamKey, minute) {
        const teamPlayers = teams[teamKey];
        if (!teamPlayers || teamPlayers.length === 0) {
            return {
                minute: minute,
                team: teamKey,
                scorer: "알 수 없는 선수",
                assister: null
            };
        }
        
        // 포지션별로 선수 분류
        const forwards = teamPlayers.filter(p => p.position === 'FW').sort((a, b) => b.rating - a.rating);
        const midfielders = teamPlayers.filter(p => p.position === 'MF').sort((a, b) => b.rating - a.rating);
        const defenders = teamPlayers.filter(p => p.position === 'DF').sort((a, b) => b.rating - a.rating);
        
        // 득점자 선택 (FW: 75%, MF: 21%, DF: 4%)
        const scorerPool = [];
        
        forwards.slice(0, 3).forEach(player => {
            for (let i = 0; i < 75; i++) scorerPool.push(player);
        });
        
        midfielders.slice(0, 3).forEach(player => {
            for (let i = 0; i < 21; i++) scorerPool.push(player);
        });
        
        defenders.slice(0, 4).forEach(player => {
            for (let i = 0; i < 4; i++) scorerPool.push(player);
        });
        
        const scorer = scorerPool[Math.floor(Math.random() * scorerPool.length)];
        
        // 어시스트 선택 (85% 확률)
        let assister = null;
        if (Math.random() < 0.85) {
            const assisterPool = [];
            
            forwards.slice(0, 3).filter(p => p.name !== scorer.name).forEach(player => {
                for (let i = 0; i < 50; i++) assisterPool.push(player);
            });
            
            midfielders.slice(0, 3).filter(p => p.name !== scorer.name).forEach(player => {
                for (let i = 0; i < 45; i++) assisterPool.push(player);
            });
            
            defenders.slice(0, 4).filter(p => p.name !== scorer.name).forEach(player => {
                for (let i = 0; i < 5; i++) assisterPool.push(player);
            });
            
            if (assisterPool.length > 0) {
                assister = assisterPool[Math.floor(Math.random() * assisterPool.length)];
            }
        }
        
        return {
            minute: minute,
            team: teamKey,
            scorer: scorer ? scorer.name : "알 수 없는 선수",
            assister: assister ? assister.name : null
        };
    }

    // 팀의 출전 기록 추가
    addMatchAppearancesForTeam(teamKey) {
        const teamPlayers = teams[teamKey];
        if (!teamPlayers) return;
        
        // 포지션별 상위 선수들 선택 (4-3-3 포메이션 기준)
        const gks = teamPlayers.filter(p => p.position === 'GK').sort((a, b) => b.rating - a.rating);
        const dfs = teamPlayers.filter(p => p.position === 'DF').sort((a, b) => b.rating - a.rating);
        const mfs = teamPlayers.filter(p => p.position === 'MF').sort((a, b) => b.rating - a.rating);
        const fws = teamPlayers.filter(p => p.position === 'FW').sort((a, b) => b.rating - a.rating);
        
        // 주전 11명 선택
        const starters = [];
        
        if (gks.length > 0) starters.push(gks[0]);
        for (let i = 0; i < 4 && i < dfs.length; i++) starters.push(dfs[i]);
        for (let i = 0; i < 3 && i < mfs.length; i++) starters.push(mfs[i]);
        for (let i = 0; i < 3 && i < fws.length; i++) starters.push(fws[i]);
        
        // 출전 기록 추가
        starters.forEach(player => {
            this.addMatchAppearance(player.name, teamKey);
        });
    }

    // 개인기록 표시 업데이트
    updateRecordsDisplay() {
        const topScorers = this.getTopScorers(5);
        const topAssisters = this.getTopAssisters(5);
        
        this.displayTopScorers(topScorers);
        this.displayTopAssisters(topAssisters);
    }

    // 득점왕 순위 표시
    displayTopScorers(topScorers) {
        const container = document.getElementById('topScorers');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (topScorers.length === 0) {
            container.innerHTML = '<p style="text-align: center; opacity: 0.7;">아직 기록이 없습니다.</p>';
            return;
        }
        
        topScorers.forEach((player, index) => {
            const isUserPlayer = player.team === gameData.selectedTeam;
            const rankingItem = document.createElement('div');
            rankingItem.className = `ranking-item ${isUserPlayer ? 'user-player' : ''}`;
            
            rankingItem.innerHTML = `
                <div class="player-rank">${index + 1}</div>
                <div class="player-info">
                    <div class="player-name">${player.name}</div>
                    <div class="player-team">${teamNames[player.team] || '알 수 없음'}</div>
                </div>
                <div class="player-stats">${player.goals}</div>
            `;
            
            container.appendChild(rankingItem);
        });
    }

    // 도움왕 순위 표시
    displayTopAssisters(topAssisters) {
        const container = document.getElementById('topAssisters');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (topAssisters.length === 0) {
            container.innerHTML = '<p style="text-align: center; opacity: 0.7;">아직 기록이 없습니다.</p>';
            return;
        }
        
        topAssisters.forEach((player, index) => {
            const isUserPlayer = player.team === gameData.selectedTeam;
            const rankingItem = document.createElement('div');
            rankingItem.className = `ranking-item ${isUserPlayer ? 'user-player' : ''}`;
            
            rankingItem.innerHTML = `
                <div class="player-rank">${index + 1}</div>
                <div class="player-info">
                    <div class="player-name">${player.name}</div>
                    <div class="player-team">${teamNames[player.team] || '알 수 없음'}</div>
                </div>
                <div class="player-stats">${player.assists}</div>
            `;
            
            container.appendChild(rankingItem);
        });
    }

    // 선수 골/어시스트 기록 (사용자 팀 경기에서)
    recordUserMatchStats(matchEvents) {
        // 사용자 팀 선수들의 출전 기록 추가
        this.addMatchAppearancesForUserTeam();
        
        // 경기 이벤트에서 골 기록 추출
        matchEvents.forEach(event => {
            if (event.type === 'goal') {
                this.addGoal(event.scorer, event.assister, 
                    event.team === teamNames[gameData.selectedTeam] ? gameData.selectedTeam : gameData.currentOpponent);
            }
        });
        
        // 기존 simulateOtherMatches가 실행된 후에 개인기록만 추가
        const otherTeams = Object.keys(teams).filter(team => 
            team !== gameData.selectedTeam && team !== gameData.currentOpponent
        );
        
        if (otherTeams.length >= 2) {
            this.enhanceExistingSimulation(otherTeams);
        }
        
        // 화면 업데이트
        this.updateRecordsDisplay();
    }

    // 사용자 팀 출전 기록 추가
    addMatchAppearancesForUserTeam() {
        const squad = gameData.squad;
        
        if (squad.gk) this.addMatchAppearance(squad.gk.name, gameData.selectedTeam);
        
        squad.df.forEach(player => {
            if (player) this.addMatchAppearance(player.name, gameData.selectedTeam);
        });
        
        squad.mf.forEach(player => {
            if (player) this.addMatchAppearance(player.name, gameData.selectedTeam);
        });
        
        squad.fw.forEach(player => {
            if (player) this.addMatchAppearance(player.name, gameData.selectedTeam);
        });
    }

    // 저장 데이터 준비
    getSaveData() {
        return {
            playerStats: Array.from(this.playerStats.entries()),
            matchRecords: this.matchRecords,
            initialized: this.initialized
        };
    }

    // 저장 데이터 로드
    loadSaveData(saveData) {
        if (saveData.playerStats) {
            this.playerStats = new Map(saveData.playerStats);
        }
        if (saveData.matchRecords) {
            this.matchRecords = saveData.matchRecords;
        }
        if (saveData.initialized) {
            this.initialized = saveData.initialized;
        }
    }

    // 시즌 리셋
    resetSeason() {
        this.playerStats.clear();
        this.matchRecords = [];
        this.initialized = false;
        console.log('개인기록이 리셋되었습니다.');
    }
}

// 전역 개인기록 시스템 인스턴스
const recordsSystem = new RecordsSystem();

// 게임 초기화 시 개인기록 시스템도 초기화
function initializeRecordsSystem() {
    recordsSystem.initialize();
}

// 경기 종료 후 개인기록 업데이트
function updateRecordsAfterMatch(matchData) {
    recordsSystem.recordUserMatchStats(matchData.events || []);
}

// 개인기록 탭 표시 시 업데이트
function updateRecordsTab() {
    recordsSystem.updateRecordsDisplay();
}

// 전역으로 함수들 노출
window.recordsSystem = recordsSystem;
window.initializeRecordsSystem = initializeRecordsSystem;
window.updateRecordsAfterMatch = updateRecordsAfterMatch;
window.updateRecordsTab = updateRecordsTab;
