# AI Recommendation Algorithm - CareerGPS

## Overview

The recommendation engine uses a **hybrid model** combining:
1. **Content-based filtering** — Skills from similar simulations
2. **Collaborative filtering** — Engagement patterns from similar users
3. **Engagement scoring** — Behavior-based metrics (not surveys)
4. **Trend analysis** — Improvement vectors & persistence signals

---

## Pseudocode

### Phase 1: Data Collection

```python
function collectEngagementData(userId):
    engagements = fetch(Engagement where userId = userId)
    
    metrics = {
        "totalTimeSpent": sum(engagement.timeSpent for all engagements),
        "totalRetries": sum(engagement.retryCount for all engagements),
        "avgScore": avg(engagement.score for all engagements),
        "completionRate": count(completed) / count(all),
        "skillsGained": flatten([engagement.skillsGained for all compl engagements])
    }
    
    return metrics
```

### Phase 2: Engagement Scoring

```python
function calculateEngagementScore(metrics):
    """
    Engagement = Completion ⊕ Persistence ⊕ Performance
    
    Weights:
    - Completion: 40% (did they finish?)
    - Retry behavior: 30% (persistence signal)
    - Score improvement: 20% (progress)
    - Time consistency: 10% (dedication)
    """
    
    completion_score = metrics.completionRate * 100
    
    retry_score = min(
        (metrics.totalRetries / metrics.completedSimulations) * 50,
        100
    )
    // High retries = persistence, capped at 100
    
    avg_improvement = (
        (max_score - min_score) / min_score * 100
    )
    improvement_score = min(avg_improvement, 50)
    
    engagement_index = (
        (completion_score * 0.4) +
        (retry_score * 0.3) +
        (improvement_score * 0.2) +
        (consistency_score * 0.1)
    )
    
    return engagement_index  // 0-100
```

### Phase 3: Content-Based Filtering

```python
function findSimilarSimulations(userId, topN=3):
    """
    Find simulations similar to ones user excelled in
    """
    
    highPerformanceSimulations = [
        sim for sim in userCompletedSimulations
        if sim.score >= 75  // 75+ score threshold
    ]
    
    skillsFromHighPerf = flatten(
        [sim.skillsTagged for sim in highPerformanceSimulations]
    )
    
    // Find simulations with matching skills (exclude completed)
    recommendedByContent = [
        sim for sim in allSimulations
        if intersection(sim.skillsTagged, skillsFromHighPerf) > 0
        AND sim not in userCompletedSimulations
    ]
    
    // Rank by skill overlap
    sortedBySkillOverlap = sort(
        recommendedByContent,
        key = lambda sim: len(intersection(
            sim.skillsTagged,
            skillsFromHighPerf
        ))
    )
    
    return sortedBySkillOverlap[:topN]
```

### Phase 4: Collaborative Filtering

```python
function findSimilarUserProfiles(userId):
    """
    Find students with similar grade, engagement patterns
    """
    
    userProfile = {
        "grade": user.grade,
        "engagementIndex": user.engagementIndex,
        "skillProfile": user.skillScores,
        "avgScore": metrics.avgScore
    }
    
    similarUsers = [
        other for other in allUsers
        if other.grade == userProfile.grade
        AND |other.engagementIndex - userProfile.engagementIndex| < 15
        AND other._id != userId
    ]
    
    // Get simulations completed by similar users (but not by target)
    simByOthers = flatten([
        eng.simulationId for other in similarUsers
        for eng in other.engagements
    ])
    
    notCompletedByTarget = [
        sim for sim in simByOthers
        if sim not in userCompletedSimulations
    ]
    
    // Count frequency (consensus score)
    consensusScore = frequency(notCompletedByTarget)
    topByCollaborative = sort(
        consensusScore,
        key = lambda item: item[1],
        reverse = True
    )[:3]
    
    return topByCollaborative
```

### Phase 5: Skill Gap Analysis

```python
function analyzeSkillGaps(userId, targetCareers):
    """
    What skills needed vs. what user has?
    """
    
    userSkills = user.skillScores  // {skill: score}
    
    skillsPerCareer = fetch(Skill.relatedCareers)
    // {Career: [skill1, skill2, ...]}
    
    careerRequirements = {
        career: skillsPerCareer[career]
        for career in targetCareers
    }
    
    gaps = {}
    
    for career, requiredSkills in careerRequirements.items():
        gapSkills = [
            skill for skill in requiredSkills
            if skill not in userSkills or userSkills[skill] < 60
        ]
        gaps[career] = gapSkills
    
    return gaps  // {Career: [missing_skill1, ...]}
```

### Phase 6: Trend Analysis

```python
function analyzeTrend(userId):
    """
    Calculate improvement direction (positive/plateau/negative)
    """
    
    pastEngagements = sort(
        userCompletedSimulations,
        key = engagement.completionDate
    )
    
    // Get scores from last 5 simulations
    recentScores = [
        eng.score for eng in pastEngagements[-5:]
    ]
    
    if !recentScores or len(recentScores) < 2:
        return "Insufficient data"
    
    // Linear regression: slope
    slope = calculateSlope(recentScores)
    
    if slope > 5:
        trend = "Positive ↗"
    elif slope < -5:
        trend = "Declining ↘"
    else:
        trend = "Stable →"
    
    return trend
```

### Phase 7: Final Recommendation Output

```python
function generateRecommendations(userId):
    """
    Combine all signals into final recommendation
    """
    
    engagementMetrics = collectEngagementData(userId)
    engagementIndex = calculateEngagementScore(engagementMetrics)
    
    contentBasedRecs = findSimilarSimulations(userId, topN=5)
    collaborativeRecs = findSimilarUserProfiles(userId)[:5]
    
    // Weighted blend
    contentWeight = 0.5
    collaborativeWeight = 0.5
    
    blendedRecs = mergeAndRank(
        contentBasedRecs * contentWeight,
        collaborativeRecs * collaborativeWeight
    )[:3]
    
    // Extract career recommendations from skills
    topSkillsFromRecs = flatten([
        sim.skillsTagged for sim in blendedRecs
    ])
    
    skillToCareer = fetch(Skill.relatedCareers)
    recommendedCareers = [
        career for skill in topSkillsFromRecs
        for career in skillToCareer[skill]
    ]
    
    careersWithScore = frequency(recommendedCareers)
    topCareers = sort(careersWithScore)[:3]
    
    skillGaps = analyzeSkillGaps(userId, topCareers)
    trend = analyzeTrend(userId)
    
    output = {
        "topSkills": [skill.name for skill in topSkillsFromRecs[:3]],
        "recommendedCareers": topCareers,
        "engagementIndex": engagementIndex,
        "improvementTrend": trend,
        "skillGapsByCareer": skillGaps,
        "nextSimulationsToTry": blendedRecs[:3],
        "timestamp": now()
    }
    
    return output
```

---

## Key Signals

| Signal | Weight | Meaning |
|--------|--------|---------|
| **Completion** | 40% | Did they finish simulations? |
| **Retries** | 30% | How persistent are they? |
| **Score Growth** | 20% | Are they improving? |
| **Consistency** | 10% | Regular engagement? |

---

## Example Output

```json
{
  "topSkills": ["UI Design", "Problem Solving", "Communication"],
  "recommendedCareers": ["UX Designer", "Product Manager", "Frontend Developer"],
  "engagementIndex": 85,
  "improvementTrend": "Positive ↗",
  "skillGapsByCareer": {
    "UX Designer": ["User Research", "Interaction Design"],
    "Product Manager": ["Data Analysis", "Stakeholder Management"],
    "Frontend Developer": ["React", "CSS Mastery"]
  },
  "nextSimulationsToTry": [
    { "id": "sim_123", "title": "Advanced UI Prototyping", "skills": ["Prototyping"] },
    { "id": "sim_124", "title": "PM Case Study", "skills": ["Product Thinking"] }
  ]
}
```

---

## Continuous Learning

The system improves over time:
1. **Every engagement logged** → Metrics updated
2. **Every completion** → Skills recorded
3. **Every retry** → Persistence signals strengthened
4. **Monthly re-clustering** → Similar user profiles refined

---

## Production Considerations

- **Caching:** Cache user engagement metrics (TTL: 1 hour)
- **Async:** Run recommendation jobs in background (Worker queue)
- **Versioning:** Track algorithm versions for A/B testing
- **Privacy:** Anonymize collaborative signals for GDPR/COPPA
- **Fairness:** Monitor for bias in career recommendations

---

**Algorithm Version:** 1.0 MVP  
**Last Updated:** February 23, 2026
